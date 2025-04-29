import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import React from "react";

type SacramentsLayoutProps = {
  children: React.ReactNode;
};

export default function SacramentsLayout({ children }: SacramentsLayoutProps) {
  return (
    <div className="h-full flex flex-col justify-between">
      <Breadcrumbs />
      <div className="h-full overflow-x-hidden overflow-y-auto">{children}</div>
    </div>
  );
}
