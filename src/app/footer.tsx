import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <div className="h-40 bg-gray-100 mt-12 flex items-center">
      <div className="container mx-auto flex justify-between items-center">
        <div>FileDrive</div>
        <Link className="text-blue-400 hover:text-blue-500" href="/policy">
          Privacy Policy
        </Link>
        <Link
          className="text-blue-400 hover:text-blue-500"
          href="/terms-of-service"
        >
          Terms of service
        </Link>
        <Link className="text-blue-400 hover:text-blue-500" href="/about">
          About
        </Link>
      </div>
    </div>
  );
}
