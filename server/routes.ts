import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { z } from "zod";
import { insertUserCourseSchema, insertUserAchievementSchema } from "@shared/schema";
import { handleAIAssistantQuery } from "./ai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Course routes
  app.get("/api/courses", async (req, res) => {
    try {
      const courses = await storage.getCourses();
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  app.get("/api/courses/:id", async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const course = await storage.getCourse(courseId);
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      res.json(course);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch course" });
    }
  });

  app.get("/api/courses/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const courses = await storage.getCoursesByCategory(category);
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch courses by category" });
    }
  });

  // User course routes
  app.get("/api/user/courses", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const userId = req.user!.id;
      const userCourses = await storage.getUserCourses(userId);
      res.json(userCourses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user courses" });
    }
  });

  app.post("/api/user/courses", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const userId = req.user!.id;
      const parsedData = insertUserCourseSchema.parse({
        ...req.body,
        userId
      });
      
      const userCourse = await storage.enrollUserInCourse(parsedData);
      res.status(201).json(userCourse);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to enroll in course" });
    }
  });

  app.patch("/api/user/courses/:id/progress", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const userCourseId = parseInt(req.params.id);
      const { progress } = req.body;
      
      if (typeof progress !== 'number' || progress < 0 || progress > 100) {
        return res.status(400).json({ message: "Invalid progress value" });
      }
      
      const updatedUserCourse = await storage.updateUserCourseProgress(userCourseId, progress);
      res.json(updatedUserCourse);
    } catch (error) {
      res.status(500).json({ message: "Failed to update course progress" });
    }
  });

  // Achievement routes
  app.get("/api/achievements", async (req, res) => {
    try {
      const achievements = await storage.getAchievements();
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  app.get("/api/user/achievements", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const userId = req.user!.id;
      const userAchievements = await storage.getUserAchievements(userId);
      res.json(userAchievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user achievements" });
    }
  });

  app.post("/api/user/achievements", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const userId = req.user!.id;
      const parsedData = insertUserAchievementSchema.parse({
        ...req.body,
        userId
      });
      
      const userAchievement = await storage.awardAchievement(parsedData);
      res.status(201).json(userAchievement);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to award achievement" });
    }
  });

  // Learning streak routes
  app.get("/api/user/streak", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const userId = req.user!.id;
      const streak = await storage.getUserStreak(userId);
      
      if (!streak) {
        return res.status(404).json({ message: "Streak not found" });
      }
      
      res.json(streak);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user streak" });
    }
  });

  app.patch("/api/user/streak", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const userId = req.user!.id;
      const updatedStreak = await storage.updateUserStreak(userId);
      res.json(updatedStreak);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user streak" });
    }
  });

  // Recommended courses
  app.get("/api/user/recommended-courses", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const userId = req.user!.id;
      const recommendedCourses = await storage.getRecommendedCourses(userId);
      res.json(recommendedCourses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recommended courses" });
    }
  });

  // Onboarding status update
  app.patch("/api/user/onboarding", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const userId = req.user!.id;
      const { completed } = req.body;
      
      if (typeof completed !== 'boolean') {
        return res.status(400).json({ message: "Invalid completed value" });
      }
      
      const updatedUser = await storage.updateUserOnboardingStatus(userId, completed);
      res.json({ onboardingCompleted: updatedUser.onboardingCompleted });
    } catch (error) {
      res.status(500).json({ message: "Failed to update onboarding status" });
    }
  });

  // AI Assistant route
  app.post("/api/ai/assistant", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const { query } = req.body;
      
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ message: "Invalid query" });
      }
      
      const response = await handleAIAssistantQuery(query);
      res.json({ response });
    } catch (error) {
      console.error('AI Assistant error:', error);
      res.status(500).json({ 
        message: "Failed to process AI assistant query",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
