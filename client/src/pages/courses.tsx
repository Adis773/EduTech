import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { CourseCard } from "@/components/dashboard/CourseCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

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

export default function Courses() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const { data: userCourses, isLoading } = useQuery<UserCourse[]>({
    queryKey: ["/api/user/courses"],
  });

  // Filter courses based on search term and active tab
  const filteredCourses = userCourses?.filter(userCourse => {
    const matchesSearch = userCourse.course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          userCourse.course.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "completed") {
      return matchesSearch && userCourse.isCompleted;
    } else if (activeTab === "in-progress") {
      return matchesSearch && !userCourse.isCompleted;
    }
    
    return matchesSearch;
  }) || [];

  // Group courses by category
  const coursesByCategory = filteredCourses.reduce((acc, userCourse) => {
    const category = userCourse.course.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(userCourse);
    return acc;
  }, {} as Record<string, UserCourse[]>);

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
                  <h1 className="text-2xl font-bold text-neutral-800">My Courses</h1>
                  <p className="mt-1 text-sm text-neutral-500">
                    Manage and track your learning progress
                  </p>
                </div>
                <div className="mt-4 flex space-x-3 md:mt-0">
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button>
                    Explore New Courses
                  </Button>
                </div>
              </div>

              <div className="mt-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                  <Input
                    placeholder="Search your courses..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-6">
                <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList>
                    <TabsTrigger value="all">All Courses</TabsTrigger>
                    <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                  </TabsList>
                  <TabsContent value="all" className="mt-6">
                    {isLoading ? (
                      <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : filteredCourses.length > 0 ? (
                      Object.entries(coursesByCategory).map(([category, courses]) => (
                        <div key={category} className="mb-10">
                          <h2 className="text-lg font-semibold text-neutral-800 mb-4">{category}</h2>
                          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {courses.map(userCourse => {
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
                            })}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-neutral-500 mb-4">
                          {searchTerm ? "No courses match your search." : "You haven't enrolled in any courses yet."}
                        </p>
                        <Button>Browse Courses</Button>
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent value="in-progress" className="mt-6">
                    {isLoading ? (
                      <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : filteredCourses.length > 0 ? (
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredCourses.map(userCourse => {
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
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-neutral-500 mb-4">
                          {searchTerm ? "No in-progress courses match your search." : "You don't have any courses in progress."}
                        </p>
                        <Button>Browse Courses</Button>
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent value="completed" className="mt-6">
                    {isLoading ? (
                      <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : filteredCourses.length > 0 ? (
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredCourses.map(userCourse => {
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
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-neutral-500 mb-4">
                          {searchTerm ? "No completed courses match your search." : "You haven't completed any courses yet."}
                        </p>
                        <Button>Browse Courses</Button>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
