import { useEffect, useState } from "react";
import { useOnboarding } from "@/hooks/use-onboarding";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LifeBuoy, BookOpen, Lightbulb, HelpCircle, Video, Mail, MessageSquare } from "lucide-react";

export default function HelpPage() {
  const { startTutorial } = useOnboarding();
  const [currentPage, setCurrentPage] = useState<string>("");

  useEffect(() => {
    // Determine current page from URL
    const path = window.location.pathname;
    if (path === "/") setCurrentPage("dashboard");
    else setCurrentPage(path.substring(1)); // Remove the leading slash
  }, []);

  const handleStartTutorial = (tutorialId: string) => {
    // Go to the appropriate page first if needed
    if (tutorialId === "dashboard" && currentPage !== "dashboard") {
      window.location.href = "/";
      return;
    }
    
    startTutorial(tutorialId);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold text-neutral-800">Help Center</h1>
              <p className="mt-2 text-lg text-neutral-600">
                Everything you need to get started with EduTech AI
              </p>

              {/* Tutorials Section */}
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-neutral-800 mb-4">Interactive Tutorials</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BookOpen className="h-5 w-5 mr-2 text-primary" />
                        Dashboard Tutorial
                      </CardTitle>
                      <CardDescription>
                        Learn the basics of navigating your personalized dashboard
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-neutral-600">
                        This tutorial will guide you through the main features of your dashboard,
                        including stats, course progress, and achievement tracking.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={() => handleStartTutorial("dashboard")}>
                        Start Tutorial
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Lightbulb className="h-5 w-5 mr-2 text-amber-500" />
                        AI Assistant Tutorial
                      </CardTitle>
                      <CardDescription>
                        Learn how to use the AI assistant for better learning
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-neutral-600">
                        Discover how our AI can help explain complex topics, answer your questions,
                        and provide personalized learning recommendations.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" onClick={() => handleStartTutorial("ai-assistant")}>
                        Coming Soon
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <HelpCircle className="h-5 w-5 mr-2 text-green-500" />
                        Course Navigation Tutorial
                      </CardTitle>
                      <CardDescription>
                        Master the course interface and learning tools
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-neutral-600">
                        This tutorial walks you through taking courses effectively, tracking progress,
                        and using interactive features to enhance learning.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" onClick={() => handleStartTutorial("course-navigation")}>
                        Coming Soon
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>

              {/* Help Resources Section */}
              <div className="mt-12">
                <h2 className="text-xl font-semibold text-neutral-800 mb-4">Help Resources</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Video className="h-5 w-5 mr-2 text-primary" />
                        Video Tutorials
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-neutral-600">
                        Watch step-by-step video guides for all platform features
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline">Browse Videos</Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <MessageSquare className="h-5 w-5 mr-2 text-amber-500" />
                        FAQs
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-neutral-600">
                        Find answers to commonly asked questions about the platform
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline">View FAQs</Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Mail className="h-5 w-5 mr-2 text-green-500" />
                        Contact Support
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-neutral-600">
                        Get in touch with our support team for personalized help
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline">Contact Us</Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}