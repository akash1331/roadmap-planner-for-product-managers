import { type Initiative, type InsertInitiative, type Team, type InsertTeam } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<any | undefined>;
  getUserByUsername(username: string): Promise<any | undefined>;
  createUser(user: any): Promise<any>;
  getInitiatives(): Promise<Initiative[]>;
  createInitiative(initiative: InsertInitiative): Promise<Initiative>;
  updateInitiative(id: string, updates: Partial<Initiative>): Promise<Initiative | undefined>;
  deleteInitiative(id: string): Promise<boolean>;
  getTeams(): Promise<Team[]>;
  createTeam(team: InsertTeam): Promise<Team>;
  updateTeam(id: string, updates: Partial<Team>): Promise<Team | undefined>;
  deleteTeam(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, any>;
  private initiatives: Map<string, Initiative>;
  private teams: Map<string, Team>;

  constructor() {
    this.users = new Map();
    this.initiatives = new Map();
    this.teams = new Map();
    this.seedInitialData();
  }

  private seedInitialData() {
    // Seed default teams
    const defaultTeams: Team[] = [
      {
        id: "engineering",
        name: "Engineering", 
        color: "#3b82f6",
        description: "Software development and technical implementation",
        createdAt: new Date(),
      },
      {
        id: "design",
        name: "Design",
        color: "#10b981", 
        description: "User experience and visual design",
        createdAt: new Date(),
      },
      {
        id: "product",
        name: "Product",
        color: "#f59e0b",
        description: "Product strategy and management",
        createdAt: new Date(),
      },
      {
        id: "marketing",
        name: "Marketing",
        color: "#8b5cf6",
        description: "Marketing and growth initiatives",
        createdAt: new Date(),
      },
      {
        id: "sales",
        name: "Sales",
        color: "#ef4444",
        description: "Sales and revenue generation",
        createdAt: new Date(),
      },
    ];

    defaultTeams.forEach(team => {
      this.teams.set(team.id, team);
    });

    // Seed with sample initiatives for demonstration
    const sampleInitiatives: Initiative[] = [
      {
        id: "1",
        title: "API Gateway v2.0",
        description: "Redesign core API infrastructure for better performance",
        team: "engineering",
        priority: "high",
        startDate: "2024-01-15",
        endDate: "2024-03-30",
        assignees: ["JS", "MK"],
        quarter: "Q1",
        position: 0,
        createdAt: new Date(),
      },
      {
        id: "2",
        title: "Database Migration",
        description: "Migrate legacy database to new infrastructure",
        team: "engineering",
        priority: "medium",
        startDate: "2024-02-01",
        endDate: "2024-03-15",
        assignees: ["AL"],
        quarter: "Q1",
        position: 1,
        createdAt: new Date(),
      },
      {
        id: "3",
        title: "Design System v3",
        description: "Update design system with new components",
        team: "design",
        priority: "high",
        startDate: "2024-01-01",
        endDate: "2024-03-31",
        assignees: ["EJ", "TC"],
        quarter: "Q1",
        position: 0,
        createdAt: new Date(),
      },
      {
        id: "4",
        title: "Mobile App Backend",
        description: "Build backend services for mobile application",
        team: "engineering",
        priority: "high",
        startDate: "2024-04-01",
        endDate: "2024-06-30",
        assignees: ["RH", "LM"],
        quarter: "Q2",
        position: 0,
        createdAt: new Date(),
      },
      {
        id: "5",
        title: "Mobile App UX",
        description: "Design mobile application user experience",
        team: "design",
        priority: "medium",
        startDate: "2024-04-15",
        endDate: "2024-06-15",
        assignees: ["NP"],
        quarter: "Q2",
        position: 0,
        createdAt: new Date(),
      },
      {
        id: "6",
        title: "Market Research",
        description: "Conduct comprehensive market analysis",
        team: "product",
        priority: "high",
        startDate: "2024-01-08",
        endDate: "2024-02-28",
        assignees: ["SB"],
        quarter: "Q1",
        position: 0,
        createdAt: new Date(),
      },
    ];

    sampleInitiatives.forEach(initiative => {
      this.initiatives.set(initiative.id, initiative);
    });
  }

  async getUser(id: string): Promise<any | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<any | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: any): Promise<any> {
    const id = randomUUID();
    const user: any = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getInitiatives(): Promise<Initiative[]> {
    return Array.from(this.initiatives.values()).sort((a, b) => {
      if (a.quarter !== b.quarter) {
        const quarterOrder = { Q1: 1, Q2: 2, Q3: 3, Q4: 4 };
        return quarterOrder[a.quarter as keyof typeof quarterOrder] - quarterOrder[b.quarter as keyof typeof quarterOrder];
      }
      if (a.team !== b.team) {
        return a.team.localeCompare(b.team);
      }
      return a.position - b.position;
    });
  }

  async createInitiative(initiative: InsertInitiative): Promise<Initiative> {
    const id = randomUUID();
    const newInitiative: Initiative = {
      ...initiative,
      id,
      createdAt: new Date(),
    };
    this.initiatives.set(id, newInitiative);
    return newInitiative;
  }

  async updateInitiative(id: string, updates: Partial<Initiative>): Promise<Initiative | undefined> {
    const initiative = this.initiatives.get(id);
    if (!initiative) return undefined;

    const updated = { ...initiative, ...updates };
    this.initiatives.set(id, updated);
    return updated;
  }

  async deleteInitiative(id: string): Promise<boolean> {
    return this.initiatives.delete(id);
  }

  async getTeams(): Promise<Team[]> {
    return Array.from(this.teams.values()).sort((a, b) => a.name.localeCompare(b.name));
  }

  async createTeam(team: InsertTeam): Promise<Team> {
    const id = team.name.toLowerCase().replace(/\s+/g, '-');
    const newTeam: Team = {
      ...team,
      id,
      description: team.description || null,
      createdAt: new Date(),
    };
    this.teams.set(id, newTeam);
    return newTeam;
  }

  async updateTeam(id: string, updates: Partial<Team>): Promise<Team | undefined> {
    const team = this.teams.get(id);
    if (!team) return undefined;

    const updated = { ...team, ...updates };
    this.teams.set(id, updated);
    return updated;
  }

  async deleteTeam(id: string): Promise<boolean> {
    return this.teams.delete(id);
  }
}

export const storage = new MemStorage();
