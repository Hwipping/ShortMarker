import {
  getBookmarkBarFromTree,
  getBookmarkUrlByOneBasedIndex,
  getCommandIndex
} from "./bookmarks.js";

async function getBookmarkBar() {
  const tree = await chrome.bookmarks.getTree();
  return getBookmarkBarFromTree(tree);
}

async function navigateActiveTab(url) {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const activeTab = tabs[0];

  if (activeTab?.id !== undefined) {
    try {
      await chrome.tabs.update(activeTab.id, { url });
      return;
    } catch (error) {
      console.warn("Unable to navigate the active tab; opening a new tab instead.", error);
    }
  }

  await chrome.tabs.create({ url });
}

export async function openBookmarkForCommand(command) {
  const index = getCommandIndex(command);
  if (!index) {
    return false;
  }

  const bookmarkBar = await getBookmarkBar();
  const url = getBookmarkUrlByOneBasedIndex(bookmarkBar, index);
  if (!url) {
    return false;
  }

  await navigateActiveTab(url);
  return true;
}

chrome.commands.onCommand.addListener((command) => {
  openBookmarkForCommand(command).catch((error) => {
    console.error(`Failed to handle ${command}`, error);
  });
});
