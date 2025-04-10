import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { CourseCard } from "@/components/dashboard/CourseCard";
import { AchievementBadge } from "@/components/dashboard/AchievementBadge";
import { AIAssistant } from "@/components/ai/AIAssistant";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Bookmark, 
  Award,
  Plus
} from "lucide-react";
import { Loader2 } from "lucide-react";

interface UserCourse {
  id: number;
  userId: number;
  courseId: number;
  progress: number;
  isCompleted: boolean;
  course: {
    id: number;
    title: string;
    description: string;
    category: string;
    imageUrl: string;
    rating: number;
    reviewCount: number;
    difficulty: string;
  };
}

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  category: string;
}

interface LearningStreak {
  id: number;
  userId: number;
  currentStreak: number;
  longestStreak: number;
  lastActivity: Date;
}

export default function Dashboard() {
  const { user } = useAuth();

  const { data: userCourses, isLoading: isLoadingCourses } = useQuery<UserCourse[]>({
    queryKey: ["/api/user/courses"],
  });

  const { data: userAchievements, isLoading: isLoadingAchievements } = useQuery<{
    id: number;
    userId: number;
    achievementId: number;
    awardedAt: Date;
    achievement: Achievement;
  }[]>({
    queryKey: ["/api/user/achievements"],
  });

  const { data: streak, isLoading: isLoadingStreak } = useQuery<LearningStreak>({
    queryKey: ["/api/user/streak"],
  });

  const { data: recommendedCourses, isLoading: isLoadingRecommended } = useQuery({
    queryKey: ["/api/user/recommended-courses"],
  });

  const isLoading = isLoadingCourses || isLoadingAchievements || isLoadingStreak || isLoadingRecommended;

  const achievements = userAchievements?.map(ua => ua.achievement) || [];
  const inProgressCourses = userCourses || [];
  const recommended = recommendedCourses || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            {/* Welcome Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-bold text-neutral-800">
                    Welcome back, {user?.firstName}!
                  </h1>
                  <p className="mt-1 text-sm text-neutral-500">
                    Your personalized learning journey continues
                  </p>
                </div>
                <div className="mt-4 flex md:mt-0 md:ml-4">
                  <Button>
                    <Plus className="-ml-1 mr-2 h-5 w-5" />
                    Start New Course
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {isLoadingStreak ? (
                  <div className="flex justify-center items-center h-40">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <StatsCard
                    icon={<Users className="h-6 w-6 text-amber-500" />}
                    iconColor="text-amber-500"
                    iconBgColor="bg-amber-500/10"
                    title="Current Streak"
                    value={`${streak?.currentStreak || 0} days`}
                    footerText={`All-time best: ${streak?.longestStreak || 0} days`}
                    badge={{
                      text: "+2 today",
                      color: "bg-amber-500/10 text-amber-500",
                    }}
                  />
                )}

                {isLoadingCourses ? (
                  <div className="flex justify-center items-center h-40">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <StatsCard
                    icon={<Bookmark className="h-6 w-6 text-primary" />}
                    iconColor="text-primary"
                    iconBgColor="bg-primary/10"
                    title="Courses In Progress"
                    value={`${inProgressCourses.length}`}
                    footerText="View all courses"
                    footerLink="/courses"
                  />
                )}

                {isLoadingAchievements ? (
                  <div className="flex justify-center items-center h-40">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <StatsCard
                    icon={<Award className="h-6 w-6 text-green-500" />}
                    iconColor="text-green-500"
                    iconBgColor="bg-green-500/10"
                    title="Achievements"
                    value={`${achievements.length} badges`}
                    footerText="See all achievements"
                    footerLink="/achievements"
                    badge={{
                      text: "New!",
                      color: "bg-amber-500/10 text-amber-500",
                    }}
                  />
                )}
              </div>
            </div>

            {/* Continue Learning Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
              <h2 className="text-lg font-semibold text-neutral-800">Continue Learning</h2>
              <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {isLoadingCourses ? (
                  Array(3).fill(0).map((_, i) => (
                    <div key={i} className="flex justify-center items-center h-72">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ))
                ) : inProgressCourses.length > 0 ? (
                  inProgressCourses.slice(0, 3).map((userCourse) => {
                    let accentColor = "bg-primary";
                    if (userCourse.course.category === "Productivity") accentColor = "bg-amber-500";
                    if (userCourse.course.category === "Programming") accentColor = "bg-green-500";
                    
                    return (
                      <CourseCard
                        key={userCourse.id}
                        id={userCourse.course.id}
                        title={userCourse.course.title}
                        description={userCourse.course.description}
                        category={userCourse.course.category}
                        imageUrl={userCourse.course.imageUrl}
                        progress={userCourse.progress}
                        accentColor={accentColor}
                        isContinue={true}
                      />
                    );
                  })
                ) : (
                  <div className="col-span-3 py-10 text-center">
                    <p className="text-neutral-500">You haven't started any courses yet.</p>
                    <Button className="mt-4">Explore Courses</Button>
                  </div>
                )}
              </div>
            </div>

            {/* AI Recommendations Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-neutral-800">Recommended For You</h2>
                <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  AI Powered
                </div>
              </div>
              <p className="mt-1 text-sm text-neutral-500">Based on your learning history and interests</p>
              
              <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {isLoadingRecommended ? (
                  Array(3).fill(0).map((_, i) => (
                    <div key={i} className="flex justify-center items-center h-72">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ))
                ) : (
                  recommended.map((course) => (
                    <CourseCard
                      key={course.id}
                      id={course.id}
                      title={course.title}
                      description={course.description}
                      category={course.category}
                      imageUrl={course.imageUrl}
                      rating={course.rating}
                      reviewCount={course.reviewCount}
                      isRecommended={true}
                    />
                  ))
                )}
              </div>
            </div>

            {/* AI Assistant Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
              <AIAssistant />
            </div>

            {/* Achievements Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 mb-12">
              <h2 className="text-lg font-semibold text-neutral-800">Recent Achievements</h2>
              <p className="mt-1 text-sm text-neutral-500">Keep up the great work!</p>
              
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {isLoadingAchievements ? (
                  Array(6).fill(0).map((_, i) => (
                    <div key={i} className="flex justify-center items-center h-32">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ))
                ) : achievements.length > 0 ? (
                  achievements.map((achievement) => (
                    <AchievementBadge
                      key={achievement.id}
                      title={achievement.title}
                      description={achievement.description}
                      icon={achievement.icon}
                      category={achievement.category}
                    />
                  ))
                ) : (
                  <div className="col-span-6 py-10 text-center">
                    <p className="text-neutral-500">
                      No achievements yet. Keep learning to earn badges!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
