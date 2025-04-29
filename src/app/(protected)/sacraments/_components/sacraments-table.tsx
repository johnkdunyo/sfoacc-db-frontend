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
import sacramentsData from "./sacraments.json";
import { Input } from "@/components/ui/input";
import { Search, Loader2, Plus } from "lucide-react";
import Link from "next/link";
import AddSacramentModal from "./add-sacrament-modal";

export interface ISacrament {
  id: number;
  name: string;
  description?: string;
  once_only?: boolean;
}

export function SacramentCard({ sacrament }: { sacrament: ISacrament }) {
  // Create URL-friendly slug from sacrament name
  const slug = sacrament.name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

  //  router.push(`/placesofworship/${sacrament.id}-${slug}`);

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 h-full rounded-xl">
      <CardContent className="p-5 md:p-6 h-full">
        <div className="flex flex-col h-full">
          <div className="flex-grow">
            <h2 className="text-2xl font-bold text-primary mb-3">
              {sacrament.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {sacrament.description}
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Link href={`/sacraments/${sacrament.id}-${slug}`}>
              <Button className="w-full">View Sacrament Details</Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function SacramentsGrid() {
  const [searchQuery, setSearchQuery] = useState("");
  const [displayCount, setDisplayCount] = useState(6);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef(null);

  const filteredSacraments = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return sacramentsData.sacraments.filter(
      (sacrament) =>
        sacrament.name.toLowerCase().includes(query) ||
        (sacrament.description?.toLowerCase() || "").includes(query)
    );
  }, [searchQuery]);

  const displayedSacraments = useMemo(() => {
    return filteredSacraments.slice(0, displayCount);
  }, [filteredSacraments, displayCount]);

  const hasMore = displayedSacraments.length < filteredSacraments.length;

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

  const onSacramentAdded = () => {
    console.log("triggered");
  };

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
            placeholder="Search sacraments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            prefixx={<Search className="h-4 w-4" />}
          />
        </div>
        <AddSacramentModal onSacramentAdded={onSacramentAdded} />
      </div>

      <div className="overflow-auto h-full pr-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedSacraments.map((sacrament) => (
            <SacramentCard key={sacrament.id} sacrament={sacrament} />
          ))}
        </div>

        {displayedSacraments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No sacraments found matching your search.
          </div>
        )}

        {hasMore && (
          <div ref={loaderRef} className="w-full flex justify-center py-8">
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading more sacraments...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SacramentsGrid;
