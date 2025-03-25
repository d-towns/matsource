import { getAllPosts } from "./actions";
import { Metadata } from "next";
import BlogCard from "@/components/BlogCard";

export const metadata: Metadata = {
  title: "Blog | Matsource",
  description: "Insights, trends, and strategies to help businesses thrive with AI and voice technologies",
  openGraph: {
    title: "Matsource Blog",
    description: "Insights, trends, and strategies to help businesses thrive with AI and voice technologies",
    type: "website",
  },
};

export default async function BlogPage() {
  const allPosts = await getAllPosts();
  
  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              BlueAgent Blog
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Insights, trends, and strategies to help businesses thrive with AI and voice technologies
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {
            allPosts.map((post, index) => (
              <BlogCard key={post.id} post={post} index={index} />
            ))
          }
        </div>
        
        <div
          className="text-center mt-16 p-8 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl"
        >
          <h2 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Stay updated with the latest insights, trends, and strategies in AI, voice technology, and customer service. 
          </p>
          
          <div className="flex max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-1 px-4 py-3 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button className="bg-primary text-white px-6 py-3 rounded-r-lg hover:bg-primary/90 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 