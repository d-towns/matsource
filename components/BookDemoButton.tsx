"use client";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { PhoneCallIcon } from "lucide-react";
import Link from "next/link";
export const BookDemoButton = () => {
    return (
      
        <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        className="w-fit"
      >
        <Link href="#contact-us" className="w-fit" scroll={true}>
        <Button 
          className="bg-gradient-to-r from-primary to-secondary text-white rounded-full px-8 py-6 relative overflow-hidden group"
          style={{
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
          }}
        >
          <motion.div
            className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"
            initial={false}
            whileHover={{ opacity: 0.2 }}
          />
          <span className="text-white text-sm md:text-xl font-medium tracking-wide flex items-center ">
            Book a Call 
            <motion.span
              className="ml-3"
              whileHover={{ rotate: 15 }}
            >
              <PhoneCallIcon className="w-5 h-5" />
            </motion.span>
          </span>
        </Button>
        </Link>
      </motion.div>
    )
}