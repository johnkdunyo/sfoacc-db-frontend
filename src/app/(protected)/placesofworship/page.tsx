import React from "react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { metaObject } from "@/config/site.config";
import PlacesOfWorshipGrid from "./_components/placesofworship-table";

export const metadata = {
  ...metaObject("Placesofworship | Home"),
};

export default function Placesofworship() {
  return <PlacesOfWorshipGrid />;
}
