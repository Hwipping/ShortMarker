import { readFile } from "node:fs/promises";

const manifest = JSON.parse(await readFile(new URL("../manifest.json", import.meta.url), "utf8"));

if (manifest.manifest_version !== 3) {
  throw new Error("manifest_version must be 3");
}

if (!manifest.permissions.includes("bookmarks")) {
  throw new Error("bookmarks permission is required");
}

if (manifest.permissions.includes("tabs")) {
  throw new Error("tabs permission must not be requested because this extension does not need sensitive tab metadata");
}

for (let index = 1; index <= 9; index += 1) {
  const command = manifest.commands[`open-bookmark-${index}`];
  if (!command) {
    throw new Error(`Missing open-bookmark-${index}`);
  }

  if (command.suggested_key) {
    throw new Error(
      `open-bookmark-${index} must not declare a default shortcut because Chrome rejects reserved Cmd/Ctrl number shortcuts during extension load`
    );
  }
}

console.log("Extension manifest looks valid.");
