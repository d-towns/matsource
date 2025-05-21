import Link from "next/link";

export default function Footer() {
    return (
        <footer className="py-8 md:py-12 bg-gradient-to-b from-gray-200 to-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center mb-4 sm:mb-0">
              <span className="text-3xl mr-2" role="img" aria-label="Construction Worker">
                👨‍🔧
              </span>
              <span className="text-base md:text-lg font-bold">
                BlueAgent
              </span>
            </div>
            <nav className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm md:text-base">
              <Link href="/#services" className=" hover:text-primary transition-colors">
                Services
              </Link>
              <Link href="/pricing" className=" hover:text-primary transition-colors">
                Pricing
              </Link>
              <Link href="/#contact-us" className=" hover:text-primary transition-colors">
                Contact
              </Link>
            </nav>
            <div className="flex flex-col text-sm md:text-base font-sans">
              <h3 className="font-semibold">Customer Support</h3>
              <p><span className="font-medium">Phone:</span> <a href="tel:+18103394953" className="hover:text-primary transition-colors">+1 810 339 4953</a></p>
              <address className="not-italic">
                6272 Saginaw Road<br/>
                #1014<br/>
                Grand Blanc, Michigan 48439<br/>
                United States
              </address>
            </div>
          </div>
          <div className="mt-4 md:mt-6 text-center text-xs md:text-sm text-gray-500">
            © {new Date().getFullYear()} BlueAgent. All rights reserved.
          </div>
        </div>
      </footer>
    )
}