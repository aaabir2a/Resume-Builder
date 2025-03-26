"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  FileText,
  User,
  Briefcase,
  GraduationCap,
  BarChart,
  Settings,
  Plus,
} from "lucide-react";

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <BarChart className="mr-2 h-4 w-4" />,
  },
  {
    title: "My CVs",
    href: "/dashboard/cvs",
    icon: <FileText className="mr-2 h-4 w-4" />,
  },
  {
    title: "Templates",
    href: "/dashboard/templates",
    icon: <FileText className="mr-2 h-4 w-4" />,
  },
];

const resourcesNavItems = [
  {
    title: "CV Tips",
    href: "/dashboard/tips",
    icon: <GraduationCap className="mr-2 h-4 w-4" />,
  },
  {
    title: "Career Resources",
    href: "/dashboard/resources",
    icon: <Briefcase className="mr-2 h-4 w-4" />,
  },
];

const accountNavItems = [
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: <User className="mr-2 h-4 w-4" />,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: <Settings className="mr-2 h-4 w-4" />,
  },
];

export function Sidebar({ className }) {
  const pathname = usePathname();

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <Link href="/dashboard">
            <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
              CV Builder
            </h2>
          </Link>
          <div className="space-y-1">
            <Button
              variant="secondary"
              className="w-full justify-start"
              asChild
            >
              <Link href="/cv/new">
                <Plus className="mr-2 h-4 w-4" />
                Create New CV
              </Link>
            </Button>
          </div>
        </div>
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Overview
          </h2>
          <div className="space-y-1">
            {sidebarNavItems.map((item) => (
              <Button
                key={item.href}
                variant={pathname === item.href ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href={item.href}>
                  {item.icon}
                  {item.title}
                </Link>
              </Button>
            ))}
          </div>
        </div>
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Resources
          </h2>
          <div className="space-y-1">
            {resourcesNavItems.map((item) => (
              <Button
                key={item.href}
                variant={pathname === item.href ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href={item.href}>
                  {item.icon}
                  {item.title}
                </Link>
              </Button>
            ))}
          </div>
        </div>
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Account
          </h2>
          <div className="space-y-1">
            {accountNavItems.map((item) => (
              <Button
                key={item.href}
                variant={pathname === item.href ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href={item.href}>
                  {item.icon}
                  {item.title}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
