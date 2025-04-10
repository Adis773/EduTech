import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { AchievementBadge } from "@/components/dashboard/AchievementBadge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Trophy } from "lucide-react";

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  category: string;
}

interface UserAchievement {
  id: number;
  userId: number;
  achievementId: number;
  awardedAt: Date;
  achievement: Achievement;
}

export default function Achievements() {
  const { data: allAchievements, isLoading: isLoadingAll } = useQuery<Achievement[]>({
    queryKey: ["/api/achievements"],
  });

  const { data: userAchievements, isLoading: isLoadingUser } = useQuery<UserAchievement[]>({
    queryKey: ["/api/user/achievements"],
  });

  const isLoading = isLoadingAll || isLoadingUser;

  const achievementsByCategory = (achievements: Achievement[]) => {
    return achievements?.reduce((acc, achievement) => {
      const category = achievement.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(achievement);
      return acc;
    }, {} as Record<string, Achievement[]>) || {};
  };

  const earned = userAchievements?.map(ua => ua.achievement) || [];
  const earnedAchievementIds = new Set(earned.map(a => a.id));
  
  const locked = allAchievements?.filter(a => !earnedAchievementIds.has(a.id)) || [];

  const earnedByCategory = achievementsByCategory(earned);
  const lockedByCategory = achievementsByCategory(locked);

  const totalAchievements = allAchievements?.length || 0;
  const earnedCount = earned.length;
  const progressPercentage = totalAchievements > 0 
    ? Math.round((earnedCount / totalAchievements) * 100) 
    : 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-bold text-neutral-800">Achievements</h1>
                  <p className="mt-1 text-sm text-neutral-500">
                    Track your learning milestones and badges
                  </p>
                </div>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  <div className="mt-8 bg-white shadow rounded-lg p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-primary/10 p-3 rounded-full">
                        <Trophy className="h-8 w-8 text-primary" />
                      </div>
                      <div className="ml-5 flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-lg font-semibold">Achievement Progress</span>
                          <span className="text-sm font-medium">{earnedCount} / {totalAchievements}</span>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                        <p className="mt-2 text-sm text-neutral-500">
                          You've earned {earnedCount} out of {totalAchievements} possible achievements!
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <Tabs defaultValue="earned">
                      <TabsList>
                        <TabsTrigger value="earned">Earned</TabsTrigger>
                        <TabsTrigger value="locked">Locked</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="earned" className="mt-6">
                        {earned.length > 0 ? (
                          Object.entries(earnedByCategory).map(([category, achievements]) => (
                            <div key={category} className="mb-10">
                              <h2 className="text-lg font-semibold text-neutral-800 mb-4">{category}</h2>
                              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                                {achievements.map(achievement => (
                                  <AchievementBadge
                                    key={achievement.id}
                                    title={achievement.title}
                                    description={achievement.description}
                                    icon={achievement.icon}
                                    category={achievement.category}
                                  />
                                ))}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-12">
                            <p className="text-neutral-500">
                              You haven't earned any achievements yet. Keep learning to earn badges!
                            </p>
                          </div>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="locked" className="mt-6">
                        {locked.length > 0 ? (
                          Object.entries(lockedByCategory).map(([category, achievements]) => (
                            <div key={category} className="mb-10">
                              <h2 className="text-lg font-semibold text-neutral-800 mb-4">{category}</h2>
                              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                                {achievements.map(achievement => (
                                  <div key={achievement.id} className="relative">
                                    <div className="opacity-40">
                                      <AchievementBadge
                                        title={achievement.title}
                                        description={achievement.description}
                                        icon={achievement.icon}
                                        category={achievement.category}
                                      />
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <div className="p-2 bg-neutral-800/70 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-12">
                            <p className="text-neutral-500">
                              You've unlocked all available achievements! Congratulations!
                            </p>
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
