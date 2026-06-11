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
                {
                  id: "11",
                  title: "Folder One",
                  children: [
                    { id: "22", title: "Nested One", url: "https://nested-one.example" },
                    {
                      id: "23",
                      title: "Nested Folder",
                      children: [
                        { id: "24", title: "Deep", url: "https://deep.example" },
                        { id: "25", title: "Blocked", url: "javascript:alert(1)" }
                      ]
                    }
                  ]
                },
                { id: "13", title: "Bookmarklet", url: "javascript:alert(1)" },
                { id: "12", title: "Second", url: "https://second.example" },
                { id: "14", title: "Third", url: "https://third.example" },
                { id: "15", title: "Fourth", url: "https://fourth.example" },
                { id: "16", title: "Fifth", url: "https://fifth.example" },
                { id: "17", title: "Sixth", url: "https://sixth.example" },
                { id: "18", title: "Seventh", url: "https://seventh.example" },
                { id: "19", title: "Eighth", url: "https://eighth.example" },
                { id: "20", title: "Ninth", url: "https://ninth.example" },
                { id: "21", title: "Tenth", url: "https://tenth.example" },
                {
                  id: "26",
                  title: "Folder Two",
                  children: [{ id: "27", title: "Nested Two", url: "https://nested-two.example" }]
                }
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

const { openBookmarkForCommand, openFolderForCommand } = await import("../src/background.js");

test("registers a command listener on load", () => {
  assert.deepEqual(calls[0], ["addListener", "function"]);
});

test("opens the bookmark matching the command number", async () => {
  calls.length = 0;

  const handled = await openBookmarkForCommand("open-bookmark-02");

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

test("opens every allowed URL in the matching bookmark bar folder", async () => {
  calls.length = 0;

  const handled = await openFolderForCommand("open-folder-01");

  assert.equal(handled, true);
  assert.deepEqual(calls, [
    ["create", { url: "https://nested-one.example" }],
    ["create", { url: "https://deep.example" }]
  ]);
});

test("opens the matching top-level folder by folder-only index", async () => {
  calls.length = 0;

  const handled = await openFolderForCommand("open-folder-02");

  assert.equal(handled, true);
  assert.deepEqual(calls, [["create", { url: "https://nested-two.example" }]]);
});

test("ignores out-of-range or empty folder commands", async () => {
  calls.length = 0;

  assert.equal(await openFolderForCommand("open-folder-10"), false);
  assert.equal(await openFolderForCommand("open-folder-1"), false);
  assert.equal(await openFolderForCommand("not-a-command"), false);
  assert.deepEqual(calls, []);
});

test("ignores unknown or empty bookmark commands", async () => {
  calls.length = 0;

  assert.equal(await openBookmarkForCommand("open-bookmark-11"), false);
  assert.equal(await openBookmarkForCommand("open-bookmark-1"), false);
  assert.equal(await openBookmarkForCommand("not-a-command"), false);
  assert.deepEqual(calls, []);
});
