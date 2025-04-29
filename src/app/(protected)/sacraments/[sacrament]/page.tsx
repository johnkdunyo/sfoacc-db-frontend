import React from "react";
import SacramentDetails from "./sacrament-details";
import { metaObject } from "@/config/site.config";

export const metadata = {
  ...metaObject("Sacraments "),
};

function page() {
  return (
    <>
      <SacramentDetails />
    </>
  );
}

export default page;
