"use client";

import * as React from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { AuthStatusClient } from "@/components/auth/auth-status-client";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useUser } from "@/hooks/use-user";

const solutions = [
  {
    title: "Voice Automation",
    href: "/solutions/voice",
  },
  {
    title: "Semantic Search",
    href: "/solutions/search",
  },
  {
    title: "Customer Service",
    href: "/solutions/customer-service",
  }
];

const resources = [
  {
    title: "Case Studies",
    href: "/case-studies",
  },
  {
    title: "Blog",
    href: "/blog",
  },
  {
    title: "About",
    href: "/about",
  }
];

export function MobileNav() {
  const { user } = useUser();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="top" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>
            <Link href="/" className="flex items-center">
              <span className="text-3xl mr-2" role="img" aria-label="Construction Worker">
                👷‍♂️
              </span>
              <span className="text-xl font-bold">Matsource</span>
            </Link>
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 mt-8">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold mb-2">Solutions</h3>
            {solutions.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded-md hover:bg-muted"
              >
                {item.title}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold mb-2">Resources</h3>
            {resources.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded-md hover:bg-muted"
              >
                {item.title}
              </Link>
            ))}
          </div>
          <Link
            href="/pricing"
            className="text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded-md hover:bg-muted"
          >
            Pricing
          </Link>
          <div className="mt-4 flex flex-col gap-4">
            <AuthStatusClient user={user} />
            <ThemeToggle />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
} 