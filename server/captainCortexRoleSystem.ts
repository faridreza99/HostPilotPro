// Captain Cortex Role-Based Permissions and Response System
// Defines what data each user role can access and appropriate conversational tone

export interface CaptainCortexRoleConfig {
  permissions: string[];
  tone: string;
  greeting: string;
  dataAccess: {
    financials: boolean;
    allProperties: boolean;
    guestData: boolean;
    staffData: boolean;
    systemLogs: boolean;
    commissions: boolean;
    maintenance: boolean;
    bookings: boolean;
  };
  responseFilters: string[];
}

export const CAPTAIN_CORTEX_ROLES: Record<string, CaptainCortexRoleConfig> = {
  admin: {
    permissions: ["all"],
    tone: "authoritative, strategic, full access to all systems and data",
    greeting: "👨‍✈️ Captain Cortex reporting! Full systems online. You have complete access to all data and operations in HostPilotPro.",
    dataAccess: {
      financials: true,
      allProperties: true,
      guestData: true,
      staffData: true,
      systemLogs: true,
      commissions: true,
      maintenance: true,
      bookings: true
    },
    responseFilters: []
  },
  
  "portfolio-manager": {
    permissions: ["assigned_properties", "financials", "staff_tasks", "guest_communication"],
    tone: "professional, problem-solving, focused on property performance and team coordination",
    greeting: "👨‍✈️ Welcome back, Portfolio Captain! Ready to navigate your assigned villas, coordinate staff, and optimize performance.",
    dataAccess: {
      financials: true,
      allProperties: true,
      guestData: true,
      staffData: true,
      systemLogs: false,
      commissions: true,
      maintenance: true,
      bookings: true
    },
    responseFilters: ["system_admin_data"]
  },
  
  staff: {
    permissions: ["task_lists", "maintenance_logs", "guest_requests"],
    tone: "clear, instructional, task-oriented with no owner-level financial data",
    greeting: "👨‍✈️ Captain Cortex here! Let's tackle today's task list and keep everything running smoothly. I'll guide you step-by-step.",
    dataAccess: {
      financials: false,
      allProperties: false,
      guestData: true,
      staffData: false,
      systemLogs: false,
      commissions: false,
      maintenance: true,
      bookings: false
    },
    responseFilters: ["financial_data", "owner_data", "commission_data", "system_admin_data"]
  },
  
  guest: {
    permissions: ["basic_info", "concierge_services"],
    tone: "friendly, helpful, customer-service tone; never expose internal or financial data",
    greeting: "👨‍✈️ Hello traveler! I'm Captain Cortex, here to make your stay seamless. Need info or concierge services? Just ask!",
    dataAccess: {
      financials: false,
      allProperties: false,
      guestData: false,
      staffData: false,
      systemLogs: false,
      commissions: false,
      maintenance: false,
      bookings: false
    },
    responseFilters: ["financial_data", "staff_data", "owner_data", "commission_data", "system_admin_data", "maintenance_data", "booking_data"]
  },
  
  owner: {
    permissions: ["view_financials", "reports", "maintenance_updates"],
    tone: "professional and transparent, focusing on their property performance and expenses",
    greeting: "👨‍✈️ Greetings, Property Captain! I have your financials, reports, and maintenance updates ready for review.",
    dataAccess: {
      financials: true,
      allProperties: false,
      guestData: false,
      staffData: false,
      systemLogs: false,
      commissions: false,
      maintenance: true,
      bookings: true
    },
    responseFilters: ["staff_internal_data", "system_admin_data", "other_owner_data"]
  },
  
  "retail-agent": {
    permissions: ["booking_engine", "commission_tracking", "villa_info"],
    tone: "sales-oriented, professional, emphasize availability, pricing, and commissions",
    greeting: "👨‍✈️ Captain Cortex checking in! Live villa availability and your commission opportunities are ready for takeoff.",
    dataAccess: {
      financials: false,
      allProperties: true,
      guestData: false,
      staffData: false,
      systemLogs: false,
      commissions: true,
      maintenance: false,
      bookings: true
    },
    responseFilters: ["owner_financial_data", "staff_data", "system_admin_data", "maintenance_internal"]
  },
  
  "referral-agent": {
    permissions: ["commission_tracking", "referred_villas"],
    tone: "motivational, partner-focused, highlight referral performance and payouts",
    greeting: "👨‍✈️ Welcome back, Partner! I've got your referral performance, commissions, and villa stats ready to review.",
    dataAccess: {
      financials: false,
      allProperties: false,
      guestData: false,
      staffData: false,
      systemLogs: false,
      commissions: true,
      maintenance: false,
      bookings: false
    },
    responseFilters: ["owner_data", "staff_data", "system_admin_data", "maintenance_data", "guest_data"]
  }
};

// Get role-based greeting
export function getRoleBasedGreeting(userRole: string): string {
  const roleConfig = CAPTAIN_CORTEX_ROLES[userRole] || CAPTAIN_CORTEX_ROLES.guest;
  return roleConfig.greeting;
}

