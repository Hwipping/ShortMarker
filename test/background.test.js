import assert from "node:assert/strict";
import test from "node:test";

const calls = [];
const storedValues = {
  customUrl: "https://custom.example"
};

globalThis.chrome = {
  bookmarks: {
    async getTree() {
      return [
        {
          id: "0",
          children: [
            {
              id: "1",
              children: [
                { id: "10", title: "First", url: "https://first.example" },
                { id: "11", title: "Folder", children: [] },
                { id: "13", title: "Bookmarklet", url: "javascript:alert(1)" },
                { id: "12", title: "Second", url: "https://second.example" },
                { id: "14", title: "Third", url: "https://third.example" },
                { id: "15", title: "Fourth", url: "https://fourth.example" },
                { id: "16", title: "Fifth", url: "https://fifth.example" },
                { id: "17", title: "Sixth", url: "https://sixth.example" },
                { id: "18", title: "Seventh", url: "https://seventh.example" },
                { id: "19", title: "Eighth", url: "https://eighth.example" },
                { id: "20", title: "Ninth", url: "https://ninth.example" },
                { id: "21", title: "Tenth", url: "https://tenth.example" }
              ]
            }
          ]
        }
      ];
    }
  },
  commands: {
    onCommand: {
      addListener(listener) {
        calls.push(["addListener", typeof listener]);
      }
    }
  },
  storage: {
    sync: {
      async get(defaults) {
        calls.push(["storage.get", defaults]);
        return { ...defaults, ...storedValues };
      }
    }
  },
  tabs: {
    async query(queryInfo) {
      calls.push(["query", queryInfo]);
      return [{ id: 42 }];
    },
    async update(tabId, updateInfo) {
      calls.push(["update", tabId, updateInfo]);
    },
    async create(createInfo) {
      calls.push(["create", createInfo]);
    }
  }
};

const { openBookmarkForCommand } = await import("../src/background.js");

test("registers a command listener on load", () => {
  assert.deepEqual(calls[0], ["addListener", "function"]);
});

test("opens the bookmark matching the command number", async () => {
  calls.length = 0;

  const handled = await openBookmarkForCommand("open-bookmark-2");

  assert.equal(handled, true);
  assert.deepEqual(calls, [
    ["query", { active: true, currentWindow: true }],
    ["update", 42, { url: "https://second.example" }]
  ]);
});

test("opens the tenth bookmark for the tenth bookmark command", async () => {
  calls.length = 0;

  const handled = await openBookmarkForCommand("open-bookmark-10");

  assert.equal(handled, true);
  assert.deepEqual(calls, [
    ["query", { active: true, currentWindow: true }],
    ["update", 42, { url: "https://tenth.example" }]
  ]);
});

test("opens the saved custom URL for the custom command", async () => {
  calls.length = 0;
  storedValues.customUrl = "https://custom.example";

  const handled = await openBookmarkForCommand("open-custom-url");

  assert.equal(handled, true);
  assert.deepEqual(calls, [
    ["storage.get", { customUrl: "" }],
    ["query", { active: true, currentWindow: true }],
    ["update", 42, { url: "https://custom.example" }]
  ]);
});

test("ignores invalid saved custom URLs", async () => {
  calls.length = 0;
  storedValues.customUrl = "javascript:alert(1)";

  const handled = await openBookmarkForCommand("open-custom-url");

  assert.equal(handled, false);
  assert.deepEqual(calls, [["storage.get", { customUrl: "" }]]);
});

test("ignores unknown or empty bookmark commands", async () => {
  calls.length = 0;

  assert.equal(await openBookmarkForCommand("open-bookmark-11"), false);
  assert.equal(await openBookmarkForCommand("not-a-command"), false);
  assert.deepEqual(calls, []);
});
