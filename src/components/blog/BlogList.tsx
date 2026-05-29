"use client";

import { useState, useMemo, useCallback } from 'react';
import { BlogFilters } from "@/components/blog/BlogFilters";
import { BlogCard } from "@/components/blog/BlogCard";
import { BlogModal } from "@/components/blog/BlogModal";
import { BlogPost } from "@/lib/blog-data";
import { StaggerContainer, StaggerItem } from "@/components/animations";

interface BlogListProps {
  posts: BlogPost[];
  categories: string[];
  className?: string;
}

export function BlogList({ posts, categories, className, ...props }: BlogListProps & any) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handlePostClick = useCallback((post: BlogPost) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedPost(null), 300);
  }, []);

  // Filter posts based on search and category
  const filteredPosts = useMemo(() => {
    return posts.filter((post: BlogPost) => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            post.summary.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [posts, searchQuery, selectedCategory]);

  return (
    <>
      <section id="latest-posts" className={`py-16 md:py-24 bg-secondary relative overflow-hidden ${className || ""}`} aria-labelledby="blog-list-title" {...props}>
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 lg:px-12 relative z-10">
          <BlogFilters 
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            onSearchChange={setSearchQuery}
          />
          
          <StaggerContainer
            staggerDelay={0.1}
            className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20"
          >
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post: BlogPost, postIndex: number) => (
                <StaggerItem key={post.id}>
                  <BlogCard post={post} onClick={handlePostClick} priority={postIndex < 6} />
                </StaggerItem>
              ))
            ) : (
              <div className="col-span-full py-20 text-center space-y-4">
                <div className="text-6xl opacity-50">📂</div>
                <h3 className="text-2xl font-serif font-bold text-foreground">No articles found</h3>
                <p className="text-muted-foreground max-w-md mx-auto font-sans">
                  We couldn&apos;t find any articles matching your criteria. Try adjusting your search or switching categories.
                </p>
              </div>
            )}
          </StaggerContainer>
        </div>

        {/* Blog Modal */}
        <BlogModal 
          post={selectedPost} 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
        />
      </section>
    </>
  );
}
