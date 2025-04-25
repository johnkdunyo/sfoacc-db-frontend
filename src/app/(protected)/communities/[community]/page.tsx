import React from "react";
import CommunityDetails from "./community-details";
import { metaObject } from "@/config/site.config";

export const metadata = {
  ...metaObject("Communities "),
};

function page() {
  return (
    <>
      <CommunityDetails />
    </>
  );
}

export default page;
