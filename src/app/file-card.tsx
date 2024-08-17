import React, { ReactNode, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Doc, Id } from "../../convex/_generated/dataModel";
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
import {
  FileTextIcon,
  GanttChartIcon,
  ImageIcon,
  MoreVertical,
  TextIcon,
  TrashIcon,
} from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";

function FileCardActions({ file }: { file: Doc<"files"> }) {
  const deleteFile = useMutation(api.files.deleteFile);
  const { toast } = useToast();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  return (
    <>
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        {/* <AlertDialogTrigger>Open</AlertDialogTrigger> */}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                try {
                  deleteFile({ fileId: file._id });
                  toast({
                    title: "File deleted",
                    description: "Your file is now gone from the system",
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
            className="flex gap-1 text-red-600 items-center cursor-pointer"
            onClick={() => setIsConfirmOpen(true)}
          >
            <TrashIcon className="w-4 h-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
function getFileUrl(fileId: Id<"_storage">): string {
  console.log(`${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${fileId}`);
  return `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${fileId}`;
}

export default function FileCard({ file }: { file: Doc<"files"> }) {
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
        <CardTitle className="flex gap-2 items-center">
          <div className=" ">{typeIcons[file.type]}</div>
          {file.name}
        </CardTitle>
        <div className="absolute right-2 top-3">
          <FileCardActions file={file} />
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
      <CardFooter className="flex justify-center">
        <Button
          onClick={() => {
            // open a new tab to the file location on convex
            if (fileUrl) window.open(fileUrl, "_blank");
          }}
        >
          Download
        </Button>
      </CardFooter>
    </Card>
  );
}
