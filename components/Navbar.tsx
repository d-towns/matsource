import Link from "next/link";
import { NavMenu } from "@/components/ui/nav-menu";
import { AuthStatus } from "@/components/auth/auth-status";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Navbar() {
  return (
    <header className="relative z-50">
      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-3xl mr-2" role="img" aria-label="Construction Worker">
              👷‍♂️
            </span>
            <span className="text-xl font-bold">Matsource</span>
          </Link>

          {/* Center Navigation */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <NavMenu />
          </div>

          {/* Right Side - Auth Status and Theme Toggle */}
          <div className="flex items-center gap-4">
            <AuthStatus />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
} 