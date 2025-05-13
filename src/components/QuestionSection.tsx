"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export function QuestionSection() {
    return (
        <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        viewport={{ once: true }}
        className="mt-16 rounded-3xl border shadow-md p-8 flex flex-col md:flex-row justify-between items-center"
      >
        <h3 className="text-2xl font-bold mb-4 md:mb-0">But, What is a Voice AI Agent?</h3>
        <Link href="https://chatgpt.com/c/67ed75ff-9668-8013-9fd3-a38b454f6ac5" className="text-primary">Learn More</Link>
      </motion.div>
    )
}