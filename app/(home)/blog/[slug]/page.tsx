import { ArticleJsonLd } from 'next-seo'

export default function BlogPost() {
  return (
    <>
      <ArticleJsonLd
        url="https://matsource.io/blog/how-ai-is-revolutionizing-the-service-industry"
        title="How AI is Revolutionizing the Service Industry"
        images={["https://matsource.io/images/blog/ai-revolution.jpg"]}
        datePublished="2023-05-15T00:00:00+00:00"
        dateModified="2023-05-15T00:00:00+00:00"
        authorName="Michael Chen"
        description="Explore the transformative impact of artificial intelligence..."
        scriptKey="article"
        type="Article"
        data={{
          headline: "How AI is Revolutionizing the Service Industry",
          description: "Explore the transformative impact of artificial intelligence...",
          image: "https://matsource.io/images/blog/ai-revolution.jpg",
          datePublished: "2023-05-15T00:00:00+00:00",
          dateModified: "2023-05-15T00:00:00+00:00",
          author: {
            '@type': 'Person',
            name: 'Michael Chen',
          },
          publisher: {
            '@type': 'Organization',
            name: 'Matsource AI',
            logo: {
              '@type': 'ImageObject',
              url: 'https://matsource.io/logo.png',
            },
          },
        }}
      />
      {/* Your blog post content */}
    </>
  );
} 