import React from "react";
import FileBrowser from "../_components/file-browser";

export default function FavoritesPage() {
  return (
    <div>
      <FileBrowser title="Your Favorites" favoritesOnly={true} />
    </div>
  );
}
