import { ReactNode } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: ReactNode;
  iconColor: string;
  iconBgColor: string;
  title: string;
  value: string;
  footerText?: string;
  footerLink?: string;
  badge?: {
    text: string;
    color: string;
  };
}

export function StatsCard({
  icon,
  iconColor,
  iconBgColor,
  title,
  value,
  footerText,
  footerLink,
  badge,
}: StatsCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center">
          <div className={`flex-shrink-0 ${iconBgColor} rounded-md p-3`}>
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-neutral-500 truncate">{title}</dt>
              <dd>
                <div className="text-lg font-bold text-neutral-900">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </CardContent>
      {(footerText || badge) && (
        <CardFooter className="bg-neutral-50 px-4 py-4">
          <div className="text-sm w-full">
            <div className="flex justify-between items-center">
              {footerLink ? (
                <a
                  href={footerLink}
                  className="font-medium text-primary hover:text-primary/90"
                >
                  {footerText}
                </a>
              ) : (
                <span className="font-medium text-primary">{footerText}</span>
              )}
              {badge && (
                <Badge
                  variant="outline"
                  className={`${badge.color} px-2 py-1 rounded-full text-xs font-medium`}
                >
                  {badge.text}
                </Badge>
              )}
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
