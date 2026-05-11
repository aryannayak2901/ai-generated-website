"use client";

import { useState, useEffect, useMemo } from "react";
import { getLatestVideos, YouTubeVideo, MOCK_VIDEOS } from "@/lib/youtube";
import { MediaHero } from "@/components/media/MediaHero";
import { MediaFilters } from "@/components/media/MediaFilters";
import { MediaCard } from "@/components/media/MediaCard";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { motion, AnimatePresence } from "framer-motion";

export default function MediaPage() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All Videos");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    async function loadVideos() {
      try {
        const data = await getLatestVideos(50);
        setVideos(data);
      } catch (error) {
        console.error("Failed to load videos:", error);
        setVideos(MOCK_VIDEOS);
      } finally {
        setLoading(false);
      }
    }
    loadVideos();
  }, []);

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const categories = useMemo(() => {
    const cats = ["All Videos"];
    const uniqueCats = Array.from(new Set(videos.map((v) => v.category).filter(Boolean)));
    return [...cats, ...uniqueCats as string[]];
  }, [videos]);

  const videoCounts = useMemo(() => {
    const counts: Record<string, number> = { "All Videos": videos.length };
    videos.forEach((v) => {
      if (v.category) {
        counts[v.category] = (counts[v.category] || 0) + 1;
      }
    });
    return counts;
  }, [videos]);

  const filteredVideos = useMemo(() => {
    return videos.filter((video) => {
      const matchesCategory =
        selectedCategory === "All Videos" || video.category === selectedCategory;
      const matchesSearch =
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [videos, selectedCategory, searchQuery]);

  const totalPages = Math.ceil(filteredVideos.length / ITEMS_PER_PAGE);
  const paginatedVideos = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredVideos.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredVideos, currentPage]);

  const featuredVideo = videos[0] || MOCK_VIDEOS[0];

  return (
    <div className="min-h-screen bg-background">
      {loading ? (
        <div className="container mx-auto px-4 py-12 space-y-12">
          <Skeleton className="w-full h-[400px] rounded-sm" />
          <div className="flex gap-4">
             <Skeleton className="w-24 h-8 rounded-full" />
             <Skeleton className="w-24 h-8 rounded-full" />
             <Skeleton className="w-24 h-8 rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="aspect-video w-full rounded-sm" />
            ))}
          </div>
        </div>
      ) : (
        <>
          <MediaHero 
            video={featuredVideo} 
            onWatchNow={(video) => setSelectedVideo(video)} 
          />

          <section className="container mx-auto px-4 py-16 md:py-24">
            <MediaFilters
              categories={categories}
              selectedCategory={selectedCategory}
              onCategorySelect={handleCategorySelect}
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              videoCounts={videoCounts}
            />

            <div className="mt-12">
              {paginatedVideos.length > 0 ? (
                <>
                  <motion.div 
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
                  >
                    <AnimatePresence mode="popLayout">
                      {paginatedVideos.map((video) => (
                        <MediaCard
                          key={video.id}
                          video={video}
                          onClick={(v) => setSelectedVideo(v)}
                        />
                      ))}
                    </AnimatePresence>
                  </motion.div>

                  {totalPages > 1 && (
                    <div className="mt-16 border-t border-slate-100 dark:border-white/5 pt-12">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious 
                              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                              className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                          </PaginationItem>
                          
                          {Array.from({ length: totalPages }).map((_, i) => {
                            const pageNum = i + 1;
                            // Basic pagination logic: show first, last, and pages around current
                            if (
                              pageNum === 1 || 
                              pageNum === totalPages || 
                              (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                            ) {
                              return (
                                <PaginationItem key={pageNum}>
                                  <PaginationLink
                                    isActive={currentPage === pageNum}
                                    onClick={() => setCurrentPage(pageNum)}
                                    className="cursor-pointer"
                                  >
                                    {pageNum}
                                  </PaginationLink>
                                </PaginationItem>
                              );
                            }
                            if (
                              (pageNum === 2 && currentPage > 3) || 
                              (pageNum === totalPages - 1 && currentPage < totalPages - 2)
                            ) {
                              return (
                                <PaginationItem key={pageNum}>
                                  <PaginationEllipsis />
                                </PaginationItem>
                              );
                            }
                            return null;
                          })}

                          <PaginationItem>
                            <PaginationNext 
                              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                              className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20 bg-surface dark:bg-primary/20 rounded-sm border border-dashed border-slate-200 dark:border-white/10"
                >
                  <p className="text-slate-500 dark:text-slate-400 font-medium">
                    No videos found matching your criteria.
                  </p>
                </motion.div>
              )}
            </div>
          </section>
        </>
      )}

      {/* Video Modal */}
      <Dialog open={!!selectedVideo} onOpenChange={(open) => !open && setSelectedVideo(null)}>
        <DialogContent className="max-w-7xl p-0 overflow-hidden bg-background border-none shadow-2xl">
          {selectedVideo && (
            <div className="flex flex-col">
              <div className="relative aspect-video w-full bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1`}
                  title={selectedVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
              <div className="p-6 md:p-8 space-y-4">
                <DialogHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-accent text-primary font-bold uppercase tracking-widest text-[10px] rounded-sm">
                      {selectedVideo.category || "General Legal"}
                    </Badge>
                  </div>
                  <DialogTitle className="font-display text-2xl md:text-3xl font-bold leading-tight">
                    {selectedVideo.title}
                  </DialogTitle>
                </DialogHeader>
                <DialogDescription className="text-slate-600 dark:text-slate-400 text-base leading-relaxed line-clamp-3">
                  {selectedVideo.description}
                </DialogDescription>
                <div className="flex items-center gap-6 pt-2 text-sm text-slate-500 dark:text-slate-400 font-semibold">
                  <span>{new Date(selectedVideo.publishedAt).toLocaleDateString()}</span>
                  <span>{selectedVideo.viewCount} Views</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
