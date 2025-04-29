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
import placesofworshipData from "./placesofworship.json";
import { Input } from "@/components/ui/input";
import { Search, Loader2, Plus } from "lucide-react";
import Link from "next/link";
import AddPlaceOfWorshipModal from "./add-placeofworship-modal";

export interface IPlaceofworship {
  id: number;
  name: string;
  description?: string;
  location?: string;
  address?: string;
  mass_schedule?: string;
  created_at: string;
  updated_at: string;
}

export function PlaceOfWorshipCard({
  placeofworship,
}: {
  placeofworship: IPlaceofworship;
}) {
  // Create URL-friendly slug from placeofworship name
  const slug = placeofworship.name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

  //  router.push(`/placesofworship/${placeofworship.id}-${slug}`);

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 h-full rounded-xl">
      <CardContent className="p-5 md:p-6 h-full">
        <div className="flex flex-col h-full">
          <div className="flex-grow">
            <h2 className="text-2xl font-bold text-primary mb-3">
              {placeofworship.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {placeofworship.description}
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Link href={`/placesofworship/${placeofworship.id}-${slug}`}>
              <Button className="w-full">View Place of Worhip Details</Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function PlacesOfWorshipGrid() {
  const [searchQuery, setSearchQuery] = useState("");
  const [displayCount, setDisplayCount] = useState(6);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef(null);

  const filteredPlacesOfWorship = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return placesofworshipData.placesofworship.filter(
      (community) =>
        community.name.toLowerCase().includes(query) ||
        (community.description?.toLowerCase() || "").includes(query)
    );
  }, [searchQuery]);

  const displayedPlacesofWorship = useMemo(() => {
    return filteredPlacesOfWorship.slice(0, displayCount);
  }, [filteredPlacesOfWorship, displayCount]);

  const hasMore =
    displayedPlacesofWorship.length < filteredPlacesOfWorship.length;

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

  const onPlaceofworshipAdded = () => {
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
            placeholder="Search places of worship..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            prefixx={<Search className="h-4 w-4" />}
          />
        </div>
        <AddPlaceOfWorshipModal onPlaceOfWorshipAdded={onPlaceofworshipAdded} />
      </div>

      <div className="overflow-auto h-full pr-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedPlacesofWorship.map((placeofworship) => (
            <PlaceOfWorshipCard
              key={placeofworship.id}
              placeofworship={placeofworship}
            />
          ))}
        </div>

        {displayedPlacesofWorship.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No places of worship found matching your search.
          </div>
        )}

        {hasMore && (
          <div ref={loaderRef} className="w-full flex justify-center py-8">
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading more places of worship...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PlacesOfWorshipGrid;
