"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import communitiesData from "../_components/communities.json";
import { ICommunity } from "../_components/communities-table";
import UpdateCommunityModal from "../_components/update-community-modal";
import { Users, Calendar, Clock, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function CommunityDetails() {
  const params = useParams();
  const slug = params.community as string;
  const id = parseInt(slug.split("-")[0]);

  const community = communitiesData.communities.find(
    (s) => s.id === id
  ) as ICommunity;

  if (!community) {
    return (
      <div className="text-center py-8">
        <Badge variant="destructive">Community not found</Badge>
      </div>
    );
  }

  const handleCommunityUpdated = () => {
    console.log("Community updated - refresh data");
  };

  return (
    <div className="pt-0 space-y-6 max-w-6xl mx-auto">
      <Card className="mt-6 shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <CardTitle className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                <Users className="w-8 h-8 text-primary" />
                {community.name}
              </CardTitle>
              <div className="text-sm text-muted-foreground">
                Last updated: {formatDate(community.updated_at)}
              </div>
            </div>
            <UpdateCommunityModal
              onCommunityUpdated={handleCommunityUpdated}
              oldCommunityData={community}
            />
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Users className="w-5 h-5" />
              About
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {community.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Created
              </h4>
              <Badge variant="secondary" className="text-sm">
                {formatDate(community.created_at)}
              </Badge>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Last Updated
              </h4>
              <Badge variant="secondary" className="text-sm">
                {formatDate(community.updated_at)}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
