import {
  getBookmarkCommandIndex,
  getBookmarkBarFromTree,
  getBookmarkUrlByOneBasedIndex,
  getFolderCommandIndex,
  getFolderUrlsByOneBasedIndex
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

async function openUrlsInNewTabs(urls) {
  for (const url of urls) {
    await chrome.tabs.create({ url });
  }
}

export async function openBookmarkForCommand(command) {
  const index = getBookmarkCommandIndex(command);
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

export async function openFolderForCommand(command) {
  const index = getFolderCommandIndex(command);
  if (!index) {
    return false;
  }

  const bookmarkBar = await getBookmarkBar();
  const urls = getFolderUrlsByOneBasedIndex(bookmarkBar, index);
  if (urls.length === 0) {
    return false;
  }

  await openUrlsInNewTabs(urls);
  return true;
}

chrome.commands.onCommand.addListener((command) => {
  const handler = command.startsWith("open-folder-") ? openFolderForCommand : openBookmarkForCommand;
  handler(command).catch((error) => {
    console.error(`Failed to handle ${command}`, error);
  });
});
