import { cn } from "@/lib/utils";
import { 
  Award, 
  Code, 
  Brush, 
  Clock, 
  Star, 
  Layers,
  CheckCircle2,
  Rocket,
  Trophy,
  Zap,
  Medal
} from "lucide-react";

interface AchievementBadgeProps {
  title: string;
  description: string;
  icon: string;
  category: string;
}

export function AchievementBadge({
  title,
  description,
  icon,
  category
}: AchievementBadgeProps) {
  const getIconByName = (iconName: string) => {
    switch (iconName) {
      case "code":
        return <Code className="h-10 w-10 text-primary" />;
      case "brush":
        return <Brush className="h-10 w-10 text-green-500" />;
      case "clock":
        return <Clock className="h-10 w-10 text-amber-500" />;
      case "award":
        return <Award className="h-10 w-10 text-primary" />;
      case "star":
        return <Star className="h-10 w-10 text-green-500" />;
      case "layers":
        return <Layers className="h-10 w-10 text-amber-500" />;
      case "check":
        return <CheckCircle2 className="h-10 w-10 text-primary" />;
      case "rocket":
        return <Rocket className="h-10 w-10 text-green-500" />;
      case "trophy":
        return <Trophy className="h-10 w-10 text-amber-500" />;
      case "zap":
        return <Zap className="h-10 w-10 text-primary" />;
      case "medal":
        return <Medal className="h-10 w-10 text-green-500" />;
      default:
        return <Award className="h-10 w-10 text-primary" />;
    }
  };

  const getBgColorByCategory = () => {
    switch (category) {
      case "Web Development":
        return "bg-primary/10";
      case "Assessment":
        return "bg-primary/10";
      case "Project":
        return "bg-green-500/10";
      case "Engagement":
        return "bg-amber-500/10";
      default:
        return "bg-primary/10";
    }
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg p-4 text-center hover:shadow-md transition-shadow duration-200">
      <div className={cn(
        "mx-auto h-16 w-16 flex items-center justify-center rounded-full",
        getBgColorByCategory()
      )}>
        {getIconByName(icon)}
      </div>
      <h3 className="mt-2 text-sm font-medium text-neutral-800">{title}</h3>
      <p className="mt-1 text-xs text-neutral-500">{description}</p>
    </div>
  );
}
