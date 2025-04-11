import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  target: string; // CSS selector for the element to highlight
  placement?: 'top' | 'right' | 'bottom' | 'left';
  hasAction?: boolean; // If this step requires user action to proceed
}

export interface OnboardingTutorial {
  id: string;
  name: string;
  steps: OnboardingStep[];
}

// Define tutorials for different sections
export const DASHBOARD_TUTORIAL: OnboardingTutorial = {
  id: 'dashboard',
  name: 'Dashboard Tutorial',
  steps: [
    {
      id: 'welcome',
      title: 'Welcome to EduTech!',
      description: 'Let\'s take a quick tour to help you get started with our platform.',
      target: 'body', // Target the entire page
      placement: 'bottom',
    },
    {
      id: 'stats-cards',
      title: 'Your Learning Stats',
      description: 'These cards show your current progress, streak, and achievements.',
      target: '.stats-section',
      placement: 'bottom',
    },
    {
      id: 'courses-in-progress',
      title: 'Courses In Progress',
      description: 'Here you can see the courses you\'re currently taking. Click on a course to continue learning.',
      target: '.courses-section',
      placement: 'top',
    },
    {
      id: 'achievements',
      title: 'Your Achievements',
      description: 'Earn badges as you complete courses and reach milestones!',
      target: '.achievements-section',
      placement: 'top',
    },
    {
      id: 'ai-assistant',
      title: 'AI Learning Assistant',
      description: 'Need help? Our AI assistant can answer questions and provide guidance.',
      target: '.ai-assistant-section',
      placement: 'left',
    },
    {
      id: 'navigation',
      title: 'Navigation',
      description: 'Use the sidebar to explore different sections of the platform.',
      target: '.sidebar',
      placement: 'right',
    }
  ],
};

// More tutorials can be added for other sections

type OnboardingContextType = {
  isOnboarding: boolean;
  currentTutorial: OnboardingTutorial | null;
  currentStepIndex: number;
  currentStep: OnboardingStep | null;
  startTutorial: (tutorialId: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTutorial: () => void;
  completeTutorial: () => void;
  hasTutorialForCurrentPage: boolean;
};

export const OnboardingContext = createContext<OnboardingContextType | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOnboarding, setIsOnboarding] = useState<boolean>(false);
  const [currentTutorial, setCurrentTutorial] = useState<OnboardingTutorial | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [hasTutorialForCurrentPage, setHasTutorialForCurrentPage] = useState<boolean>(false);

  // Update onboarding status in database
  const updateOnboardingStatusMutation = useMutation({
    mutationFn: async (completed: boolean) => {
      const res = await apiRequest("PATCH", "/api/user/onboarding", { completed });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update onboarding status",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Check for available tutorials when path changes
  useEffect(() => {
    const currentPath = window.location.pathname;
    
    // Check if there's a tutorial for the current page
    if (currentPath === "/" || currentPath === "/dashboard") {
      setHasTutorialForCurrentPage(true);
    } else {
      setHasTutorialForCurrentPage(false);
    }
    
    // Auto-start tutorial for new users
    if (user && !user.onboardingCompleted && hasTutorialForCurrentPage && !isOnboarding) {
      if (currentPath === "/" || currentPath === "/dashboard") {
        startTutorial("dashboard");
      }
    }
  }, [user, window.location.pathname, hasTutorialForCurrentPage]);

  const startTutorial = (tutorialId: string) => {
    // Find the tutorial by ID
    let tutorial: OnboardingTutorial | null = null;
    
    if (tutorialId === "dashboard") {
      tutorial = DASHBOARD_TUTORIAL;
    }
    // Add more tutorials as needed
    
    if (tutorial) {
      setCurrentTutorial(tutorial);
      setCurrentStepIndex(0);
      setIsOnboarding(true);
    }
  };

  const nextStep = () => {
    if (!currentTutorial) return;
    
    if (currentStepIndex < currentTutorial.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      completeTutorial();
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const skipTutorial = () => {
    setIsOnboarding(false);
    setCurrentTutorial(null);
    
    // Mark onboarding as completed in the database
    if (user && !user.onboardingCompleted) {
      updateOnboardingStatusMutation.mutate(true);
    }
    
    toast({
      title: "Tutorial skipped",
      description: "You can restart the tutorial anytime from the help menu.",
    });
  };

  const completeTutorial = () => {
    setIsOnboarding(false);
    setCurrentTutorial(null);
    
    // Mark onboarding as completed in the database
    if (user && !user.onboardingCompleted) {
      updateOnboardingStatusMutation.mutate(true);
    }
    
    toast({
      title: "Tutorial completed!",
      description: "You're all set to start your learning journey.",
    });
  };

  const currentStep = currentTutorial && currentStepIndex < currentTutorial.steps.length
    ? currentTutorial.steps[currentStepIndex]
    : null;

  return (
    <OnboardingContext.Provider
      value={{
        isOnboarding,
        currentTutorial,
        currentStepIndex,
        currentStep,
        startTutorial,
        nextStep,
        prevStep,
        skipTutorial,
        completeTutorial,
        hasTutorialForCurrentPage,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
}