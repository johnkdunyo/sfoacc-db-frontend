"use client";
import React, {
  useMemo,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import communitiesData from "./communities.json";
import { Input } from "@/components/ui/input";
import { Search, Loader2, Plus } from "lucide-react";
import Link from "next/link";

export interface ICommunity {
  id: number;
  name: string;
  description?: string;
  location?: string;
  created_at: string;
  updated_at: string;
}

export function CommunityCard({ community }: { community: ICommunity }) {
  // Create URL-friendly slug from community name
  const slug = community.name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

  //  router.push(`/communities/${community.id}-${slug}`);

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 h-full rounded-xl">
      <CardContent className="p-5 md:p-6 h-full">
        <div className="flex flex-col h-full">
          <div className="flex-grow">
            <h2 className="text-2xl font-bold text-primary mb-3">
              {community.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {community.description}
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Link href={`/communities/${community.id}-${slug}`}>
              <Button className="w-full">View community Details</Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function CommunitiesGrid() {
  const [searchQuery, setSearchQuery] = useState("");
  const [displayCount, setDisplayCount] = useState(6);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef(null);

  const filteredCommunities = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return communitiesData.communities.filter(
      (community) =>
        community.name.toLowerCase().includes(query) ||
        (community.description?.toLowerCase() || "").includes(query)
    );
  }, [searchQuery]);

  const displayedCommunities = useMemo(() => {
    return filteredCommunities.slice(0, displayCount);
  }, [filteredCommunities, displayCount]);

  const hasMore = displayedCommunities.length < filteredCommunities.length;

  const loadMore = useCallback(() => {
    if (!hasMore || isLoading) return;

    setIsLoading(true);
    // Simulate loading delay
    setTimeout(() => {
      setDisplayCount((prev) => prev + 6);
      setIsLoading(false);
    }, 1000);
  }, [hasMore, isLoading]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  // Reset display count when search query changes
  useEffect(() => {
    setDisplayCount(6);
  }, [searchQuery]);

  return (
    <div className="h-full flex flex-col justify-between gap-4">
      <div className="w-full flex flex-wrap gap-4 justify-between ">
        <div className="w-full md:w-96">
          <Input
            type="search"
            className="pl-9 w-full"
            placeholder="Search communities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            prefixx={<Search className="h-4 w-4" />}
          />
        </div>
        {/* <Button className="">
          <Plus className="h-4 w-4 mr-2" /> Add Community
        </Button> */}
        <AddCommunityModal />
      </div>

      <div className="overflow-auto h-full pr-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedCommunities.map((community) => (
            <CommunityCard key={community.id} community={community} />
          ))}
        </div>

        {displayedCommunities.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No communities found matching your search.
          </div>
        )}

        {hasMore && (
          <div ref={loaderRef} className="w-full flex justify-center py-8">
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading more communities...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CommunitiesGrid;
