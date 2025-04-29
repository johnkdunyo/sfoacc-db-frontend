"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import placesofworshipData from "../_components/placesofworship.json";
import { IPlaceofworship } from "../_components/placesofworship-table";
import UpdatePlaceOfWorshipModal from "../_components/update-placeofworship-modal";
import { MapPin, Calendar, Clock, Building, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function PlaceOfWorshipDetails() {
  const params = useParams();
  const slug = params?.placeofworship as string;
  const id = parseInt(slug.split("-")[0]);

  const placeofworship = placesofworshipData.placesofworship.find(
    (s) => s.id === id
  ) as IPlaceofworship;

  if (!placeofworship) {
    return (
      <div className="text-center py-8">
        <Badge variant="destructive">Place of worship not found</Badge>
      </div>
    );
  }

  const handlePlaceofWorshipUpdated = () => {
    console.log("Place of worship updated - refresh data");
  };

  return (
    <div className="pt-0 space-y-6 max-w-6xl mx-auto">
      <Card className="mt-6 shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <CardTitle className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                <Building className="w-8 h-8 text-primary" />
                {placeofworship.name}
              </CardTitle>
              <div className="text-sm text-muted-foreground">
                Last updated: {formatDate(placeofworship.updated_at)}
              </div>
            </div>
            <UpdatePlaceOfWorshipModal
              onPlaceOfWorshipUpdated={handlePlaceofWorshipUpdated}
              oldPlaceOfWorshipData={placeofworship}
            />
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              About
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {placeofworship.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Address
              </h4>
              <p className="text-muted-foreground text-sm">
                {placeofworship.address}
              </p>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location
              </h4>
              <p className="text-muted-foreground text-sm">
                {placeofworship.location}
              </p>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Mass Schedule
              </h4>
              <p className="text-muted-foreground text-sm">
                {placeofworship.mass_schedule}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Created</h4>
              <Badge variant="secondary">
                {formatDate(placeofworship.created_at)}
              </Badge>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Last Updated</h4>
              <Badge variant="secondary">
                {formatDate(placeofworship.updated_at)}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