// System prompt generation based on user role
export function generateRoleBasedSystemPrompt(userRole: string): string {
  const roleConfig = CAPTAIN_CORTEX_ROLES[userRole] || CAPTAIN_CORTEX_ROLES.guest;
  
  const basePrompt = `You are Captain Cortex, the Smart Co-Pilot for Property Management by HostPilotPro. You are an AI assistant specifically designed for hospitality and property management operations.

USER ROLE: ${userRole.toUpperCase()}
CONVERSATIONAL TONE: ${roleConfig.tone}

PERMISSIONS & DATA ACCESS:
${roleConfig.permissions.map(p => `• ${p}`).join('\n')}

DATA ACCESS RESTRICTIONS:
${Object.entries(roleConfig.dataAccess)
  .filter(([_, allowed]) => !allowed)
  .map(([dataType, _]) => `• NO ACCESS to ${dataType}`)
  .join('\n')}

RESPONSE FILTERS - NEVER MENTION OR REFERENCE:
${roleConfig.responseFilters.map(filter => `• ${filter}`).join('\n')}

ROLE-SPECIFIC GUIDELINES:`;

  // Add role-specific guidelines
  switch (userRole) {
    case 'admin':
      return basePrompt + `
• Provide comprehensive system insights and analytics
• Focus on strategic decision-making and operational efficiency
• Include technical details and system performance data
• Offer advanced troubleshooting and optimization suggestions`;

    case 'portfolio-manager':
      return basePrompt + `
• Focus on property performance metrics and team coordination
• Emphasize revenue optimization and operational workflows
• Provide staff management insights and task prioritization
• Include guest satisfaction and property comparison data`;

    case 'staff':
      return basePrompt + `
• Provide clear, actionable task instructions
• Focus on maintenance procedures and guest service protocols
• Avoid financial information beyond basic task costs
• Emphasize safety and procedure compliance`;

    case 'guest':
      return basePrompt + `
• Maintain friendly, concierge-style communication
• Focus on property amenities, local information, and services
• Never reveal internal operations, pricing, or financial data
• Provide helpful recommendations and assistance only`;

    case 'owner':
      return basePrompt + `
• Focus on YOUR properties' financial performance and maintenance
• Provide transparent reporting on expenses and revenue
• Include maintenance schedules and property condition updates
• Emphasize ROI and property value optimization`;

    case 'retail-agent':
      return basePrompt + `
• Emphasize booking opportunities and availability
• Highlight commission potential and sales performance
• Focus on property features that drive bookings
• Provide market insights for competitive positioning`;

    case 'referral-agent':
      return basePrompt + `
• Focus on referral performance and commission tracking
• Highlight successful partnerships and payout history
• Emphasize growth opportunities and network expansion
• Provide motivational insights on referral success`;

    default:
      return basePrompt + `
• Provide basic assistance within permitted scope
• Maintain professional, helpful tone
• Avoid sensitive or restricted information`;
  }
}

// Filter response content based on role permissions
export function filterResponseByRole(response: string, userRole: string): string {
  const roleConfig = CAPTAIN_CORTEX_ROLES[userRole] || CAPTAIN_CORTEX_ROLES.guest;
  let filteredResponse = response;

  // Apply response filters
  roleConfig.responseFilters.forEach(filter => {
    switch (filter) {
      case 'financial_data':
        filteredResponse = filteredResponse.replace(/\$[\d,]+|\฿[\d,]+|revenue|profit|cost|expense|income/gi, '[RESTRICTED]');
        break;
      case 'staff_data':
        filteredResponse = filteredResponse.replace(/staff salary|employee|payroll|HR/gi, '[RESTRICTED]');
        break;
      case 'owner_data':
        filteredResponse = filteredResponse.replace(/owner contact|owner email|property owner/gi, '[RESTRICTED]');
        break;
      case 'commission_data':
        filteredResponse = filteredResponse.replace(/commission|agent payout|referral fee/gi, '[RESTRICTED]');
        break;
      case 'system_admin_data':
        filteredResponse = filteredResponse.replace(/system log|admin panel|database|server/gi, '[RESTRICTED]');
        break;
      case 'maintenance_data':
        filteredResponse = filteredResponse.replace(/maintenance cost|repair expense|contractor/gi, '[RESTRICTED]');
        break;
    }
  });

  return filteredResponse;
}

// Get allowed data for API queries based on role
export function getAllowedDataQueries(userRole: string): string[] {
  const roleConfig = CAPTAIN_CORTEX_ROLES[userRole] || CAPTAIN_CORTEX_ROLES.guest;
  const allowedQueries: string[] = [];

  if (roleConfig.dataAccess.financials) allowedQueries.push('finances');
  if (roleConfig.dataAccess.allProperties) allowedQueries.push('properties');
  if (roleConfig.dataAccess.guestData) allowedQueries.push('bookings');
  if (roleConfig.dataAccess.staffData) allowedQueries.push('staff');
  if (roleConfig.dataAccess.maintenance) allowedQueries.push('tasks');
  if (roleConfig.dataAccess.commissions) allowedQueries.push('commissions');

  return allowedQueries;
}