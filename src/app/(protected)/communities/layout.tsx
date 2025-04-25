import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import React from "react";

type CommunitiesLayoutProps = {
  children: React.ReactNode;
};

export default function CommunitiesLayout({ children }: CommunitiesLayoutProps) {
  return (
    <div className="h-full flex flex-col justify-between">
      <Breadcrumbs />
      <div className="h-full overflow-x-hidden overflow-y-auto">{children}</div>
    </div>
  );
}
