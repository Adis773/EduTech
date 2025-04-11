import React from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Book, 
  Globe, 
  Award, 
  Shield, 
  Zap,
  Settings,
  BookOpen,
  Clock,
  Briefcase,
  LifeBuoy
} from "lucide-react";

export function Sidebar() {
  const [location] = useLocation();

  const navItems = [
    { 
      href: "/", 
      label: "Dashboard", 
      icon: <Home className="flex-shrink-0 mr-3 h-5 w-5" /> 
    },
    { 
      href: "/courses", 
      label: "My Courses", 
      icon: <Book className="flex-shrink-0 mr-3 h-5 w-5" /> 
    },
    { 
      href: "/discover", 
      label: "Discover", 
      icon: <Globe className="flex-shrink-0 mr-3 h-5 w-5" /> 
    },
    { 
      href: "/achievements", 
      label: "Achievements", 
      icon: <Award className="flex-shrink-0 mr-3 h-5 w-5" /> 
    },
    { 
      href: "/competitions", 
      label: "Competitions", 
      icon: <Shield className="flex-shrink-0 mr-3 h-5 w-5" /> 
    },
    { 
      href: "/help", 
      label: "Help & Tutorials", 
      icon: <LifeBuoy className="flex-shrink-0 mr-3 h-5 w-5" /> 
    },
    { 
      href: "/settings", 
      label: "Settings", 
      icon: <Settings className="flex-shrink-0 mr-3 h-5 w-5" /> 
    },
  ];

  const learningPaths = [
    {
      href: "/path/web-development",
      label: "Web Development",
      color: "bg-green-500"
    },
    {
      href: "/path/time-management",
      label: "Time Management",
      color: "bg-amber-500"
    },
    {
      href: "/path/digital-marketing",
      label: "Digital Marketing",
      color: "bg-primary"
    }
  ];

  return (
    <div className="sidebar md:flex w-64 flex-shrink-0 bg-white shadow-sm hidden">
      <div className="w-full">
        <div className="flex flex-col h-screen">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <nav className="mt-5 px-2 space-y-1">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <div
                    className={cn(
                      "flex items-center px-4 py-3 text-sm font-medium rounded-md group",
                      location === item.href
                        ? "bg-primary text-white"
                        : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800"
                    )}
                  >
                    {React.cloneElement(item.icon, {
                      className: cn(
                        item.icon.props.className,
                        location === item.href
                          ? "text-white"
                          : "text-neutral-500"
                      ),
                    })}
                    {item.label}
                  </div>
                </Link>
              ))}

              <div className="pt-4 mt-4 border-t border-neutral-200">
                <h3 className="px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  My Learning Paths
                </h3>
                <div className="mt-2 space-y-1">
                  {learningPaths.map((path) => (
                    <Link key={path.href} href={path.href}>
                      <div className="flex items-center px-4 py-2 text-sm font-medium text-neutral-600 rounded-md hover:bg-neutral-100 hover:text-neutral-800 group">
                        <span className={`w-2 h-2 mr-3 rounded-full ${path.color}`}></span>
                        {path.label}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </nav>
          </div>
          <div className="p-4 border-t border-neutral-200">
            <div className="flex items-center">
              <Zap className="h-5 w-5 text-primary" />
              <div className="ml-2">
                <p className="text-xs font-medium text-neutral-500">Premium Plan</p>
                <p className="text-xs text-neutral-400">Expires in 28 days</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}