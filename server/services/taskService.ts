import { db } from "../db";
import { tasks } from "../../shared/schema";
import { eq, and, gte, lte, ne } from "drizzle-orm";

export async function getUpcomingTasks() {
  const today = new Date();
  const in7Days = new Date();
  in7Days.setDate(today.getDate() + 7);

  try {
    const upcomingTasks = await db
      .select({
        title: tasks.title,
        dueDate: tasks.dueDate,
        priority: tasks.priority,
        status: tasks.status,
        property: tasks.property
      })
      .from(tasks)
      .where(
        and(
          gte(tasks.dueDate, today),
          lte(tasks.dueDate, in7Days),
          ne(tasks.status, "completed")
        )
      )
      .limit(10);

    return upcomingTasks;
  } catch (error) {
    console.error("Error fetching upcoming tasks:", error);
    return [];
  }
}

export async function getTasksByProperty(propertyId: string) {
  try {
    const propertyTasks = await db
      .select()
      .from(tasks)
      .where(eq(tasks.property, propertyId))
      .limit(20);

    return propertyTasks;
  } catch (error) {
    console.error("Error fetching property tasks:", error);
    return [];
  }
}