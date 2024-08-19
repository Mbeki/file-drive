"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";

import Image from "next/image";
import { FileIcon, Loader2, StarIcon } from "lucide-react";

import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";

import { api } from "../../../../convex/_generated/api";
import SearchBar from "./search-bar";
import UploadButton from "./upload-button";
import FileCard from "./file-card";
import { DataTable } from "./file-table";
import { columns } from "./columns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function FileBrowser({
  title,
  favoritesOnly,
  deletedOnly,
}: {
  title: string;
  favoritesOnly?: boolean;
  deletedOnly?: boolean;
}) {
  console.log(title, favoritesOnly);
  const organization = useOrganization();
  const user = useUser();
  const [query, setQuery] = useState("");

  let orgId: string | undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization?.organization?.id ?? user.user?.id;
  }
  const favorites = useQuery(
    api.files.getAllFavorites,
    orgId ? { orgId } : "skip"
  );

  const files = useQuery(
    api.files.getFiles,
    orgId ? { orgId, query, favorites: favoritesOnly, deletedOnly } : "skip"
  );
  console.log(files);
  const isLoading = files === undefined;

  const modifiedFiles =
    files?.map((file) => ({
      ...file,
      isFavorited: (favorites ?? []).some(
        (favorite) => favorite.fileId === file._id
      ),
    })) ?? [];

  return (
    <>
      <div className="w-full">
        {isLoading && (
          <div className="flex flex-col items-center justify-center mt-24 gap-8 text-slate-700">
            <Loader2 className=" h-32 w-32 animate-spin" />
            Loading your files...
          </div>
        )}

        {!isLoading && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h1 className="text-4xl font-bold">{title}</h1>
              <SearchBar setQuery={setQuery} query={query} />
              <UploadButton />
            </div>

            {!query && files.length === 0 && (
              <div className="flex flex-col items-center justify-center mt-24 gap-8">
                <Image
                  alt="picture and directory icon"
                  width={300}
                  height={300}
                  src="/empty.svg"
                />{" "}
                <div className="text-2xl">
                  You have no files, go ahead and upload one now
                </div>
                <UploadButton />
              </div>
            )}
            {query && files.length === 0 && (
              <div className="flex flex-col items-center justify-center mt-24 gap-8">
                <Image
                  alt="picture and directory icon"
                  width={300}
                  height={300}
                  src="/empty.svg"
                />{" "}
                <div className="text-2xl">No files match your search</div>
                <UploadButton />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
