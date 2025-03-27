import Link from "next/link";
import { NavMenu } from "@/components/ui/nav-menu";
import { AuthStatus } from "@/components/auth/auth-status";
// import { ThemeToggle } from "@/components/ThemeToggle";
import { MobileNav } from "@/components/MobileNav";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container h-14 max-w-screen-2xl">
        <div className="relative flex h-14 items-center justify-between">
          {/* Left - Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-3xl mr-2" role="img" aria-label="Construction Worker">
                👨‍🔧
              </span>
              <span className="text-xl font-bold font-sans">BlueAgent</span>
            </Link>
          </div>
          
          {/* Center - Navigation Menu with Pricing link */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center gap-6">
            <NavMenu />
          </div>
          
          {/* Right - Auth & Theme */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4">
              <AuthStatus />
              {/* <ThemeToggle /> */}
            </div>
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
} 