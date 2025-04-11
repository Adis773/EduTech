import { useOnboarding } from "@/hooks/use-onboarding";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";

export function WelcomeModal() {
  const { user } = useAuth();
  const { startTutorial, hasTutorialForCurrentPage } = useOnboarding();

  // Only show for new users
  if (!user || user.onboardingCompleted || !hasTutorialForCurrentPage) {
    return null;
  }

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Welcome to SmartLearnix!</DialogTitle>
          <DialogDescription>
            We're excited to have you join our learning platform. Would you like a quick tour to help you get started?
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-center">
            <img 
              src="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Welcome illustration" 
              className="rounded-lg w-full max-w-[300px] h-[180px] object-cover" 
            />
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Learn at your own pace with personalized courses and AI assistance.
          </p>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => startTutorial("dashboard")}
            className="flex-1 sm:flex-none"
          >
            Get Started
          </Button>
          <Button
            variant="default"
            onClick={() => startTutorial("dashboard")}
            className="flex-1 sm:flex-none"
          >
            Take the Tour
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}