import React from "react";
import PlaceOfWorshipDetails from "./placeofworhip-details";
import { metaObject } from "@/config/site.config";

export const metadata = {
  ...metaObject("Placesofworship "),
};

function page() {
  return (
    <>
      <PlaceOfWorshipDetails />
    </>
  );
}

export default page;
