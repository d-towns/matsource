'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Bar, BarChart, Pie, PieChart, Cell, ResponsiveContainer, XAxis, YAxis, Label } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const validationData = {
  "title": "Why Your Service-Based Business Needs Voice AI",
  "introduction": "Voice AI technology is no longer reserved for large corporations. Small businesses are leveraging AI to streamline operations, enhance customer interactions, and boost productivity. Here's why your business should consider implementing Voice AI:",
  "benefits": [
    {
      "headline": "Boost Productivity and Job Satisfaction",
      "description": "Implementing AI tools like Voice AI can significantly enhance productivity by automating routine tasks. According to recent research, 62% of small business owners who adopted AI saw increased employee productivity, while 63% reported improved job satisfaction.",
      "source": "Axios",
      "link": "https://www.axios.com/sponsored/whats-new-and-whats-next-how-small-business-owners-are-using-ai?utm_source=chatgpt.com"
    },
    {
      "headline": "Automate Routine Tasks Effectively",
      "description": "Voice AI is a game-changer for small businesses looking to automate repetitive tasks. Whether it's drafting emails, creating marketing content, or managing customer queries, AI can handle it efficiently, freeing up your team to focus on strategic activities.",
      "source": "Axios",
      "link": "https://www.axios.com/sponsored/whats-new-and-whats-next-how-small-business-owners-are-using-ai?utm_source=chatgpt.com"
    },
    {
      "headline": "Level the Playing Field with Larger Competitors",
      "description": "Small businesses can use Voice AI to deliver the same level of customer interaction and efficiency as larger firms. Nearly 89% of small businesses have already integrated some form of AI to stay competitive.",
      "source": "Axios",
      "link": "https://www.axios.com/sponsored/whats-new-and-whats-next-how-small-business-owners-are-using-ai?utm_source=chatgpt.com"
    },
    {
      "headline": "Enhance Customer Engagement",
      "description": "Voice AI enables quick responses to customer inquiries, improving satisfaction and loyalty. From answering common questions to guiding users through services, Voice AI enhances customer experience and keeps clients engaged.",
      "source": "McKinsey",
      "link": "https://www.mckinsey.com/capabilities/operations/our-insights/the-next-frontier-of-customer-engagement-ai-enabled-customer-service?utm_source=chatgpt.com"
    },
    {
      "headline": "Cost-Effective and Easy to Implement",
      "description": "Despite common misconceptions, modern Voice AI solutions are accessible and affordable for small businesses. Intuitive interfaces and pre-built models make adoption seamless and cost-effective.",
      "source": "Axios",
      "link": "https://www.axios.com/sponsored/whats-new-and-whats-next-how-small-business-owners-are-using-ai?utm_source=chatgpt.com"
    }
  ],
  "charts": [
    {
      "title": "Impact of AI on Productivity and Job Satisfaction",
      "type": "BarChart",
      "data": [
        { "label": "Increased Productivity", "value": 62 },
        { "label": "Improved Job Satisfaction", "value": 63 }
      ],
      "source": "Axios",
      "link": "https://www.axios.com/sponsored/whats-new-and-whats-next-how-small-business-owners-are-using-ai?utm_source=chatgpt.com"
    },
    {
      "title": "Adoption of AI Among Small Businesses",
      "type": "PieChart",
      "data": [
        { "label": "AI Adopted", "value": 89 },
        { "label": "Not Adopted", "value": 11 }
      ],
      "source": "Axios",
      "link": "https://www.axios.com/sponsored/whats-new-and-whats-next-how-small-business-owners-are-using-ai?utm_source=chatgpt.com"
    }
  ],
  "call_to_action": "Don't let outdated processes hold your business back. Discover how Voice AI can transform your customer interactions and boost your team's productivity. Get started today!"
};

