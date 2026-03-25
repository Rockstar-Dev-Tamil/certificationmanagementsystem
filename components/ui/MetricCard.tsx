import * as React from "react";
import { cn } from "@/lib/cn";
import { Card } from "./Card";
import { LucideIcon } from "lucide-react";

export interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isUp: boolean;
  };
  description?: string;
}

export function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  description,
  className,
  ...props
}: MetricCardProps) {
  return (
    <Card className={cn("relative overflow-hidden group", className)} {...props}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {title}
          </p>
          <h3 className="mt-2 text-3xl font-black text-slate-900 tracking-tight">
            {value}
          </h3>
          
          {trend && (
            <div className="mt-2 flex items-center gap-1.5">
              <span className={cn(
                "text-xs font-bold px-1.5 py-0.5 rounded",
                trend.isUp ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
              )}>
                {trend.isUp ? "↑" : "↓"} {trend.value}%
              </span>
              <span className="text-xs text-slate-400 font-medium">vs last month</span>
            </div>
          )}
          
          {description && !trend && (
            <p className="mt-1 text-xs text-slate-500 font-medium">
              {description}
            </p>
          )}
        </div>
        
        <div className="p-2.5 rounded-lg bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      
      {/* Decorative background element */}
      <div className="absolute -right-4 -bottom-4 opacity-[0.03] text-brand-900 group-hover:opacity-[0.05] transition-opacity">
        <Icon size={80} strokeWidth={1} />
      </div>
    </Card>
  );
}
