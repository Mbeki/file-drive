import React, { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Doc, Id } from "../../../../convex/_generated/dataModel";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { FileTextIcon, ImageIcon, TextIcon } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

import Image from "next/image";

import { formatRelative } from "date-fns";
import FileCardActions from "./file-actions";

export default function FileCard({
  file,
}: {
  file: Doc<"files"> & { isFavorited: boolean };
}) {
  const userProfile = useQuery(api.users.getUserProfile, {
    userId: file.userId,
  });
  console.log(userProfile);
  const typeIcons = {
    image: <ImageIcon />,
    pdf: <FileTextIcon />,
    csv: <TextIcon />,
  } as Record<Doc<"files">["type"], ReactNode>;

  const fileUrl = useQuery(api.files.getImageUrl, {
    fileId: file.fileId,
    type: file.type,
  });

  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle className="flex gap-2 items-center text-base font-normal">
          <div className=" flex justify-center">{typeIcons[file.type]}</div>
          {file.name}
        </CardTitle>
        <div className="absolute right-2 top-3">
          <FileCardActions file={file}  />
        </div>
        {/* <CardDescription>Card Description</CardDescription> */}
      </CardHeader>
      <CardContent className="h-[200px] flex items-center justify-center">
        {file.type == "csv" && <TextIcon className="h-20 w-20" />}
        {file.type == "pdf" && <FileTextIcon className="h-20 w-20" />}
        {file.type == "image" && fileUrl && (
          <Image alt={file.name} src={fileUrl} width="208" height="208" />
        )}
      </CardContent>
      <CardFooter className="flex  justify-between items-center">
        <div className="flex  gap-2 text-xs text-gray-700 items-center w-40">
          <Avatar className="w-6 h-6 ">
            <AvatarImage src={userProfile?.image} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          {userProfile?.name}
        </div>
        <div className="text-xs text-gray-700">
          Uploaded {formatRelative(new Date(file._creationTime), new Date())}
        </div>
      </CardFooter>
    </Card>
  );
}
