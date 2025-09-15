import type { Request, Response, NextFunction } from "express";

// Simple admin token authentication middleware
export function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const adminToken = process.env.ADMIN_TOKEN;
  
  // If no admin token is configured, require one for security
  if (!adminToken) {
    console.error("ADMIN_TOKEN environment variable not set - write endpoints are disabled for security");
    return res.status(503).json({ 
      error: "Service unavailable", 
      message: "Admin authentication not configured" 
    });
  }

  // Check Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ 
      error: "Unauthorized", 
      message: "Authorization header required" 
    });
  }

  // Support both "Bearer token" and "token" formats
  const token = authHeader.startsWith("Bearer ") 
    ? authHeader.slice(7) 
    : authHeader;

  if (token !== adminToken) {
    return res.status(401).json({ 
      error: "Unauthorized", 
      message: "Invalid admin token" 
    });
  }

  next();
}

// Middleware to validate UUID path parameters
export function validateUUID(paramName: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const value = req.params[paramName];
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    
    if (!value || !uuidRegex.test(value)) {
      return res.status(400).json({ 
        error: "Bad Request", 
        message: `Invalid UUID format for parameter '${paramName}'` 
      });
    }
    
    next();
  };
}