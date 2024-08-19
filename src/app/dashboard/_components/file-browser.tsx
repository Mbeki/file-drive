"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";

import Image from "next/image";
import {
  FileIcon,
  GridIcon,
  Loader2,
  RowsIcon,
  StarIcon,
  TableIcon,
} from "lucide-react";

import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";

import { api } from "../../../../convex/_generated/api";
import SearchBar from "./search-bar";
import UploadButton from "./upload-button";
import FileCard from "./file-card";
import { DataTable } from "./file-table";
import { columns } from "./columns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Doc } from "../../../../convex/_generated/dataModel";
import { Label } from "@/components/ui/label";

function Placeholder({ comment }: { comment: string }) {
  return (
    <div className="flex flex-col gap-8 w-full items-center mt-24">
      <Image
        alt="an image of a picture and directory icon"
        width="300"
        height="300"
        src="/empty.svg"
      />
      <div className="text-2xl">{comment}</div>
      <UploadButton />
    </div>
  );
}

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
  const [type, setType] = useState<Doc<"files">["type"] | "all">("all");

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
    orgId
      ? {
          orgId,
          type: type === "all" ? undefined : type,
          query,
          favorites: favoritesOnly,
          deletedOnly,
        }
      : "skip"
  );
  console.log(type);

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
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold">{title}</h1>
            <SearchBar setQuery={setQuery} query={query} />
            <UploadButton />
          </div>
          <Tabs defaultValue="grid">
            <div className="flex justify-between items-center">
              <TabsList className="mb-8">
                <TabsTrigger value="grid" className="flex gap-2 items-center">
                  <GridIcon />
                  Grid
                </TabsTrigger>
                <TabsTrigger value="table" className="flex gap-2 items-center">
                  <RowsIcon />
                  Table
                </TabsTrigger>
              </TabsList>
              <div className="flex gap-2 items-center mb-8">
                <Label htmlFor="type-select">Type Filter</Label>
                <Select
                  value={type}
                  onValueChange={(newType) => {
                    setType(newType as any);
                  }}
                >
                  <SelectTrigger id="type-select" className="w-[100px]">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {isLoading && (
              <div className="flex flex-col items-center justify-center mt-24 gap-8 text-slate-700">
                <Loader2 className=" h-32 w-32 animate-spin" />
                Loading your files...
              </div>
            )}
            <TabsContent value="grid">
              {!isLoading && files.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {modifiedFiles?.map((file) => {
                    return <FileCard key={file._id} file={file} />;
                  })}
                </div>
              )}
            </TabsContent>
            <TabsContent value="table">
              <DataTable columns={columns} data={modifiedFiles} />
            </TabsContent>
          </Tabs>

          {!isLoading && !query && files.length === 0 && (
            <Placeholder comment="You have no files, go ahead and upload one now" />
          )}
          {!isLoading && query && files.length === 0 && (
            <Placeholder comment="No files match your search" />
          )}
        </div>
      </div>
    </>
  );
}
