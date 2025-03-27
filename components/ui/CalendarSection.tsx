'use client'

import CalComDialogEmbed from "../CalComDialogEmbed";
import CalComEmbed from "./CalComEmbed";

export default function CalendarSection() {
  return (
    <div id="contact-us" className="flex flex-col md:justify-center items-center mb-16 md:mb-24 pt-16 md:pt-24">
        <div className="flex flex-col max-w-7xl w-full items-center justify-between">
            <h2 className="text-4xl font-bold mb-2">Lets Connect.</h2>
            <p className="text-left text-gray-500 mb-4 md:mb-16 px-4 md:px-0 w-full md:w-1/4">If you&lsquo;re ready to explore an AI Voice solution for your business, feel free to schedule a discovery call.</p>
        </div>
        <CalComEmbed />
        {/* { window.innerWidth > 768 && (
            <CalComEmbed />
        )}
        { window.innerWidth < 768 && (
            <CalComDialogEmbed />
        )} */}
    </div>
  );
}