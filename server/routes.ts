import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertDonationSchema, 
  insertProjectSchema, 
  updateProjectSchema,
  projectIdParamSchema,
  projectDonationParamSchema 
} from "@shared/schema";
import { requireAdminAuth, validateUUID } from "./auth-middleware";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // System stats endpoint
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getSystemStats();
      res.json(stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
      res.status(500).json({ error: "Failed to fetch system statistics" });
    }
  });

  // Donations endpoints
  app.post("/api/donations", requireAdminAuth, async (req, res) => {
    try {
      const validatedData = insertDonationSchema.parse(req.body);
      
      // Validate project exists if projectId is provided
      if (validatedData.projectId) {
        const projectExists = await storage.getProject(validatedData.projectId);
        if (!projectExists) {
          return res.status(400).json({ 
            error: "Bad Request", 
            message: "Project not found" 
          });
        }
      }
      
      const donation = await storage.createDonation(validatedData);
      res.status(201).json(donation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid donation data", details: error.errors });
      } else {
        console.error('Error creating donation:', error);
        res.status(500).json({ error: "Failed to create donation" });
      }
    }
  });

  app.get("/api/donations", async (req, res) => {
    try {
      const donations = await storage.getDonations();
      res.json(donations);
    } catch (error) {
      console.error('Error fetching donations:', error);
      res.status(500).json({ error: "Failed to fetch donations" });
    }
  });

  app.get("/api/donations/project/:projectId", validateUUID("projectId"), async (req, res) => {
    try {
      const { projectId } = req.params;
      
      // Validate project exists
      const projectExists = await storage.getProject(projectId);
      if (!projectExists) {
        return res.status(404).json({ 
          error: "Not Found", 
          message: "Project not found" 
        });
      }
      
      const donations = await storage.getDonationsByProject(projectId);
      res.json(donations);
    } catch (error) {
      console.error('Error fetching project donations:', error);
      res.status(500).json({ error: "Failed to fetch project donations" });
    }
  });

  // Projects endpoints
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/featured", async (req, res) => {
    try {
      const projects = await storage.getFeaturedProjects();
      res.json(projects);
    } catch (error) {
      console.error('Error fetching featured projects:', error);
      res.status(500).json({ error: "Failed to fetch featured projects" });
    }
  });

  app.get("/api/projects/:id", validateUUID("id"), async (req, res) => {
    try {
      const { id } = req.params;
      const project = await storage.getProject(id);
      if (!project) {
        return res.status(404).json({ 
          error: "Not Found", 
          message: "Project not found" 
        });
      }
      res.json(project);
    } catch (error) {
      console.error('Error fetching project:', error);
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  app.post("/api/projects", requireAdminAuth, async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validatedData);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid project data", details: error.errors });
      } else {
        console.error('Error creating project:', error);
        res.status(500).json({ error: "Failed to create project" });
      }
    }
  });

  app.put("/api/projects/:id", requireAdminAuth, validateUUID("id"), async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = updateProjectSchema.parse(req.body);
      const project = await storage.updateProject(id, validatedData);
      if (!project) {
        return res.status(404).json({ 
          error: "Not Found", 
          message: "Project not found" 
        });
      }
      res.json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid project data", details: error.errors });
      } else {
        console.error('Error updating project:', error);
        res.status(500).json({ error: "Failed to update project" });
      }
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);

  return httpServer;
}
