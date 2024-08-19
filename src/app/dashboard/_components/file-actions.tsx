import React, { useState } from "react";

import { Doc } from "../../../../convex/_generated/dataModel";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
} from "@/components/ui/alert-dialog";

import {
  FileIcon,
  MoreVertical,
  StarIcon,
  TrashIcon,
  UndoIcon,
} from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";

import { cn } from "@/lib/utils";
import { Protect } from "@clerk/nextjs";

export default function FileCardActions({
  file,
}: {
  file: Doc<"files"> & { isFavorited: boolean };
}) {
  const deleteFile = useMutation(api.files.deleteFile);
  const restoreFile = useMutation(api.files.restoreFile);
  const toggleFavorite = useMutation(api.files.toggleFavorite);
  const me = useQuery(api.users.getMe);

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
              className={cn("w-4 h-4", { "text-red-500": file.isFavorited })}
            />{" "}
            {file.isFavorited ? "Unfavorite" : "Favorite"}
          </DropdownMenuItem>

          <Protect
            condition={(check) => {
              return (
                check({
                  role: "org:admin",
                }) || file.userId === me?._id
              );
            }}
            fallback={<></>}
          >
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
