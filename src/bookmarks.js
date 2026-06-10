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

export function getBookmarkUrlByOneBasedIndex(bookmarkBarNode, index) {
  if (!Number.isInteger(index) || index < 1 || index > 9) {
    return null;
  }

  const bookmarks = getTopLevelBookmarkBarUrls(bookmarkBarNode);
  return bookmarks[index - 1]?.url || null;
}

export function getCommandIndex(command) {
  const match = /^open-bookmark-([1-9])$/.exec(command);
  return match ? Number(match[1]) : null;
}
