import { Navbar } from "@/components/Navbar"
import Footer from "@/components/Footer"
import { config } from "@/lib/config"

const isWhiteLabel = config.env.isWhiteLabel;

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {isWhiteLabel ? <>{children}</> : (
        <>
          <Navbar />
          {children}
          <Footer />
        </>
      )}
    </div>
  )
} 