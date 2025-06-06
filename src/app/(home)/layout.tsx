// import { Navbar } from "@/components/Navbar"
// import Footer from "@/components/Footer"
export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* <Navbar /> */}
      {children}
      {/* <Footer /> */}
    </div>
  )
} 