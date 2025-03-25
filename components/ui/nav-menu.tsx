"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const solutions = [
  {
    title: "Inbound Voice AI",
    href: "/solutions/inbound-voice-agents",
    description: "Automate inbound and outbound calls with Conversational AI voice agents."
  },
  {
    title: "Outbound Voice AI",
    href: "/solutions/outbound-voice-agents",
    description: "Automate outbound calls with Conversational AI voice agents."
  },
  {
    title: "Automated Procurement",
    href: "/solutions/automated-procurement",
    description: "Automate procurement processes with Ai Agents that can make phone calls and use the internet to find the best deals."
  },
  {
    title: "Customer Support",
    href: "/solutions/customer-support",
    description: "Regular updates, performace boosts & fixes to ensure your agents run smoothly."
  }
];

const resources = [

  {
    title: "Case Studies",
    href: "/case-studies",
    description: "See how other businesses are using Matsource."
  },
  {
    title: "Blog",
    href: "/blog",
    description: "Latest updates, best practices, and industry insights."
  },,
  {
    title: "About",
    href: "/about",
    description: "Learn more about Matsource and our mission.",
  }
];

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-900 hover:text-white focus:bg-gray-900 focus:text-white text-white",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-gray-200">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export function NavMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {solutions.map((item) => (
                <ListItem
                  key={item.title}
                  title={item.title}
                  href={item.href}
                >
                  {item.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px]">
              {resources.map((item) => (
                <ListItem
                  key={item.title}
                  title={item.title}
                  href={item.href}
                >
                  {item.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/pricing" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Pricing
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
} 