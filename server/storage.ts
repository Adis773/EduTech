import { 
  users, 
  type User, 
  type InsertUser,
  courses,
  type Course,
  type InsertCourse,
  userCourses,
  type UserCourse,
  type InsertUserCourse,
  achievements,
  type Achievement,
  type InsertAchievement,
  userAchievements,
  type UserAchievement,
  type InsertUserAchievement,
  learningStreaks,
  type LearningStreak,
  type InsertLearningStreak
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserOnboardingStatus(userId: number, completed: boolean): Promise<User>;

  // Course methods
  getCourse(id: number): Promise<Course | undefined>;
  getCourses(): Promise<Course[]>;
  getCoursesByCategory(category: string): Promise<Course[]>;
  getRecommendedCourses(userId: number): Promise<Course[]>;

  // UserCourse methods
  getUserCourses(userId: number): Promise<(UserCourse & { course: Course })[]>;
  enrollUserInCourse(userCourse: InsertUserCourse): Promise<UserCourse>;
  updateUserCourseProgress(id: number, progress: number): Promise<UserCourse>;
  
  // Achievement methods
  getAchievements(): Promise<Achievement[]>;
  getUserAchievements(userId: number): Promise<(UserAchievement & { achievement: Achievement })[]>;
  awardAchievement(userAchievement: InsertUserAchievement): Promise<UserAchievement>;

  // Streak methods
  getUserStreak(userId: number): Promise<LearningStreak | undefined>;
  updateUserStreak(userId: number): Promise<LearningStreak>;

  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private courses: Map<number, Course>;
  private userCourses: Map<number, UserCourse>;
  private achievements: Map<number, Achievement>;
  private userAchievements: Map<number, UserAchievement>;
  private learningStreaks: Map<number, LearningStreak>;
  sessionStore: session.SessionStore;

  private userCurrentId: number;
  private courseCurrentId: number;
  private userCourseCurrentId: number;
  private achievementCurrentId: number;
  private userAchievementCurrentId: number;
  private learningStreakCurrentId: number;

  constructor() {
    this.users = new Map();
    this.courses = new Map();
    this.userCourses = new Map();
    this.achievements = new Map();
    this.userAchievements = new Map();
    this.learningStreaks = new Map();
    
    this.userCurrentId = 1;
    this.courseCurrentId = 1;
    this.userCourseCurrentId = 1;
    this.achievementCurrentId = 1;
    this.userAchievementCurrentId = 1;
    this.learningStreakCurrentId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24 hours
    });
    
    // Initialize with some sample data
    this.initSampleData();
  }

  private initSampleData() {
    // Sample Courses
    const sampleCourses: Omit<Course, "id">[] = [
      {
        title: "HTML & CSS Basics",
        description: "Learn the fundamental building blocks of web design",
        category: "Web Development",
        imageUrl: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        rating: 4,
        reviewCount: 1200,
        difficulty: "Beginner"
      },
      {
        title: "Time Management Mastery",
        description: "Optimize your daily routine and boost productivity",
        category: "Productivity",
        imageUrl: "https://images.unsplash.com/photo-1483058712412-4245e9b90334?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        rating: 5,
        reviewCount: 850,
        difficulty: "Intermediate"
      },
      {
        title: "Python Fundamentals",
        description: "Learn Python programming from scratch",
        category: "Programming",
        imageUrl: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        rating: 5,
        reviewCount: 1500,
        difficulty: "Beginner"
      },
      {
        title: "JavaScript for Web Development",
        description: "Take your HTML/CSS skills to the next level",
        category: "Web Development",
        imageUrl: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        rating: 5,
        reviewCount: 2156,
        difficulty: "Intermediate"
      },
      {
        title: "Business Planning for Young Entrepreneurs",
        description: "Learn how to start your business at any age",
        category: "Business",
        imageUrl: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        rating: 4,
        reviewCount: 867,
        difficulty: "Beginner"
      },
      {
        title: "Digital Marketing Essentials",
        description: "Master social media, SEO, and content marketing",
        category: "Marketing",
        imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        rating: 4,
        reviewCount: 1423,
        difficulty: "Intermediate"
      }
    ];

    // Add courses to storage
    sampleCourses.forEach(course => {
      const id = this.courseCurrentId++;
      this.courses.set(id, { ...course, id });
    });

    // Sample Achievements
    const sampleAchievements: Omit<Achievement, "id">[] = [
      {
        title: "HTML Hero",
        description: "Completed HTML Basics",
        icon: "code",
        category: "Web Development"
      },
      {
        title: "Style Master",
        description: "Completed CSS Fundamentals",
        category: "Web Development",
        icon: "brush"
      },
      {
        title: "Consistency King",
        description: "5-Day Learning Streak",
        category: "Engagement",
        icon: "clock"
      },
      {
        title: "Quiz Champion",
        description: "Perfect score on Web Quiz",
        category: "Assessment",
        icon: "award"
      },
      {
        title: "Project Pioneer",
        description: "Completed first project",
        category: "Project",
        icon: "star"
      },
      {
        title: "Early Bird",
        description: "5AM learning session",
        category: "Engagement",
        icon: "layers"
      }
    ];

    // Add achievements to storage
    sampleAchievements.forEach(achievement => {
      const id = this.achievementCurrentId++;
      this.achievements.set(id, { ...achievement, id });
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const currentTime = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      onboardingCompleted: false,
      createdAt: currentTime 
    };
    this.users.set(id, user);
    
    // Initialize learning streak for new user
    this.learningStreaks.set(this.learningStreakCurrentId++, {
      id: this.learningStreakCurrentId,
      userId: id,
      currentStreak: 0,
      longestStreak: 0,
      lastActivity: currentTime
    });
    
    return user;
  }

  async updateUserOnboardingStatus(userId: number, completed: boolean): Promise<User> {
    const user = this.users.get(userId);
    if (!user) throw new Error(`User not found: ${userId}`);
    
    const updatedUser = {
      ...user,
      onboardingCompleted: completed
    };
    
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  // Course methods
  async getCourse(id: number): Promise<Course | undefined> {
    return this.courses.get(id);
  }

  async getCourses(): Promise<Course[]> {
    return Array.from(this.courses.values());
  }

  async getCoursesByCategory(category: string): Promise<Course[]> {
    return Array.from(this.courses.values()).filter(
      (course) => course.category === category
    );
  }

  async getRecommendedCourses(userId: number): Promise<Course[]> {
    // In a real app, this would use an algorithm to determine recommendations
    // For now, just return some random courses that the user is not enrolled in
    const userCoursesIds = Array.from(this.userCourses.values())
      .filter(uc => uc.userId === userId)
      .map(uc => uc.courseId);
    
    const recommendedCourses = Array.from(this.courses.values())
      .filter(course => !userCoursesIds.includes(course.id))
      .slice(0, 3);
    
    return recommendedCourses;
  }

  // UserCourse methods
  async getUserCourses(userId: number): Promise<(UserCourse & { course: Course })[]> {
    const userCoursesArray = Array.from(this.userCourses.values())
      .filter(uc => uc.userId === userId);
    
    return userCoursesArray.map(uc => {
      const course = this.courses.get(uc.courseId);
      if (!course) throw new Error(`Course not found: ${uc.courseId}`);
      return { ...uc, course };
    });
  }

  async enrollUserInCourse(userCourse: InsertUserCourse): Promise<UserCourse> {
    const id = this.userCourseCurrentId++;
    const newUserCourse: UserCourse = { 
      ...userCourse, 
      id, 
      progress: 0, 
      isCompleted: false 
    };
    
    this.userCourses.set(id, newUserCourse);
    return newUserCourse;
  }

  async updateUserCourseProgress(id: number, progress: number): Promise<UserCourse> {
    const userCourse = this.userCourses.get(id);
    if (!userCourse) throw new Error(`UserCourse not found: ${id}`);
    
    const isCompleted = progress >= 100;
    const updatedUserCourse = { 
      ...userCourse, 
      progress, 
      isCompleted 
    };
    
    this.userCourses.set(id, updatedUserCourse);
    
    // Update user's learning streak
    if (userCourse.userId) {
      this.updateUserStreak(userCourse.userId);
    }
    
    return updatedUserCourse;
  }

  // Achievement methods
  async getAchievements(): Promise<Achievement[]> {
    return Array.from(this.achievements.values());
  }

  async getUserAchievements(userId: number): Promise<(UserAchievement & { achievement: Achievement })[]> {
    const userAchievementsArray = Array.from(this.userAchievements.values())
      .filter(ua => ua.userId === userId);
    
    return userAchievementsArray.map(ua => {
      const achievement = this.achievements.get(ua.achievementId);
      if (!achievement) throw new Error(`Achievement not found: ${ua.achievementId}`);
      return { ...ua, achievement };
    });
  }

  async awardAchievement(userAchievement: InsertUserAchievement): Promise<UserAchievement> {
    const id = this.userAchievementCurrentId++;
    const awardedAt = new Date();
    const newUserAchievement: UserAchievement = { 
      ...userAchievement,
      id,
      awardedAt
    };
    
    this.userAchievements.set(id, newUserAchievement);
    return newUserAchievement;
  }

  // Streak methods
  async getUserStreak(userId: number): Promise<LearningStreak | undefined> {
    return Array.from(this.learningStreaks.values())
      .find(streak => streak.userId === userId);
  }

  async updateUserStreak(userId: number): Promise<LearningStreak> {
    const streak = await this.getUserStreak(userId);
    if (!streak) {
      const newStreak: LearningStreak = {
        id: this.learningStreakCurrentId++,
        userId,
        currentStreak: 1,
        longestStreak: 1,
        lastActivity: new Date()
      };
      this.learningStreaks.set(newStreak.id, newStreak);
      return newStreak;
    }

    const now = new Date();
    const lastActivity = new Date(streak.lastActivity);
    
    // Check if last activity was yesterday
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const isYesterday = (
      lastActivity.getDate() === yesterday.getDate() &&
      lastActivity.getMonth() === yesterday.getMonth() &&
      lastActivity.getFullYear() === yesterday.getFullYear()
    );
    
    // Check if last activity was today
    const isToday = (
      lastActivity.getDate() === now.getDate() &&
      lastActivity.getMonth() === now.getMonth() &&
      lastActivity.getFullYear() === now.getFullYear()
    );
    
    let newCurrentStreak = streak.currentStreak;
    
    if (isYesterday) {
      // Continue the streak
      newCurrentStreak += 1;
    } else if (!isToday) {
      // Reset streak if more than a day has passed
      newCurrentStreak = 1;
    }
    
    const newLongestStreak = Math.max(streak.longestStreak, newCurrentStreak);
    
    const updatedStreak: LearningStreak = {
      ...streak,
      currentStreak: newCurrentStreak,
      longestStreak: newLongestStreak,
      lastActivity: now
    };
    
    this.learningStreaks.set(streak.id, updatedStreak);
    return updatedStreak;
  }
}

export const storage = new MemStorage();
