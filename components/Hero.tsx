"use client";

export function Hero() {
  return (
    <section className="relative">
      {/* Gradient background with fade to black */}
      <div className="absolute inset-0 
        bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))]
        from-purple-900/90 via-blue-900/50 to-transparent"
      />
      
      {/* Add a subtle fade at the top */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black to-transparent" />
      
      {/* Add a stronger fade at the bottom */}
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black via-black/90 to-transparent" />
      
      {/* Content */}
      <div className="relative pt-12 pb-20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block bg-gray-800/30 rounded-lg px-3 py-1 text-sm font-mono mb-6">
            $ npm i @matsource/search
          </div>
          <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Seamless Voice Communication<br /> & Intelligent Semantic Search
          </h1>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Automate inbound and outbound voice calls paired with cutting-edge semantic search designed for home and auto service companies.
          </p>
          <div>
            <button className="inline-flex items-center justify-center font-medium focus:outline-none focus:ring-2 focus:ring-matsource-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none h-12 px-8 bg-matsource-500 hover:bg-matsource-400 transition-colors rounded-full">
              Try it out
            </button>
          </div>
        </div>
      </div>
    </section>
  );
} 