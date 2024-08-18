"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";

import Image from "next/image";
import { FileIcon, Loader2, StarIcon } from "lucide-react";

import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { api } from "../../../../convex/_generated/api";
import SearchBar from "./search-bar";
import UploadButton from "./upload-button";
import FileCard from "./file-card";

export default function FileBrowser({
  title,
  favorites,
}: {
  title: string;
  favorites?: boolean;
}) {
  const organization = useOrganization();
  const user = useUser();
  const [query, setQuery] = useState("");

  let orgId: string | undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization?.organization?.id ?? user.user?.id;
  }

  const files = useQuery(
    api.files.getFiles,
    orgId ? { orgId, query, favorites } : "skip"
  );
  const isLoading = files === undefined;

  return (
    <>
      <div className="w-full">
        {isLoading && (
          <div className="flex flex-col items-center justify-center mt-24 gap-8 text-slate-700">
            <Loader2 className=" h-32 w-32 animate-spin" />
            Loading your images...
          </div>
        )}

        {!isLoading && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h1 className="text-4xl font-bold">{title}</h1>
              <SearchBar setQuery={setQuery} query={query} />
              <UploadButton />
            </div>

            {files.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mb-8">
                {files?.map((file) => {
                  return <FileCard key={file._id} file={file} />;
                })}
              </div>
            )}
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
