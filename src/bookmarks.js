export function getBookmarkBarFromTree(tree) {
  if (!Array.isArray(tree) || !tree[0] || !Array.isArray(tree[0].children)) {
    return null;
  }

  return tree[0].children[0] || null;
}

export function isAllowedBookmarkUrl(url) {
  if (typeof url !== "string") {
    return false;
  }

  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch {
    return false;
  }
}

export function getTopLevelBookmarkBarUrls(bookmarkBarNode) {
  if (!bookmarkBarNode || !Array.isArray(bookmarkBarNode.children)) {
    return [];
  }

  return bookmarkBarNode.children
    .filter((node) => isAllowedBookmarkUrl(node.url))
    .map((node) => ({
      id: node.id,
      title: node.title || node.url,
      url: node.url
    }));
}

export function getTopLevelBookmarkBarFolders(bookmarkBarNode) {
  if (!bookmarkBarNode || !Array.isArray(bookmarkBarNode.children)) {
    return [];
  }

  return bookmarkBarNode.children
    .filter((node) => !node.url && Array.isArray(node.children))
    .map((node) => ({
      id: node.id,
      title: node.title || "Untitled Folder",
      children: node.children
    }));
}

export function collectAllowedBookmarkUrls(node) {
  if (!node) {
    return [];
  }

  if (isAllowedBookmarkUrl(node.url)) {
    return [node.url];
  }

  if (!Array.isArray(node.children)) {
    return [];
  }

  return node.children.flatMap((child) => collectAllowedBookmarkUrls(child));
}

export function getBookmarkUrlByOneBasedIndex(bookmarkBarNode, index) {
  if (!Number.isInteger(index) || index < 1 || index > 10) {
    return null;
  }

  const bookmarks = getTopLevelBookmarkBarUrls(bookmarkBarNode);
  return bookmarks[index - 1]?.url || null;
}

export function getFolderUrlsByOneBasedIndex(bookmarkBarNode, index) {
  if (!Number.isInteger(index) || index < 1 || index > 10) {
    return [];
  }

  const folder = getTopLevelBookmarkBarFolders(bookmarkBarNode)[index - 1];
  return collectAllowedBookmarkUrls(folder);
}

export function getBookmarkCommandIndex(command) {
  const match = /^open-bookmark-(0[1-9]|10)$/.exec(command);
  return match ? Number(match[1]) : null;
}

export function getFolderCommandIndex(command) {
  const match = /^open-folder-(0[1-9]|10)$/.exec(command);
  return match ? Number(match[1]) : null;
}
