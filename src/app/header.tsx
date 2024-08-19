import { Button, buttonVariants } from "@/components/ui/button";
import {
  OrganizationSwitcher,
  SignedIn,
  SignedOut,
  SignIn,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Header() {
  return (
    <div className="border-b bg-gray-50 absolute inset-x-0 top-0 z-50">
      <div className="container mx-auto flex justify-between py-4 items-center">
        <Link href="/" className="flex gap-2 items-center text-xl">
          <Image src="/logo.png" width="40" height="40" alt="logo" />
          FileDrive
        </Link>
        <SignedIn>
          <Link
            href="/dashboard/files"
            className={buttonVariants({ variant: "outline" })}
          >
            Your Files
          </Link>
        </SignedIn>
        <div className="flex gap-2">
          <OrganizationSwitcher />

          <UserButton />

          <SignedOut>
            <SignInButton mode="modal">
              <Button>SignIn</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </div>
  );
}
