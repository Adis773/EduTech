import { useEffect, useState } from "react";
import { useOnboarding } from "@/hooks/use-onboarding";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function TutorialPopover() {
  const {
    isOnboarding,
    currentStep,
    currentTutorial,
    currentStepIndex,
    nextStep,
    prevStep,
    skipTutorial,
    completeTutorial,
  } = useOnboarding();

  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [targetElement, setTargetElement] = useState<Element | null>(null);

  useEffect(() => {
    if (!isOnboarding || !currentStep) return;

    // Find the target element using the selector
    const element = document.querySelector(currentStep.target);
    if (!element) return;

    setTargetElement(element);

    // Add highlight to the target element
    element.classList.add("tutorial-highlight");

    // Calculate position based on the element and placement
    const rect = element.getBoundingClientRect();
    const placement = currentStep.placement || "bottom";

    // Basic positioning based on placement
    let top = 0;
    let left = 0;

    switch (placement) {
      case "top":
        top = rect.top - 10 - 180; // Height of the card + margin
        left = rect.left + rect.width / 2 - 150; // Half the card width
        break;
      case "right":
        top = rect.top + rect.height / 2 - 90; // Half the card height
        left = rect.right + 10;
        break;
      case "bottom":
        top = rect.bottom + 10;
        left = rect.left + rect.width / 2 - 150; // Half the card width
        break;
      case "left":
        top = rect.top + rect.height / 2 - 90; // Half the card height
        left = rect.left - 10 - 300; // Width of the card + margin
        break;
    }

    // Ensure the popover stays within viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (left < 20) left = 20;
    if (left + 300 > viewportWidth - 20) left = viewportWidth - 320;
    if (top < 20) top = 20;
    if (top + 180 > viewportHeight - 20) top = viewportHeight - 200;

    setPosition({ top, left });

    // Cleanup function to remove highlight
    return () => {
      element.classList.remove("tutorial-highlight");
    };
  }, [currentStep, isOnboarding]);

  // Add a scroll listener to adjust position when scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (!targetElement) return;

      const rect = targetElement.getBoundingClientRect();
      const placement = currentStep?.placement || "bottom";

      // Recalculate position based on new rect
      let top = 0;
      let left = 0;

      switch (placement) {
        case "top":
          top = rect.top - 10 - 180;
          left = rect.left + rect.width / 2 - 150;
          break;
        case "right":
          top = rect.top + rect.height / 2 - 90;
          left = rect.right + 10;
          break;
        case "bottom":
          top = rect.bottom + 10;
          left = rect.left + rect.width / 2 - 150;
          break;
        case "left":
          top = rect.top + rect.height / 2 - 90;
          left = rect.left - 10 - 300;
          break;
      }

      // Ensure the popover stays within viewport
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      if (left < 20) left = 20;
      if (left + 300 > viewportWidth - 20) left = viewportWidth - 320;
      if (top < 20) top = 20;
      if (top + 180 > viewportHeight - 20) top = viewportHeight - 200;

      setPosition({ top, left });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [targetElement, currentStep]);

  if (!isOnboarding || !currentStep || !currentTutorial) {
    return null;
  }

  const isLastStep = currentStepIndex === currentTutorial.steps.length - 1;

  return (
    <>
      {/* Overlay to capture clicks during tutorial */}
      <div 
        className="fixed inset-0 bg-black/20 z-40"
        onClick={(e) => {
          // Allow clicks on the tutorial card itself
          if (e.target === e.currentTarget) {
            e.stopPropagation();
          }
        }}
      />
      
      {/* Tutorial card */}
      <Card
        className="fixed z-50 w-[300px] shadow-lg"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
        }}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">
              {currentStep.title}
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={skipTutorial}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{currentStep.description}</p>
        </CardContent>
        <CardFooter className="pt-2 flex justify-between">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            Step {currentStepIndex + 1} of {currentTutorial.steps.length}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={prevStep}
              disabled={currentStepIndex === 0}
              className={cn("h-8 px-2", {
                "opacity-50 cursor-not-allowed": currentStepIndex === 0,
              })}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={isLastStep ? completeTutorial : nextStep}
              className="h-8 px-2"
            >
              {isLastStep ? "Finish" : "Next"}
              {!isLastStep && <ChevronRight className="h-4 w-4 ml-1" />}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </>
  );
}