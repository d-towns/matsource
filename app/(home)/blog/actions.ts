'use server'
import { createClient } from '@/utils/supabase/server'
import { Blog, BlogSchema } from '@/lib/models/blog'
import { notFound } from 'next/navigation'

export async function getPostBySlug(slug: string): Promise<Blog> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) {
      console.error('Error fetching blog post:', error);
      notFound();
    }
    
    // Validate the data against our schema
    const parsedData = BlogSchema.parse(data);
    return parsedData;
  } catch (error) {
    console.error('Error in getPostBySlug:', error);
    notFound();
  }
}

export async function getAllPosts(): Promise<Blog[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching all blog posts:', error);
      throw new Error(error.message);
    }
    console.log(data);
    // Validate all posts
    return data.map(post => BlogSchema.parse(post));
  } catch (error) {
    console.error('Error in getAllPosts:', error);
    return [];
  }
}

export async function getRelatedPosts(currentSlug: string, limit: number = 3): Promise<Blog[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .neq('slug', currentSlug)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching related posts:', error);
      return [];
    }
    
    return data.map(post => BlogSchema.parse(post));
  } catch (error) {
    console.error('Error in getRelatedPosts:', error);
    return [];
  }
}