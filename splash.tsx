import { Metadata } from "next"

export const metadata: Metadata = {
  title: "BlueAgent Splash",
  description: "BlueAgent - Your AI Assistant"
}

export default function SplashPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-r from-primary/10 to-secondary/10">
      <div className="text-center">
        <div className="text-6xl mb-4">🤖</div>
        <h1 className="text-4xl font-bold">BlueAgent</h1>
      </div>
    </div>
  )
} 