const chartConfig = {
  productivity: {
    label: "Productivity Impact",
    color: "hsl(var(--chart-1))",
  },
  satisfaction: {
    label: "Job Satisfaction",
    color: "hsl(var(--chart-2))",
  },
  adoption: {
    label: "AI Adoption",
    color: "hsl(var(--chart-3))",
  },
  nonadoption: {
    label: "Non-Adoption",
    color: "hsl(var(--chart-4))",
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

const CombinedCard = ({ benefit, chart }) => {
  const chartData = chart.data.map(item => ({
    name: item.label,
    value: item.value
  }));

  return (
    <motion.div
      variants={itemVariants}
      className="lg:col-span-3 group relative"
    >
      <Link href={benefit.link} target="_blank" rel="noopener noreferrer">
        <div className="h-full p-6 rounded-2xl bg-card hover:bg-card/80 border border-border transition-all duration-300 hover:shadow-lg">
          <div className="flex flex-col h-full">
            <h3 className="text-xl font-sans font-semibold mb-3">
              {benefit.headline}
            </h3>
            <p className="text-base font-sans text-muted-foreground mb-6">
              {benefit.description}
            </p>
            
            <div className="h-[250px] w-full mb-6">
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  {chart.type === "BarChart" ? (
                    <BarChart data={chartData}>
                      <XAxis dataKey="name" 
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            />
                      <YAxis />
                      <Bar
                        dataKey="value"
                        radius={[4, 4, 0, 0]}
                        fill={`hsl(var(--chart-${Math.floor(Math.random() * 4) + 1}))`}
                      />
                      {/* <ChartTooltip content={<ChartTooltipContent />} /> */}
                    </BarChart>
                  ) : (
                    <PieChart>
                      <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={100}
                        outerRadius={120}
                      >
<Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize={16}
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {chartData.reduce((acc, curr) => curr.value > acc ? curr.value : acc, 0)}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                          fontSize={14}
                        >
                          Of SMB's have adopted AI
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
                        {chartData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={index === 0 ? "hsl(var(--chart-3))" : "hsl(var(--chart-4))"}
                          />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  )}
                </ResponsiveContainer>
              </ChartContainer>
            </div>

            <div className="flex items-center text-xs text-primary mt-8 ">
              <span className="font-sans font-medium">Source: {benefit.source}</span>
              <svg
                className="w-4 h-4 ml-1 transform transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const RegularCard = ({ benefit }) => (
  <motion.div
    variants={itemVariants}
    className="lg:col-span-2 group relative"
  >
    <Link href={benefit.link} target="_blank" rel="noopener noreferrer">
      <div className="h-full p-6 rounded-2xl bg-card hover:bg-card/80 border border-border transition-all duration-300 hover:shadow-lg">
        <h3 className="text-xl font-sans font-semibold mb-3">
          {benefit.headline}
        </h3>
        <p className="text-base font-sans text-muted-foreground mb-4">
          {benefit.description}
        </p>
        <div className="flex items-center text-xs text-primary">
          <span className="font-sans font-medium">Source: {benefit.source}</span>
          <svg
            className="w-4 h-4 ml-1 transform transition-transform group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </Link>
  </motion.div>
);

export const ValidationSection = () => {
  // Find matching benefits for charts
  const productivityChart = validationData.charts.find(c => c.title.includes("Productivity"));
  const adoptionChart = validationData.charts.find(c => c.title.includes("Adoption"));
  
  const productivityBenefit = validationData.benefits.find(b => b.headline.includes("Productivity"));
  const adoptionBenefit = validationData.benefits.find(b => b.headline.includes("Level the Playing Field"));
  
  // Filter out benefits that are combined with charts
  const regularBenefits = validationData.benefits.filter(
    b => b !== productivityBenefit && b !== adoptionBenefit
  );

  return (
    <section className="py-16 bg-gradient-to-br from-background via-background/90 to-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="max-w-6xl mx-auto"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-4xl font-sans font-bold text-center mb-4"
          >
            {validationData.title}
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="text-lg font-sans text-muted-foreground text-center mb-12 max-w-3xl mx-auto"
          >
            {validationData.introduction}
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
            {/* Combined chart + text cards */}
            <CombinedCard 
              benefit={productivityBenefit} 
              chart={productivityChart}
            />
            <CombinedCard 
              benefit={adoptionBenefit} 
              chart={adoptionChart}
            />
            
            {/* Regular benefit cards */}
            {regularBenefits.map((benefit, index) => (
              <RegularCard key={`benefit-${index}`} benefit={benefit} />
            ))}
          </div>

          {/* <motion.div
            variants={itemVariants}
            className="mt-12 text-center"
          >
            <p className="text-2xl font-sans font-medium">
              {validationData.call_to_action}
            </p>
          </motion.div> */}
        </motion.div>
      </div>
    </section>
  );
}; 