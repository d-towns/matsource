import { Metadata } from "next"

export const metadata: Metadata = {
  title: "BlueAgent Splash",
  description: "BlueAgent - Your AI Assistant"
}

export default function SplashPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-r from-primary/10 to-secondary/10">
      <div className="text-center flex gap-3 items-center">
        <div className="text-6xl mb-4">👨‍🔧</div>
        <h1 className="text-5xl font-bold">BlueAgent</h1>
      </div>
      <div className="text-center flex">
      <p className="text-base md:text-2xl mb-4 max-w-3xl mx-auto px-4">
          <span className="font-semibold">Qualify </span>More Leads. {' '}
          <span className=" font-semibold">Book </span> More Appointments. {' '}
          <span className="font-semibold">Close </span>More Deals.
          </p>
      </div>
    </div>
  )
} 