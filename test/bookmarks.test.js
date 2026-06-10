import assert from "node:assert/strict";
import test from "node:test";

import {
  getBookmarkBarFromTree,
  getBookmarkUrlByOneBasedIndex,
  getCommandIndex,
  isAllowedBookmarkUrl,
  getTopLevelBookmarkBarUrls
} from "../src/bookmarks.js";

const bookmarkTree = [
  {
    id: "0",
    title: "",
    children: [
      {
        id: "1",
        title: "Bookmarks Bar",
        children: [
          { id: "10", title: "One", url: "https://one.example" },
          {
            id: "11",
            title: "Folder",
            children: [{ id: "12", title: "Nested", url: "https://nested.example" }]
          },
          { id: "15", title: "Bookmarklet", url: "javascript:alert(document.cookie)" },
          { id: "16", title: "Local file", url: "file:///Users/example/secret.txt" },
          { id: "17", title: "Data URL", url: "data:text/html,<h1>hello</h1>" },
          { id: "13", title: "Two", url: "https://two.example" },
          { id: "14", title: "Three", url: "https://three.example" }
        ]
      },
      { id: "2", title: "Other Bookmarks", children: [] }
    ]
  }
];

test("uses the first root child as the bookmark bar", () => {
  assert.equal(getBookmarkBarFromTree(bookmarkTree).id, "1");
});

test("lists only top-level URL bookmarks and skips folders", () => {
  assert.deepEqual(getTopLevelBookmarkBarUrls(getBookmarkBarFromTree(bookmarkTree)), [
    { id: "10", title: "One", url: "https://one.example" },
    { id: "13", title: "Two", url: "https://two.example" },
    { id: "14", title: "Three", url: "https://three.example" }
  ]);
});

test("continues numbering after folders and blocked URL schemes", () => {
  const bar = getBookmarkBarFromTree(bookmarkTree);

  assert.equal(getBookmarkUrlByOneBasedIndex(bar, 1), "https://one.example");
  assert.equal(getBookmarkUrlByOneBasedIndex(bar, 2), "https://two.example");
  assert.equal(getBookmarkUrlByOneBasedIndex(bar, 3), "https://three.example");
});

test("returns null for out-of-range bookmark indexes", () => {
  const bar = getBookmarkBarFromTree(bookmarkTree);

  assert.equal(getBookmarkUrlByOneBasedIndex(bar, 0), null);
  assert.equal(getBookmarkUrlByOneBasedIndex(bar, 4), null);
  assert.equal(getBookmarkUrlByOneBasedIndex(bar, 10), null);
});

test("parses supported command names only", () => {
  assert.equal(getCommandIndex("open-bookmark-1"), 1);
  assert.equal(getCommandIndex("open-bookmark-9"), 9);
  assert.equal(getCommandIndex("open-bookmark-0"), null);
  assert.equal(getCommandIndex("open-bookmark-10"), null);
  assert.equal(getCommandIndex("other"), null);
});

test("allows only http and https bookmark URLs", () => {
  assert.equal(isAllowedBookmarkUrl("https://example.com"), true);
  assert.equal(isAllowedBookmarkUrl("http://example.com"), true);
  assert.equal(isAllowedBookmarkUrl("javascript:alert(1)"), false);
  assert.equal(isAllowedBookmarkUrl("data:text/html,<script>alert(1)</script>"), false);
  assert.equal(isAllowedBookmarkUrl("file:///Users/example/secret.txt"), false);
  assert.equal(isAllowedBookmarkUrl("not a url"), false);
});
