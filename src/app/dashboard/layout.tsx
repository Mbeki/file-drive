import { FileIcon, StarIcon } from "lucide-react";

import { ReactNode } from "react";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import SideNav from "./side-nav";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <main className="container mx-auto pt-12">
      <div className="flex gap-8 ">
        <SideNav />
        <div className="w-full">{children}</div>
      </div>
    </main>
  );
}
