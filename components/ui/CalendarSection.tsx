'use client'

import CalComEmbed from "./CalComEmbed";

export default function CalendarSection() {
  return (
    <div id="contact-us" className="flex flex-col justify-center items-center h-screen pt-24">
        <div className="flex flex-col max-w-7xl w-full items-center justify-between">
            <h2 className="text-4xl font-bold mb-2">Lets Connect.</h2>
            <p className="text-left text-gray-500 mb-16 w-1/4">If you&lsquo;re ready to explore an AI Voice solution for your business, feel free to schedule a discovery call.</p>
        </div>
      <CalComEmbed />
    </div>
  );
}