import { getPostBySlug, getRelatedPosts } from "../actions";
// import { ArticleJsonLd } from "next-seo";
import { Metadata } from "next";
import Image from "next/image";
import { Calendar, Clock, User } from "lucide-react";
import { formatDistance } from "date-fns";
import Link from "next/link";
import Markdown from "react-markdown";
import './page.css'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  
  return {
    title: `${post.title} | Matsource Blog`,
    description: post.subtitle,
    openGraph: {
      title: post.title,
      description: post.subtitle,
      type: 'article',
      publishedTime: post.created_at,
      modifiedTime: post.updated_at,
      authors: [post.author],
      images: post.images && post.images.length > 0 ? [post.images[0]] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.subtitle,
      images: post.images && post.images.length > 0 ? [post.images[0]] : [],
    }
  };
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  const relatedPosts = await getRelatedPosts(params.slug, 3);
  const readingTime = Math.ceil(post.content.split(' ').length / 200); // Rough estimate: 200 words per minute
  const publishedDate = new Date(post.created_at);
  const timeAgo = formatDistance(publishedDate, new Date(), { addSuffix: true });

  return (
    <>
      {/* <ArticleJsonLd
      useAppDir={true}
        type="BlogPosting"
        url={`https://matsource.com/blog/${post.slug}`}
        title={post.title}
        images={post.images || []}
        datePublished={post.created_at}
        dateModified={post.updated_at}
        authorName={post.author}
        description={post.subtitle}
      /> */}

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <div className="relative w-full h-[40vh] md:h-[60vh] overflow-hidden">
          {post.images && post.images.length > 0 ? (
            <Image
              src={post.images[0]}
              alt={post.title}
              fill
              priority
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/90" />
          )}
          <div className="absolute inset-0 bg-black/30" />
          
          {/* Content Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="max-w-4xl mx-auto px-4 md:px-8 text-center text-white">
              <div className="mb-6 inline-flex items-center text-sm font-medium px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                <Link href="/blog" className="hover:underline">
                  Blog
                </Link>
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                {post.title}
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
                {post.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <div className="max-w-4xl mx-auto px-4 md:px-8 -mt-16 relative z-10">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
            {/* Meta Information */}
            <div className="flex flex-wrap gap-4 mb-8 pb-8 border-b text-gray-600 text-sm">
              <div className="flex items-center">
                <User size={16} className="mr-2" /> 
                <span>{post.author}</span>
              </div>
              <div className="flex items-center">
                <Calendar size={16} className="mr-2" /> 
                <time dateTime={post.created_at}>
                  {new Date(post.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long', 
                    day: 'numeric'
                  })} 
                  <span className="text-gray-500 ml-1">({timeAgo})</span>
                </time>
              </div>
              <div className="flex items-center">
                <Clock size={16} className="mr-2" /> 
                <span>{readingTime} min read</span>
              </div>
            </div>

            {/* Main Article Content */}
            <div className="prose prose-lg md:prose-xl prose-blue max-w-none">
            <Markdown>{post.content}</Markdown>
            </div>

            {/* Additional Images */}
            {post.images && post.images.length > 1 && (
              <div className="mt-12">
                <h3 className="text-xl font-bold mb-4">Related Images</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {post.images.slice(1).map((image, index) => (
                    <div key={index} className="aspect-video relative rounded-lg overflow-hidden">
                      <Image
                        src={image}
                        alt={`${post.title} - Image ${index + 2}`}
                        fill
                        className="object-cover transition-transform hover:scale-105 duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Call to Action */}
            <div className="mt-12 p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl">
              <h3 className="text-xl font-bold mb-2">Want to learn more?</h3>
              <p className="mb-4">Discover how our AI solutions can transform your business operations.</p>
              <Link 
                href="/book-demo" 
                className="inline-flex items-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
              >
                Book a Demo
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-20">
            <h2 className="text-3xl font-bold mb-8 text-center">Continue Reading</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <div 
                  key={relatedPost.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  {relatedPost.images && relatedPost.images.length > 0 && (
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={relatedPost.images[0]}
                        alt={relatedPost.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="text-sm text-gray-500 mb-2">
                      {new Date(relatedPost.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                    <Link href={`/blog/${relatedPost.slug}`} className="group-hover:text-primary transition-colors">
                      <h3 className="font-bold text-xl mb-2">{relatedPost.title}</h3>
                    </Link>
                    <p className="text-gray-600 line-clamp-3">{relatedPost.subtitle}</p>
                    <Link 
                      href={`/blog/${relatedPost.slug}`} 
                      className="mt-4 inline-flex items-center text-primary font-medium group-hover:underline"
                    >
                      Read More
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
} 