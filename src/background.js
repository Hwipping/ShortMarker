import {
  getBookmarkBarFromTree,
  getBookmarkUrlByOneBasedIndex,
  getCommandIndex,
  isAllowedBookmarkUrl
} from "./bookmarks.js";

export const CUSTOM_URL_STORAGE_KEY = "customUrl";
export const OPEN_CUSTOM_URL_COMMAND = "open-custom-url";

async function getBookmarkBar() {
  const tree = await chrome.bookmarks.getTree();
  return getBookmarkBarFromTree(tree);
}

async function getCustomUrl() {
  const result = await chrome.storage.sync.get({ [CUSTOM_URL_STORAGE_KEY]: "" });
  const url = result[CUSTOM_URL_STORAGE_KEY];
  return isAllowedBookmarkUrl(url) ? url : null;
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
  if (command === OPEN_CUSTOM_URL_COMMAND) {
    const customUrl = await getCustomUrl();
    if (!customUrl) {
      return false;
    }

    await navigateActiveTab(customUrl);
    return true;
  }

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
