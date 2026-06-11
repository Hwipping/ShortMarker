import { readFile } from "node:fs/promises";

const manifest = JSON.parse(await readFile(new URL("../manifest.json", import.meta.url), "utf8"));

if (manifest.manifest_version !== 3) {
  throw new Error("manifest_version must be 3");
}

if (!manifest.permissions.includes("bookmarks")) {
  throw new Error("bookmarks permission is required");
}

if (manifest.permissions.includes("storage")) {
  throw new Error("storage permission must not be requested because custom URL support was removed");
}

if (manifest.permissions.includes("tabs")) {
  throw new Error("tabs permission must not be requested because this extension does not need sensitive tab metadata");
}

if (manifest.options_ui) {
  throw new Error("options_ui must not be declared because custom URL support was removed");
}

if (manifest.commands["open-custom-url"]) {
  throw new Error("open-custom-url command must not be declared");
}

for (let index = 1; index <= 10; index += 1) {
  const commandIndex = String(index).padStart(2, "0");
  const bookmarkCommand = manifest.commands[`open-bookmark-${commandIndex}`];
  if (!bookmarkCommand) {
    throw new Error(`Missing open-bookmark-${commandIndex}`);
  }

  if (bookmarkCommand.description !== `Open Bookmark Bar URL ${index}`) {
    throw new Error(`Unexpected description for open-bookmark-${commandIndex}`);
  }

  if (bookmarkCommand.suggested_key) {
    throw new Error(
      `open-bookmark-${commandIndex} must not declare a default shortcut because Chrome rejects reserved Cmd/Ctrl number shortcuts during extension load`
    );
  }

  const folderCommand = manifest.commands[`open-folder-${commandIndex}`];
  if (!folderCommand) {
    throw new Error(`Missing open-folder-${commandIndex}`);
  }

  if (folderCommand.description !== `Open Bookmark Bar Folder ${index}`) {
    throw new Error(`Unexpected description for open-folder-${commandIndex}`);
  }

  if (folderCommand.suggested_key) {
    throw new Error(
      `open-folder-${commandIndex} must not declare a default shortcut because Chrome rejects reserved Cmd/Ctrl number shortcuts during extension load`
    );
  }
}

console.log("Extension manifest looks valid.");
