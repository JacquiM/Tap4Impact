import { 
  users, 
  donations, 
  projects, 
  systemStats,
  type User, 
  type InsertUser,
  type CreateUser,
  type Donation,
  type InsertDonation,
  type Project,
  type InsertProject,
  type UpdateProject,
  type SystemStats
} from "@shared/schema";
import { db, pool } from "./db";
import { eq, desc, sql } from "drizzle-orm";
import { hashPassword, verifyPassword } from "./auth-utils";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: CreateUser): Promise<User>;
  verifyUserPassword(username: string, password: string): Promise<User | null>;
  
  // Donation methods
  createDonation(donation: InsertDonation): Promise<Donation>;
  getDonations(): Promise<Donation[]>;
  getDonationsByProject(projectId: string): Promise<Donation[]>;
  
  // Project methods
  getProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, updates: UpdateProject): Promise<Project | undefined>;
  getFeaturedProjects(): Promise<Project[]>;
  
  // Stats methods
  getSystemStats(): Promise<SystemStats>;
  updateSystemStats(): Promise<SystemStats>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(createUser: CreateUser): Promise<User> {
    const passwordHash = await hashPassword(createUser.password);
    const [user] = await db
      .insert(users)
      .values({
        username: createUser.username,
        passwordHash
      })
      .returning();
    return user;
  }

  async verifyUserPassword(username: string, password: string): Promise<User | null> {
    const user = await this.getUserByUsername(username);
    if (!user) {
      return null;
    }
    
    const isValid = await verifyPassword(password, user.passwordHash);
    return isValid ? user : null;
  }

  // Donation methods
  async createDonation(donation: InsertDonation): Promise<Donation> {
    // Use transaction to ensure data consistency
    return await db.transaction(async (tx) => {
      // Create the donation
      const [newDonation] = await tx
        .insert(donations)
        .values(donation)
        .returning();
      
      // Update project current amount if projectId is provided
      if (donation.projectId) {
        await tx
          .update(projects)
          .set({
            currentAmount: sql`${projects.currentAmount} + ${donation.amount}`,
            updatedAt: new Date()
          })
          .where(eq(projects.id, donation.projectId));
      }
      
      // Calculate and update system stats within the transaction
      const [totals] = await tx
        .select({
          totalRaised: sql<string>`COALESCE(SUM(${donations.amount}), 0)`,
          totalDonors: sql<number>`COUNT(DISTINCT CASE WHEN ${donations.donorEmail} IS NOT NULL THEN ${donations.donorEmail} END)`,
          totalProjects: sql<number>`(SELECT COUNT(*) FROM ${projects})`
        })
        .from(donations);

      // Update or insert stats within transaction
      const [existingStats] = await tx.select().from(systemStats).limit(1);
      
      if (existingStats) {
        await tx
          .update(systemStats)
          .set({
            totalRaised: totals.totalRaised,
            totalDonors: totals.totalDonors,
            totalProjects: totals.totalProjects,
            updatedAt: new Date()
          })
          .where(eq(systemStats.id, existingStats.id));
      } else {
        await tx
          .insert(systemStats)
          .values({
            totalRaised: totals.totalRaised,
            totalDonors: totals.totalDonors,
            totalProjects: totals.totalProjects
          });
      }
      
      return newDonation;
    });
  }

  async getDonations(): Promise<Donation[]> {
    return await db.select().from(donations).orderBy(desc(donations.createdAt));
  }

  async getDonationsByProject(projectId: string): Promise<Donation[]> {
    return await db
      .select()
      .from(donations)
      .where(eq(donations.projectId, projectId))
      .orderBy(desc(donations.createdAt));
  }

  // Project methods
  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects).orderBy(desc(projects.createdAt));
  }

  async getProject(id: string): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project || undefined;
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [newProject] = await db
      .insert(projects)
      .values(project)
      .returning();
    
    await this.updateSystemStats();
    return newProject;
  }

  async updateProject(id: string, updates: UpdateProject): Promise<Project | undefined> {
    const [updatedProject] = await db
      .update(projects)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    
    return updatedProject || undefined;
  }

  async getFeaturedProjects(): Promise<Project[]> {
    return await db
      .select()
      .from(projects)
      .where(eq(projects.isFeatured, true))
      .orderBy(desc(projects.updatedAt));
  }

  // Stats methods
  async getSystemStats(): Promise<SystemStats> {
    let [stats] = await db.select().from(systemStats).limit(1);
    
    if (!stats) {
      // Initialize stats if they don't exist
      [stats] = await db
        .insert(systemStats)
        .values({})
        .returning();
    }
    
    return stats;
  }

  async updateSystemStats(): Promise<SystemStats> {
    // Calculate totals from actual data
    const [totals] = await db
      .select({
        totalRaised: sql<string>`COALESCE(SUM(${donations.amount}), 0)`,
        totalDonors: sql<number>`COUNT(DISTINCT CASE WHEN ${donations.donorEmail} IS NOT NULL THEN ${donations.donorEmail} END)`,
        totalProjects: sql<number>`(SELECT COUNT(*) FROM ${projects})`
      })
      .from(donations);

    // Update or insert stats
    const [stats] = await db.select().from(systemStats).limit(1);
    
    if (stats) {
      const [updatedStats] = await db
        .update(systemStats)
        .set({
          totalRaised: totals.totalRaised,
          totalDonors: totals.totalDonors,
          totalProjects: totals.totalProjects,
          updatedAt: new Date()
        })
        .where(eq(systemStats.id, stats.id))
        .returning();
      return updatedStats;
    } else {
      const [newStats] = await db
        .insert(systemStats)
        .values({
          totalRaised: totals.totalRaised,
          totalDonors: totals.totalDonors,
          totalProjects: totals.totalProjects
        })
        .returning();
      return newStats;
    }
  }
}

export const storage = new DatabaseStorage();
