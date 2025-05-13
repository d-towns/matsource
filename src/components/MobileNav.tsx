"use client";

import * as React from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { AuthStatusClient } from "@/components/auth/auth-status-client";
import { PhoneIncoming, PhoneOutgoing, PackageCheck, HandshakeIcon, BookOpen} from "lucide-react";
// import { ThemeToggle } from "@/components/ThemeToggle";
import { useUser } from "@/hooks/use-user";
import { BookDemoButton } from "./BookDemoButton";

const solutions = [
  {
    title: "Inbound Voice AI",
    href: "/solutions/inbound-voice-agents",
    description: "Automate inbound calls with conversational AI voice agents. Have you own digital receptionist, available 24/7.",
    icon: PhoneIncoming
  },
  {
    title: "Outbound Voice AI",
    href: "/solutions/outbound-voice-agents",
    description: "Save time and resources by qualifying leads, scheduling appointments, and following up with customers via conversational AI voice agents.",
    icon: PhoneOutgoing
  },
  {
    title: "Automated Procurement",
    href: "/solutions/automated-procurement",
    description: "Automate procurement processes with AI agents that can make phone calls and use the internet",
    icon: PackageCheck
  },
  {
    title: "Customer Support",
    href: "/solutions/customer-support",
    description: "Regular updates, performace boosts & fixes to ensure your agents run smoothly.",
    icon: HandshakeIcon
  }
];

const resources = [

  // {
  //   title: "Case Studies",
  //   href: "/case-studies",
  //   description: "See how other businesses are using Matsource."
  // },
  {
    title: "Blog",
    href: "/blog",
    description: "Latest updates, best practices, and industry insights.",
    icon: BookOpen
  },
  // {
  //   title: "About",
  //   href: "/about",
  //   description: "Learn more about Matsource and our mission.",
  // }
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
      <SheetContent side="top" className="w-full p-0 font-sans">
        <SheetHeader className="px-4 py-4 border-b flex flex-row justify-between">
          <SheetTitle>
            <Link href="/" className="flex items-center">
              <span className="text-3xl mr-2" role="img" aria-label="Construction Worker">
                👷‍♂️
              </span>
              <span className="text-xl font-bold">BlueAgent</span>
            </Link>
          </SheetTitle>
        </SheetHeader>
        <div className="px-4 border-b">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="solutions">
              <AccordionTrigger className="text-xl py-4">Solutions</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col space-y-4 pb-4 border-t pt-4">
                  {solutions.map((item) => (
                    <SheetClose asChild key={item.title}>
                      <Link
                        href={item.href}
                        className="flex flex-col space-y-1 px-2"
                    >
                      <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-2 flex items-center justify-center bg-gray-100 rounded-md">
                          <item.icon className="w-6 h-6" />
                        </div>
                        <div className="col-span-10">
                          <div className="flex flex-col">
                            <span className="font-medium">{item.title}</span>
                            <span className="text-sm text-muted-foreground">{item.description}</span>
                          </div>
                        </div>
                      </div>
                      
                      </Link>
                    </SheetClose>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="resources">
              <AccordionTrigger className="text-xl py-4">Resources</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col space-y-4 pb-4">
                  {resources.map((item) => (
                    <SheetClose asChild key={item.title}>
                      <Link
                        href={item.href}
                        className="flex flex-col space-y-1 px-2"
                    >
                      <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-2 flex items-center justify-center bg-gray-100 rounded-md">
                          <item.icon className="w-6 h-6" />
                        </div>
                        <div className="col-span-10">
                          <div className="flex flex-col">
                            <span className="font-medium">{item.title}</span>
                            <span className="text-sm text-muted-foreground">{item.description}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                    </SheetClose>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <SheetClose asChild>
            <Link
              href="/pricing"
              className="block text-xl py-4 hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
          </SheetClose>
        </div>
        <div className="mt-4 flex justify-center flex-row gap-4 pb-4">
            <SheetClose >
            <AuthStatusClient user={user} showSignOut={false} showGetStarted={false} />
          </SheetClose>
          <SheetClose asChild>
            <BookDemoButton />
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
} 