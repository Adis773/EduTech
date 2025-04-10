import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CourseCardProps {
  id: number;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  progress?: number;
  rating?: number;
  reviewCount?: number;
  difficulty?: string;
  accentColor?: string;
  isContinue?: boolean;
  isRecommended?: boolean;
}

export function CourseCard({
  id,
  title,
  description,
  category,
  imageUrl,
  progress = 0,
  rating = 0,
  reviewCount = 0,
  difficulty = "Beginner",
  accentColor = "bg-primary",
  isContinue = false,
  isRecommended = false,
}: CourseCardProps) {
  const getBgColor = () => {
    switch (category) {
      case "Web Development":
        return "bg-primary text-white";
      case "Productivity":
        return "bg-amber-500 text-white";
      case "Programming":
        return "bg-green-500 text-white";
      case "Business":
        return "bg-amber-500 text-white";
      case "Marketing":
        return "bg-green-500 text-white";
      default:
        return "bg-primary text-white";
    }
  };

  const buttonVariant = isContinue ? "default" : "outline";
  const buttonColor = isContinue ? accentColor : "";
  const buttonText = isContinue ? "Continue Learning" : "Add to My Courses";

  const textColor = accentColor === "bg-primary" 
    ? "text-primary" 
    : accentColor === "bg-amber-500" 
      ? "text-amber-500" 
      : "text-green-500";

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200">
      <div className="relative h-48 bg-neutral-100">
        <img 
          src={imageUrl} 
          className="w-full h-full object-cover" 
          alt={title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <div className="absolute bottom-3 left-4">
          <Badge className={getBgColor()}>
            {category}
          </Badge>
        </div>
      </div>
      <div className="px-4 py-4">
        <div>
          <h3 className="text-lg font-semibold text-neutral-800">{title}</h3>
          <p className="mt-1 text-sm text-neutral-600">{description}</p>
          {isRecommended && (
            <div className="mt-3 flex items-center">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      i < Math.floor(rating) ? "text-amber-500 fill-amber-500" : "text-neutral-300"
                    )}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-neutral-500">
                {rating.toFixed(1)} ({reviewCount} ratings)
              </span>
            </div>
          )}
        </div>
        {isContinue && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-500">Progress</span>
              <span className="font-medium text-neutral-700">{progress}%</span>
            </div>
            <div className="mt-2 overflow-hidden bg-neutral-200 rounded-full">
              <Progress value={progress} className={accentColor} />
            </div>
          </div>
        )}
        <div className="mt-5">
          <Link href={isContinue ? `/course/${id}` : `/enroll/${id}`}>
            <Button 
              variant={buttonVariant as any} 
              className={cn(
                "w-full justify-center",
                buttonVariant === "outline" && textColor
              )}
            >
              {buttonText}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
