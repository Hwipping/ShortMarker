import assert from "node:assert/strict";
import test from "node:test";

import {
  collectAllowedBookmarkUrls,
  getBookmarkBarFromTree,
  getBookmarkCommandIndex,
  getBookmarkUrlByOneBasedIndex,
  getFolderCommandIndex,
  getFolderUrlsByOneBasedIndex,
  isAllowedBookmarkUrl,
  getTopLevelBookmarkBarFolders,
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
            title: "Folder One",
            children: [
              { id: "12", title: "Nested", url: "https://nested.example" },
              {
                id: "25",
                title: "Nested Folder",
                children: [
                  { id: "26", title: "Deep", url: "https://deep.example" },
                  { id: "27", title: "Blocked", url: "javascript:alert(1)" }
                ]
              }
            ]
          },
          { id: "28", title: "Folder Two", children: [{ id: "29", title: "Other", url: "https://other.example" }] },
          { id: "15", title: "Bookmarklet", url: "javascript:alert(document.cookie)" },
          { id: "16", title: "Local file", url: "file:///Users/example/secret.txt" },
          { id: "17", title: "Data URL", url: "data:text/html,<h1>hello</h1>" },
          { id: "13", title: "Two", url: "https://two.example" },
          { id: "14", title: "Three", url: "https://three.example" },
          { id: "18", title: "Four", url: "https://four.example" },
          { id: "19", title: "Five", url: "https://five.example" },
          { id: "20", title: "Six", url: "https://six.example" },
          { id: "21", title: "Seven", url: "https://seven.example" },
          { id: "22", title: "Eight", url: "https://eight.example" },
          { id: "23", title: "Nine", url: "https://nine.example" },
          { id: "24", title: "Ten", url: "https://ten.example" }
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
    { id: "14", title: "Three", url: "https://three.example" },
    { id: "18", title: "Four", url: "https://four.example" },
    { id: "19", title: "Five", url: "https://five.example" },
    { id: "20", title: "Six", url: "https://six.example" },
    { id: "21", title: "Seven", url: "https://seven.example" },
    { id: "22", title: "Eight", url: "https://eight.example" },
    { id: "23", title: "Nine", url: "https://nine.example" },
    { id: "24", title: "Ten", url: "https://ten.example" }
  ]);
});

test("lists only top-level bookmark bar folders", () => {
  assert.deepEqual(getTopLevelBookmarkBarFolders(getBookmarkBarFromTree(bookmarkTree)), [
    {
      id: "11",
      title: "Folder One",
      children: [
        { id: "12", title: "Nested", url: "https://nested.example" },
        {
          id: "25",
          title: "Nested Folder",
          children: [
            { id: "26", title: "Deep", url: "https://deep.example" },
            { id: "27", title: "Blocked", url: "javascript:alert(1)" }
          ]
        }
      ]
    },
    {
      id: "28",
      title: "Folder Two",
      children: [{ id: "29", title: "Other", url: "https://other.example" }]
    }
  ]);
});

test("continues numbering after folders and blocked URL schemes", () => {
  const bar = getBookmarkBarFromTree(bookmarkTree);

  assert.equal(getBookmarkUrlByOneBasedIndex(bar, 1), "https://one.example");
  assert.equal(getBookmarkUrlByOneBasedIndex(bar, 2), "https://two.example");
  assert.equal(getBookmarkUrlByOneBasedIndex(bar, 3), "https://three.example");
  assert.equal(getBookmarkUrlByOneBasedIndex(bar, 10), "https://ten.example");
});

test("collects allowed URLs recursively from a folder", () => {
  const folder = getTopLevelBookmarkBarFolders(getBookmarkBarFromTree(bookmarkTree))[0];

  assert.deepEqual(collectAllowedBookmarkUrls(folder), [
    "https://nested.example",
    "https://deep.example"
  ]);
});

test("gets folder URLs by top-level folder index", () => {
  const bar = getBookmarkBarFromTree(bookmarkTree);

  assert.deepEqual(getFolderUrlsByOneBasedIndex(bar, 1), [
    "https://nested.example",
    "https://deep.example"
  ]);
  assert.deepEqual(getFolderUrlsByOneBasedIndex(bar, 2), ["https://other.example"]);
  assert.deepEqual(getFolderUrlsByOneBasedIndex(bar, 11), []);
});

test("returns null for out-of-range bookmark indexes", () => {
  const bar = getBookmarkBarFromTree(bookmarkTree);

  assert.equal(getBookmarkUrlByOneBasedIndex(bar, 0), null);
  assert.equal(getBookmarkUrlByOneBasedIndex(bar, 11), null);
});

test("parses supported command names only", () => {
  assert.equal(getBookmarkCommandIndex("open-bookmark-01"), 1);
  assert.equal(getBookmarkCommandIndex("open-bookmark-09"), 9);
  assert.equal(getBookmarkCommandIndex("open-bookmark-10"), 10);
  assert.equal(getBookmarkCommandIndex("open-bookmark-0"), null);
  assert.equal(getBookmarkCommandIndex("open-bookmark-1"), null);
  assert.equal(getBookmarkCommandIndex("open-bookmark-11"), null);
  assert.equal(getBookmarkCommandIndex("other"), null);
});

test("parses supported folder command names only", () => {
  assert.equal(getFolderCommandIndex("open-folder-01"), 1);
  assert.equal(getFolderCommandIndex("open-folder-09"), 9);
  assert.equal(getFolderCommandIndex("open-folder-10"), 10);
  assert.equal(getFolderCommandIndex("open-folder-0"), null);
  assert.equal(getFolderCommandIndex("open-folder-1"), null);
  assert.equal(getFolderCommandIndex("open-folder-11"), null);
  assert.equal(getFolderCommandIndex("other"), null);
});

test("allows only http and https bookmark URLs", () => {
  assert.equal(isAllowedBookmarkUrl("https://example.com"), true);
  assert.equal(isAllowedBookmarkUrl("http://example.com"), true);
  assert.equal(isAllowedBookmarkUrl("javascript:alert(1)"), false);
  assert.equal(isAllowedBookmarkUrl("data:text/html,<script>alert(1)</script>"), false);
  assert.equal(isAllowedBookmarkUrl("file:///Users/example/secret.txt"), false);
  assert.equal(isAllowedBookmarkUrl("not a url"), false);
});
