import { Button } from "@/components/ui/button";
import {
  OrganizationSwitcher,
  SignedIn,
  SignedOut,
  SignIn,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import React from "react";

export default function Header() {
  return (
    <div className="border-b bg-gray-50">
      <div className="container mx-auto flex justify-between py-4 items-center">
        <div className="">FileDrive</div>
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
