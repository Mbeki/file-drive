"use client";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FileIcon, StarIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function SideNav() {
  const pathname = usePathname();
  console.log(pathname);
  return (
    <div className="w-40 flex flex-col justify-start items-start gap-4">
      <Link
        className={cn("flex gap-2", {
          "text-blue-500": pathname.includes("/dashboard/files"),
        })}
        href="/dashboard/files"
      >
        <FileIcon />
        All Files
      </Link>
      <Link
        className={cn("flex gap-2", {
          "text-blue-500": pathname.includes("/dashboard/favorites"),
        })}
        href="/dashboard/favorites"
      >
        <StarIcon />
        Favorites
      </Link>
    </div>
  );
}
