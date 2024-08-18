import React from "react";
import FileBrowser from "../_components/file-browser";

export default function TrashPage() {
  return (
    <div>
      <FileBrowser title="Your Favorites" deletedOnly={true} />
    </div>
  );
}
