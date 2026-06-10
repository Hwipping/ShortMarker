import assert from "node:assert/strict";
import test from "node:test";

const calls = [];

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
                { id: "12", title: "Second", url: "https://second.example" }
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

test("ignores unknown or empty bookmark commands", async () => {
  calls.length = 0;

  assert.equal(await openBookmarkForCommand("open-bookmark-9"), false);
  assert.equal(await openBookmarkForCommand("not-a-command"), false);
  assert.deepEqual(calls, []);
});
