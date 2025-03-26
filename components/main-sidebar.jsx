"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  FileText,
  Home,
  LayoutDashboard,
  ChevronDown,
  Settings,
  User,
  GraduationCap,
  Briefcase,
  LogIn,
  UserPlus,
  Menu,
  PlusCircle,
} from "lucide-react";

const sidebarNavItems = {
  beforeLogin: [
    {
      title: "Home",
      href: "/",
      icon: <Home className="h-5 w-5" />,
    },
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "Get Started",
      href: "/get-started",
      icon: <PlusCircle className="h-5 w-5" />,
    },
    {
      title: "Login",
      href: "/login",
      icon: <LogIn className="h-5 w-5" />,
    },
    {
      title: "Register",
      href: "/register",
      icon: <UserPlus className="h-5 w-5" />,
    },
  ],
  afterLogin: [
    {
      title: "Home",
      href: "/",
      icon: <Home className="h-5 w-5" />,
    },
    {
      title: "Overview",
      icon: <LayoutDashboard className="h-5 w-5" />,
      submenu: true,
      submenuItems: [
        {
          title: "My CVs",
          href: "/dashboard/cvs",
          icon: <FileText className="h-4 w-4" />,
        },
        {
          title: "Templates",
          href: "/dashboard/templates",
          icon: <FileText className="h-4 w-4" />,
        },
      ],
    },
    {
      title: "Resources",
      icon: <GraduationCap className="h-5 w-5" />,
      submenu: true,
      submenuItems: [
        {
          title: "CV Tips",
          href: "/dashboard/tips",
          icon: <FileText className="h-4 w-4" />,
        },
        {
          title: "Career Resources",
          href: "/dashboard/resources",
          icon: <Briefcase className="h-4 w-4" />,
        },
      ],
    },
    {
      title: "Account",
      icon: <User className="h-5 w-5" />,
      submenu: true,
      submenuItems: [
        {
          title: "Profile",
          href: "/dashboard/profile",
          icon: <User className="h-4 w-4" />,
        },
        {
          title: "Settings",
          href: "/dashboard/settings",
          icon: <Settings className="h-4 w-4" />,
        },
      ],
    },
  ],
};

export function MainSidebar({ className }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const [openSubMenus, setOpenSubMenus] = useState({});

  const toggleSubMenu = (title) => {
    setOpenSubMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  // Initialize open state based on current path
  useEffect(() => {
    if (user) {
      const newOpenState = {};
      sidebarNavItems.afterLogin.forEach((item) => {
        if (item.submenu) {
          const isActive = item.submenuItems.some(
            (subItem) => pathname === subItem.href
          );
          if (isActive) {
            newOpenState[item.title] = true;
          }
        }
      });
      setOpenSubMenus(newOpenState);
    }
  }, [pathname, user]);

  const navItems = user
    ? sidebarNavItems.afterLogin
    : sidebarNavItems.beforeLogin;

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <FileText className="h-6 w-6 text-green-500" />
          <span>CV Builder</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 py-4">
        <nav className="grid gap-1 px-2">
          {user && (
            <Button
              className="mb-4 w-full justify-start bg-green-500 hover:bg-green-600 text-white"
              asChild
            >
              <Link href="/cv/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New CV
              </Link>
            </Button>
          )}

          {navItems.map((item, index) => {
            if (item.submenu) {
              return (
                <div key={index} className="mb-2">
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-between font-medium",
                      openSubMenus[item.title] && "bg-muted"
                    )}
                    onClick={() => toggleSubMenu(item.title)}
                  >
                    <div className="flex items-center">
                      {item.icon}
                      <span className="ml-3">{item.title}</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        openSubMenus[item.title] && "rotate-180"
                      )}
                    />
                  </Button>
                  {openSubMenus[item.title] && (
                    <div className="ml-4 mt-1 grid gap-1">
                      {item.submenuItems.map((subItem, subIndex) => (
                        <Button
                          key={subIndex}
                          variant="ghost"
                          className={cn(
                            "w-full justify-start pl-6",
                            pathname === subItem.href && "bg-muted font-medium"
                          )}
                          asChild
                        >
                          <Link href={subItem.href}>
                            {subItem.icon}
                            <span className="ml-3">{subItem.title}</span>
                          </Link>
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Button
                key={index}
                variant="ghost"
                className={cn(
                  "w-full justify-start font-medium",
                  pathname === item.href && "bg-muted"
                )}
                asChild
              >
                <Link href={item.href}>
                  {item.icon}
                  <span className="ml-3">{item.title}</span>
                </Link>
              </Button>
            );
          })}
        </nav>
      </ScrollArea>
      {user && (
        <div className="mt-auto border-t p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
              <User className="h-4 w-4 text-green-500" />
            </div>
            <div className="grid gap-0.5">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile sidebar */}
      <Sheet>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="outline" size="icon" className="ml-2">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className={cn("hidden lg:block", className)}>
        <SidebarContent />
      </div>
    </>
  );
}
