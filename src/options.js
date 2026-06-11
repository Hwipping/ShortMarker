import { isAllowedBookmarkUrl } from "./bookmarks.js";

const CUSTOM_URL_STORAGE_KEY = "customUrl";

const form = document.querySelector("#options-form");
const input = document.querySelector("#custom-url");
const status = document.querySelector("#status");

function setStatus(message, isError = false) {
  status.textContent = message;
  status.classList.toggle("error", isError);
}

function normalizeUrl(url) {
  try {
    return new URL(url).href;
  } catch {
    return url;
  }
}

async function loadOptions() {
  const result = await chrome.storage.sync.get({ [CUSTOM_URL_STORAGE_KEY]: "" });
  input.value = result[CUSTOM_URL_STORAGE_KEY];
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const url = normalizeUrl(input.value.trim());
  if (!isAllowedBookmarkUrl(url)) {
    setStatus("Enter a valid http or https URL.", true);
    return;
  }

  await chrome.storage.sync.set({ [CUSTOM_URL_STORAGE_KEY]: url });
  input.value = url;
  setStatus("Saved.");
});

loadOptions().catch((error) => {
  console.error("Failed to load options", error);
  setStatus("Unable to load saved options.", true);
});
