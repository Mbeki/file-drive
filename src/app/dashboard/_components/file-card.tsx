import React, { ReactNode, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  FileIcon,
  FileTextIcon,
  GanttChartIcon,
  ImageIcon,
  MoreVertical,
  StarIcon,
  TextIcon,
  TrashIcon,
  UndoIcon,
} from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Protect } from "@clerk/nextjs";
import { format, formatDistance, formatRelative, subDays } from "date-fns";

function FileCardActions({
  file,
  isFavorited,
}: {
  file: Doc<"files">;
  isFavorited: boolean;
}) {
  const deleteFile = useMutation(api.files.deleteFile);
  const restoreFile = useMutation(api.files.restoreFile);
  const toggleFavorite = useMutation(api.files.toggleFavorite);

  const { toast } = useToast();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const fileUrl = useQuery(api.files.getImageUrl, {
    fileId: file.fileId,
    type: file.type,
  });

  return (
    <>
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        {/* <AlertDialogTrigger>Open</AlertDialogTrigger> */}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This file will be marked for the deletion process. Files are
              deleted periodically.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                try {
                  deleteFile({ fileId: file._id });
                  toast({
                    title: "File marked for deletion",
                    description: "Your file will be deleted soon",
                  });
                } catch (err) {
                  toast({
                    variant: "destructive",
                    title: "Something went wrong",
                    description: "File not deleted",
                  });
                }
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            className="flex gap-1  items-center cursor-pointer"
            onClick={() => {
              // open a new tab to the file location on convex
              if (fileUrl) window.open(fileUrl, "_blank");
            }}
          >
            <FileIcon className="w-4 h-4" />
            Download
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex gap-1  items-center cursor-pointer"
            onClick={() => {
              toggleFavorite({ fileId: file._id });
            }}
          >
            <StarIcon
              className={cn("w-4 h-4", { "text-red-500": isFavorited })}
            />{" "}
            {isFavorited ? "Unfavorite" : "Favorite"}
          </DropdownMenuItem>

          <Protect role="org:admin" fallback={<></>}>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                file.shouldDelete
                  ? restoreFile({ fileId: file._id })
                  : setIsConfirmOpen(true);
              }}
            >
              {file.shouldDelete ? (
                <div className="flex gap-1 text-green-600 items-center cursor-pointer">
                  <UndoIcon className="w-4 h-4" /> Restore
                </div>
              ) : (
                <div className="flex gap-1 text-red-600 items-center cursor-pointer">
                  <TrashIcon className="w-4 h-4" /> Delete
                </div>
              )}
            </DropdownMenuItem>
          </Protect>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
function getFileUrl(fileId: Id<"_storage">): string {
  console.log(`${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${fileId}`);
  return `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${fileId}`;
}

export default function FileCard({
  file,
  favorites,
}: {
  file: Doc<"files">;
  favorites: Doc<"favorites">[];
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

  const isFavorited = favorites.some(
    (favorite) => favorite.fileId === file._id
  );
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
          <FileCardActions file={file} isFavorited={isFavorited} />
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
