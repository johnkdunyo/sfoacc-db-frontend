// SacramentDetails.tsx
"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import sacramentsData from "../_components/sacraments.json";
import { ISacrament } from "../_components/sacraments-table";
import { Checkbox } from "@/components/ui/checkbox";
import UpdateSacramentModal from "../_components/update-sacrament-modal";

export default function SacramentDetails() {
  const params = useParams();
  const slug = params?.sacrament as string;
  const id = parseInt(slug.split("-")[0]);

  const sacrament = sacramentsData.sacraments.find(
    (s) => s.id === id
  ) as unknown as ISacrament;

  if (!sacrament) {
    return <div className="text-center py-8">Place of worship not found.</div>;
  }

  const handleSacramentUpdated = () => {
    // Add logic to refresh data here
    console.log("Sacrament updated - refresh data");
  };

  return (
    <div className="pt-0 space-y-6">
      <Card className="mt-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl md:text-3xl font-bold">
              {sacrament.name}
            </CardTitle>
            <UpdateSacramentModal
              onSacramentUpdated={handleSacramentUpdated}
              oldSacramentData={sacrament}
            />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">About</h3>
            <p className="text-gray-600 dark:text-gray-300">
              {sacrament.description}
            </p>
          </div>

          <div className="grid grid-cols-1 mb-2">
            <div className="flex items-center gap-2">
              <Checkbox id="once-only" checked={sacrament.once_only} disabled />
              <label htmlFor="once-only" className="font-semibold">
                Received Once
              </label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
