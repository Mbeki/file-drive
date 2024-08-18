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
    <div className="border-b bg-gray-50">
      <div className="container mx-auto flex justify-between py-4 items-center">
        <Link href="/" className="flex gap-2 items-center text-xl">
          <Image src="/logo.png" width="40" height="40" alt="logo" />
          FileDrive
        </Link>
        <Link
          href="/dashboard/files"
          className={buttonVariants({ variant: "outline" })}
        >
          Your Files
        </Link>
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
