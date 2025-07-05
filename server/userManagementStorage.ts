import { eq, and, like, or, desc, asc, inArray, isNull, sql } from "drizzle-orm";
import { db } from "./db";
import {
  users,
  userRoles,
  userPermissions,
  userPropertyAssignments,
  freelancerAvailability,
  freelancerTaskRequests,
  userActivityAudit,
  userInvitations,
  userPerformanceMetrics,
  properties,
  DEFAULT_ROLE_PERMISSIONS,
  type UserWithRoleAndPermissions,
  type InsertUserRole,
  type InsertUserPermission,
  type InsertUserPropertyAssignment,
  type InsertFreelancerAvailability,
  type InsertFreelancerTaskRequest,
  type InsertUserActivityAudit,
  type InsertUserInvitation,
  type InsertUserPerformanceMetrics,
  type UserRole,
  type UserPermission,
  type UserPropertyAssignment,
  type FreelancerAvailability,
  type FreelancerTaskRequest,
  type UserActivityAudit,
  type UserInvitation,
  type UserPerformanceMetrics
} from "@shared/schema";
import { nanoid } from "nanoid";
import crypto from "crypto";

export class UserManagementStorage {
  constructor(private organizationId: string) {}

  // ===== USER LISTING AND SEARCH =====
  
  async getAllUsers(filters?: {
    search?: string;
    role?: string;
    propertyId?: number;
    isActive?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<UserWithRoleAndPermissions[]> {
    let query = db
      .select({
        user: users,
        userRole: userRoles,
        userPermissions: userPermissions,
      })
      .from(users)
      .leftJoin(userRoles, and(
        eq(userRoles.userId, users.id),
        eq(userRoles.isActive, true)
      ))
      .leftJoin(userPermissions, eq(userPermissions.userId, users.id))
      .where(eq(users.organizationId, this.organizationId));

    if (filters?.search) {
      query = query.where(
        and(
          eq(users.organizationId, this.organizationId),
          or(
            like(users.firstName, `%${filters.search}%`),
            like(users.lastName, `%${filters.search}%`),
            like(users.email, `%${filters.search}%`)
          )
        )
      );
    }

    if (filters?.role) {
      query = query.where(
        and(
          eq(users.organizationId, this.organizationId),
          eq(userRoles.primaryRole, filters.role)
        )
      );
    }

    if (filters?.isActive !== undefined) {
      query = query.where(
        and(
          eq(users.organizationId, this.organizationId),
          eq(users.isActive, filters.isActive)
        )
      );
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.offset(filters.offset);
    }

    const results = await query.orderBy(asc(users.firstName), asc(users.lastName));

    // Group results and get property assignments
    const userMap = new Map<string, UserWithRoleAndPermissions>();
    
    for (const result of results) {
      const userId = result.user.id;
      
      if (!userMap.has(userId)) {
        userMap.set(userId, {
          ...result.user,
          userRole: result.userRole || undefined,
          userPermissions: result.userPermissions || undefined,
          propertyAssignments: [],
        });
      }
    }

    // Get property assignments for all users
    if (userMap.size > 0) {
      const userIds = Array.from(userMap.keys());
      const propertyAssignments = await db
        .select({
          assignment: userPropertyAssignments,
          property: properties,
        })
        .from(userPropertyAssignments)
        .leftJoin(properties, eq(properties.id, userPropertyAssignments.propertyId))
        .where(
          and(
            eq(userPropertyAssignments.organizationId, this.organizationId),
            inArray(userPropertyAssignments.userId, userIds),
            eq(userPropertyAssignments.isActive, true)
          )
        );

      for (const assignment of propertyAssignments) {
        const user = userMap.get(assignment.assignment.userId);
        if (user) {
          user.propertyAssignments = user.propertyAssignments || [];
          user.propertyAssignments.push({
            ...assignment.assignment,
            property: assignment.property
          });
        }
      }
    }

    return Array.from(userMap.values());
  }

  async getUserById(userId: string): Promise<UserWithRoleAndPermissions | null> {
    const results = await this.getAllUsers({ search: userId });
    return results.find(user => user.id === userId) || null;
  }

  async getUsersByProperty(propertyId: number): Promise<UserWithRoleAndPermissions[]> {
    const propertyAssignments = await db
      .select({ userId: userPropertyAssignments.userId })
      .from(userPropertyAssignments)
      .where(
        and(
          eq(userPropertyAssignments.organizationId, this.organizationId),
          eq(userPropertyAssignments.propertyId, propertyId),
          eq(userPropertyAssignments.isActive, true)
        )
      );

    if (propertyAssignments.length === 0) return [];

    const userIds = propertyAssignments.map(pa => pa.userId);
    const users = await this.getAllUsers();
    return users.filter(user => userIds.includes(user.id));
  }

  // ===== ROLE MANAGEMENT =====

  async assignUserRole(data: InsertUserRole): Promise<UserRole> {
    const [role] = await db
      .insert(userRoles)
      .values({
        ...data,
        organizationId: this.organizationId,
      })
      .returning();

    // Auto-assign default permissions for the role
    await this.assignDefaultPermissions(data.userId, data.primaryRole);

    // Log the action
    await this.logUserActivity({
      userId: data.userId,
      action: 'role_change',
      details: { newRole: data.primaryRole, subRole: data.subRole },
      performedBy: data.assignedBy || 'system',
    });

    return role;
  }

  async updateUserRole(userId: string, updates: Partial<InsertUserRole>): Promise<UserRole | null> {
    const [role] = await db
      .update(userRoles)
      .set({ ...updates, updatedAt: new Date() })
      .where(
        and(
          eq(userRoles.organizationId, this.organizationId),
          eq(userRoles.userId, userId),
          eq(userRoles.isActive, true)
        )
      )
      .returning();

    if (role && updates.primaryRole) {
      await this.assignDefaultPermissions(userId, updates.primaryRole);
    }

    return role || null;
  }

  async deactivateUserRole(userId: string, deactivatedBy?: string): Promise<boolean> {
    const result = await db
      .update(userRoles)
      .set({ isActive: false, updatedAt: new Date() })
      .where(
        and(
          eq(userRoles.organizationId, this.organizationId),
          eq(userRoles.userId, userId)
        )
      );

    await this.logUserActivity({
      userId,
      action: 'role_deactivation',
      performedBy: deactivatedBy || 'system',
    });

    return result.rowsAffected! > 0;
  }

  // ===== PERMISSION MANAGEMENT =====

  async assignDefaultPermissions(userId: string, role: string): Promise<UserPermission> {
    const defaultPermissions = DEFAULT_ROLE_PERMISSIONS[role as keyof typeof DEFAULT_ROLE_PERMISSIONS] || 
                               DEFAULT_ROLE_PERMISSIONS.guest;

    // Check if permissions already exist
    const existing = await db
      .select()
      .from(userPermissions)
      .where(
        and(
          eq(userPermissions.organizationId, this.organizationId),
          eq(userPermissions.userId, userId)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      // Update existing permissions
      const [permission] = await db
        .update(userPermissions)
        .set({
          moduleAccess: defaultPermissions,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(userPermissions.organizationId, this.organizationId),
            eq(userPermissions.userId, userId)
          )
        )
        .returning();
      return permission;
    } else {
      // Create new permissions
      const [permission] = await db
        .insert(userPermissions)
        .values({
          organizationId: this.organizationId,
          userId,
          moduleAccess: defaultPermissions,
        })
        .returning();
      return permission;
    }
  }

  async updateUserPermissions(userId: string, moduleAccess: Record<string, boolean>, updatedBy?: string): Promise<UserPermission | null> {
    const [permission] = await db
      .update(userPermissions)
      .set({
        moduleAccess,
        updatedAt: new Date(),
        updatedBy,
      })
      .where(
        and(
          eq(userPermissions.organizationId, this.organizationId),
          eq(userPermissions.userId, userId)
        )
      )
      .returning();

    await this.logUserActivity({
      userId,
      action: 'permission_update',
      details: { updatedPermissions: moduleAccess },
      performedBy: updatedBy || 'system',
    });

    return permission || null;
  }

  async getUserPermissions(userId: string): Promise<UserPermission | null> {
    const [permission] = await db
      .select()
      .from(userPermissions)
      .where(
        and(
          eq(userPermissions.organizationId, this.organizationId),
          eq(userPermissions.userId, userId)
        )
      )
      .limit(1);

    return permission || null;
  }

  // ===== PROPERTY ASSIGNMENTS =====

  async assignUserToProperty(data: InsertUserPropertyAssignment): Promise<UserPropertyAssignment> {
    const [assignment] = await db
      .insert(userPropertyAssignments)
      .values({
        ...data,
        organizationId: this.organizationId,
      })
      .returning();

    await this.logUserActivity({
      userId: data.userId,
      action: 'property_assignment',
      details: { propertyId: data.propertyId, assignmentType: data.assignmentType },
      performedBy: data.assignedBy || 'system',
    });

    return assignment;
  }

  async removeUserFromProperty(userId: string, propertyId: number): Promise<boolean> {
    const result = await db
      .update(userPropertyAssignments)
      .set({ isActive: false })
      .where(
        and(
          eq(userPropertyAssignments.organizationId, this.organizationId),
          eq(userPropertyAssignments.userId, userId),
          eq(userPropertyAssignments.propertyId, propertyId)
        )
      );

    return result.rowsAffected! > 0;
  }

  async getUserPropertyAssignments(userId: string): Promise<UserPropertyAssignment[]> {
    return await db
      .select()
      .from(userPropertyAssignments)
      .where(
        and(
          eq(userPropertyAssignments.organizationId, this.organizationId),
          eq(userPropertyAssignments.userId, userId),
          eq(userPropertyAssignments.isActive, true)
        )
      );
  }

  // ===== FREELANCER MANAGEMENT =====

  async updateFreelancerAvailability(data: InsertFreelancerAvailability): Promise<FreelancerAvailability> {
    // Check if availability exists for this date
    const existing = await db
      .select()
      .from(freelancerAvailability)
      .where(
        and(
          eq(freelancerAvailability.organizationId, this.organizationId),
          eq(freelancerAvailability.freelancerId, data.freelancerId),
          eq(freelancerAvailability.availableDate, data.availableDate)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      const [availability] = await db
        .update(freelancerAvailability)
        .set({
          timeSlots: data.timeSlots,
          isAvailable: data.isAvailable,
          notes: data.notes,
          updatedAt: new Date(),
        })
        .where(eq(freelancerAvailability.id, existing[0].id))
        .returning();
      return availability;
    } else {
      const [availability] = await db
        .insert(freelancerAvailability)
        .values({
          ...data,
          organizationId: this.organizationId,
        })
        .returning();
      return availability;
    }
  }

  async getFreelancerAvailability(freelancerId: string, startDate?: string, endDate?: string): Promise<FreelancerAvailability[]> {
    let query = db
      .select()
      .from(freelancerAvailability)
      .where(
        and(
          eq(freelancerAvailability.organizationId, this.organizationId),
          eq(freelancerAvailability.freelancerId, freelancerId)
        )
      );

    if (startDate && endDate) {
      query = query.where(
        and(
          eq(freelancerAvailability.organizationId, this.organizationId),
          eq(freelancerAvailability.freelancerId, freelancerId),
          sql`${freelancerAvailability.availableDate} BETWEEN ${startDate} AND ${endDate}`
        )
      );
    }

    return await query.orderBy(asc(freelancerAvailability.availableDate));
  }

  async createFreelancerTaskRequest(data: InsertFreelancerTaskRequest): Promise<FreelancerTaskRequest> {
    const [request] = await db
      .insert(freelancerTaskRequests)
      .values({
        ...data,
        organizationId: this.organizationId,
      })
      .returning();

    await this.logUserActivity({
      userId: data.freelancerId,
      action: 'task_request_created',
      details: { taskTitle: data.taskTitle, requestedBy: data.requestedBy },
      performedBy: data.requestedBy,
    });

    return request;
  }

  async updateFreelancerTaskRequest(requestId: number, updates: Partial<InsertFreelancerTaskRequest>): Promise<FreelancerTaskRequest | null> {
    const [request] = await db
      .update(freelancerTaskRequests)
      .set({ ...updates, updatedAt: new Date() })
      .where(
        and(
          eq(freelancerTaskRequests.organizationId, this.organizationId),
          eq(freelancerTaskRequests.id, requestId)
        )
      )
      .returning();

    return request || null;
  }

  async getFreelancerTaskRequests(freelancerId?: string, status?: string): Promise<FreelancerTaskRequest[]> {
    let query = db
      .select()
      .from(freelancerTaskRequests)
      .where(eq(freelancerTaskRequests.organizationId, this.organizationId));

    if (freelancerId) {
      query = query.where(
        and(
          eq(freelancerTaskRequests.organizationId, this.organizationId),
          eq(freelancerTaskRequests.freelancerId, freelancerId)
        )
      );
    }

    if (status) {
      query = query.where(
        and(
          eq(freelancerTaskRequests.organizationId, this.organizationId),
          eq(freelancerTaskRequests.status, status)
        )
      );
    }

    return await query.orderBy(desc(freelancerTaskRequests.requestedAt));
  }

  // ===== USER INVITATIONS =====

  async createUserInvitation(data: Omit<InsertUserInvitation, 'inviteCode'>): Promise<UserInvitation> {
    const inviteCode = nanoid(32);
    
    const [invitation] = await db
      .insert(userInvitations)
      .values({
        ...data,
        organizationId: this.organizationId,
        inviteCode,
      })
      .returning();

    return invitation;
  }

  async getInvitationByCode(inviteCode: string): Promise<UserInvitation | null> {
    const [invitation] = await db
      .select()
      .from(userInvitations)
      .where(
        and(
          eq(userInvitations.organizationId, this.organizationId),
          eq(userInvitations.inviteCode, inviteCode),
          eq(userInvitations.status, 'pending')
        )
      )
      .limit(1);

    return invitation || null;
  }

  async acceptInvitation(inviteCode: string, acceptedByUserId: string): Promise<UserInvitation | null> {
    const [invitation] = await db
      .update(userInvitations)
      .set({
        status: 'accepted',
        acceptedAt: new Date(),
        acceptedByUserId,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(userInvitations.organizationId, this.organizationId),
          eq(userInvitations.inviteCode, inviteCode)
        )
      )
      .returning();

    return invitation || null;
  }

  async getPendingInvitations(): Promise<UserInvitation[]> {
    return await db
      .select()
      .from(userInvitations)
      .where(
        and(
          eq(userInvitations.organizationId, this.organizationId),
          eq(userInvitations.status, 'pending')
        )
      )
      .orderBy(desc(userInvitations.createdAt));
  }

  // ===== USER ACTIVITY AUDIT =====

  async logUserActivity(data: InsertUserActivityAudit): Promise<UserActivityAudit> {
    const [activity] = await db
      .insert(userActivityAudit)
      .values({
        ...data,
        organizationId: this.organizationId,
      })
      .returning();

    return activity;
  }

  async getUserActivityHistory(userId: string, limit: number = 50): Promise<UserActivityAudit[]> {
    return await db
      .select()
      .from(userActivityAudit)
      .where(
        and(
          eq(userActivityAudit.organizationId, this.organizationId),
          eq(userActivityAudit.userId, userId)
        )
      )
      .orderBy(desc(userActivityAudit.timestamp))
      .limit(limit);
  }

  async getSystemActivityLog(limit: number = 100): Promise<UserActivityAudit[]> {
    return await db
      .select()
      .from(userActivityAudit)
      .where(eq(userActivityAudit.organizationId, this.organizationId))
      .orderBy(desc(userActivityAudit.timestamp))
      .limit(limit);
  }

  // ===== USER PERFORMANCE METRICS =====

  async updateUserPerformanceMetrics(data: InsertUserPerformanceMetrics): Promise<UserPerformanceMetrics> {
    // Check if metrics exist for this user and period
    const existing = await db
      .select()
      .from(userPerformanceMetrics)
      .where(
        and(
          eq(userPerformanceMetrics.organizationId, this.organizationId),
          eq(userPerformanceMetrics.userId, data.userId),
          eq(userPerformanceMetrics.periodMonth, data.periodMonth),
          eq(userPerformanceMetrics.periodYear, data.periodYear)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      const [metrics] = await db
        .update(userPerformanceMetrics)
        .set({ ...data, calculatedAt: new Date() })
        .where(eq(userPerformanceMetrics.id, existing[0].id))
        .returning();
      return metrics;
    } else {
      const [metrics] = await db
        .insert(userPerformanceMetrics)
        .values({
          ...data,
          organizationId: this.organizationId,
        })
        .returning();
      return metrics;
    }
  }

  async getUserPerformanceMetrics(userId: string, periodYear?: number, periodMonth?: number): Promise<UserPerformanceMetrics[]> {
    let query = db
      .select()
      .from(userPerformanceMetrics)
      .where(
        and(
          eq(userPerformanceMetrics.organizationId, this.organizationId),
          eq(userPerformanceMetrics.userId, userId)
        )
      );

    if (periodYear && periodMonth) {
      query = query.where(
        and(
          eq(userPerformanceMetrics.organizationId, this.organizationId),
          eq(userPerformanceMetrics.userId, userId),
          eq(userPerformanceMetrics.periodYear, periodYear),
          eq(userPerformanceMetrics.periodMonth, periodMonth)
        )
      );
    }

    return await query.orderBy(desc(userPerformanceMetrics.periodYear), desc(userPerformanceMetrics.periodMonth));
  }

  // ===== USER STATUS MANAGEMENT =====

  async updateUserStatus(userId: string, isActive: boolean, updatedBy?: string): Promise<boolean> {
    const result = await db
      .update(users)
      .set({ isActive, updatedAt: new Date() })
      .where(
        and(
          eq(users.organizationId, this.organizationId),
          eq(users.id, userId)
        )
      );

    await this.logUserActivity({
      userId,
      action: isActive ? 'user_activated' : 'user_deactivated',
      performedBy: updatedBy || 'system',
    });

    return result.rowsAffected! > 0;
  }

  async updateUserLastLogin(userId: string): Promise<boolean> {
    const result = await db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(
        and(
          eq(users.organizationId, this.organizationId),
          eq(users.id, userId)
        )
      );

    await this.logUserActivity({
      userId,
      action: 'login',
    });

    return result.rowsAffected! > 0;
  }
}