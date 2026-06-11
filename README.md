# ShortMarker

Safari-style bookmark bar shortcuts for Chrome on macOS.

ShortMarker lets you open top-level bookmark bar URLs and top-level bookmark bar folders with Chrome extension commands. URL commands count only URL bookmarks. Folder commands count only folders, skipping individual URL bookmarks when assigning folder numbers, and open every allowed bookmark URL inside the selected folder.

## Features

- Opens bookmark bar URLs by number, from URL 1 through URL 10.
- Opens bookmark bar folders by number, from Folder 1 through Folder 10.
- URL commands count only top-level bookmark bar items that are real web URLs.
- Folder commands count only top-level bookmark bar folders and skip individual URL bookmarks when assigning Folder 1-10.
- Folder commands open all `http:` and `https:` bookmarks inside the selected folder, including bookmarks inside nested folders.
- Skips non-web URL schemes such as `javascript:`, `data:`, and `file:`.
- Uses Manifest V3.
- Does not inject scripts into websites.
- Does not make network requests.

## Chrome Shortcut Limitation

Chrome already reserves `Command+1` through `Command+9` on macOS for tab switching. Chrome may also reserve or reject other browser-level shortcuts. Chrome extensions cannot disable or override some browser-level shortcuts.

For that reason, ShortMarker declares commands without default shortcuts. After installing it, open `chrome://extensions/shortcuts` and assign shortcuts manually. If Chrome refuses `Command+1` through `Command+9`, use a non-reserved alternative such as `Command+Shift+1` through `Command+Shift+9`.

Chrome's commands API also allows only a limited number of default shortcut suggestions in `manifest.json`, so ShortMarker intentionally leaves the command shortcuts unassigned by default.

## Installation

1. Download or clone this repository.
2. Open `chrome://extensions` in Chrome.
3. Enable `Developer mode`.
4. Click `Load unpacked`.
5. Select the `ShortMarker` folder.
6. Open `chrome://extensions/shortcuts`.
7. Assign shortcuts to `Open Bookmark Bar URL 1` through `Open Bookmark Bar URL 10`.
8. Assign separate shortcuts to `Open Bookmark Bar Folder 1` through `Open Bookmark Bar Folder 10`.

## Usage

Put frequently used sites and folders directly on Chrome's bookmark bar.

Example bookmark bar:

```text
GitHub | Work Folder | Gmail | Research Folder | Calendar
```

URL command order:

```text
URL 1 -> GitHub
URL 2 -> Gmail
URL 3 -> Calendar
```

Folder command order:

```text
Folder 1 -> Work Folder
Folder 2 -> Research Folder
```

Individual URL bookmarks such as GitHub, Gmail, and Calendar are ignored when ShortMarker calculates the Folder 1-10 order.

When a folder command runs, ShortMarker opens every allowed `http:` or `https:` bookmark inside that folder in new tabs. Nested folders are included.

## Security Notes

- Required permission: `bookmarks`.
- No `tabs` permission is requested.
- No `storage` permission is requested.
- No host permissions are requested.
- No content scripts are used.
- No remote code is loaded.
- No analytics or telemetry is included.
- Only `http:` and `https:` bookmark URLs are opened.

## Development

```sh
npm test
npm run validate
```

---

# ShortMarker 한국어 안내

macOS Chrome에서 Safari처럼 북마크바 사이트와 폴더를 단축키로 여는 확장 프로그램입니다.

ShortMarker는 Chrome 확장 명령을 통해 북마크바의 최상위 URL 북마크와 최상위 폴더를 열 수 있게 해줍니다. URL 명령은 URL 북마크만 세고, 폴더 명령은 개별 즐겨찾기를 건너뛰고 폴더만 순서대로 세며, 선택한 폴더 안에 포함된 즐겨찾기를 한 번에 엽니다.

## 주요 기능

- 북마크바 URL을 URL 1부터 URL 10까지 번호로 열기
- 북마크바 폴더를 Folder 1부터 Folder 10까지 번호로 열기
- URL 명령은 북마크바 최상위 항목 중 실제 웹 URL만 계산
- Folder 명령은 개별 URL 즐겨찾기를 건너뛰고 북마크바 최상위 폴더만 Folder 1-10 순서로 계산
- Folder 명령은 선택한 폴더 안의 `http:` 및 `https:` 북마크를 모두 새 탭으로 열기
- 폴더 안의 중첩 폴더에 들어있는 북마크도 함께 열기
- `javascript:`, `data:`, `file:` 같은 비웹 URL 스킴은 제외
- Manifest V3 사용
- 웹사이트에 스크립트를 주입하지 않음
- 외부 네트워크 요청 없음

## Chrome 단축키 제한

macOS Chrome은 이미 `Command+1`부터 `Command+9`까지를 탭 전환 단축키로 사용합니다. 다른 브라우저 레벨 단축키도 Chrome이 거부하거나 예약할 수 있습니다. Chrome 확장 프로그램은 일부 브라우저 기본 단축키를 비활성화하거나 강제로 우선할 수 없습니다.

그래서 ShortMarker는 명령만 선언하고 기본 단축키는 비워둡니다. 설치 후 `chrome://extensions/shortcuts`로 이동해 직접 단축키를 지정하세요. Chrome이 `Command+1`부터 `Command+9`까지를 허용하지 않으면 `Command+Shift+1`부터 `Command+Shift+9` 같은 대체 조합을 사용하면 됩니다.

또한 Chrome commands API는 `manifest.json`에서 기본 단축키 제안 수를 제한하므로, ShortMarker는 의도적으로 기본 단축키를 지정하지 않습니다.

## 설치 방법

1. 이 저장소를 다운로드하거나 클론합니다.
2. Chrome에서 `chrome://extensions`를 엽니다.
3. `Developer mode`를 켭니다.
4. `Load unpacked`를 클릭합니다.
5. `ShortMarker` 폴더를 선택합니다.
6. `chrome://extensions/shortcuts`를 엽니다.
7. `Open Bookmark Bar URL 1`부터 `Open Bookmark Bar URL 10`까지 원하는 단축키를 지정합니다.
8. `Open Bookmark Bar Folder 1`부터 `Open Bookmark Bar Folder 10`까지 별도의 단축키를 지정합니다.

## 사용 방법

자주 쓰는 사이트와 폴더를 Chrome 북마크바에 직접 등록합니다.

예시 북마크바:

```text
GitHub | 업무 폴더 | Gmail | 자료 폴더 | Calendar
```

URL 명령 순서:

```text
URL 1 -> GitHub
URL 2 -> Gmail
URL 3 -> Calendar
```

Folder 명령 순서:

```text
Folder 1 -> 업무 폴더
Folder 2 -> 자료 폴더
```

GitHub, Gmail, Calendar 같은 개별 URL 즐겨찾기는 Folder 1-10 순서를 계산할 때 무시됩니다.

폴더 명령을 실행하면 ShortMarker는 해당 폴더 안의 허용된 `http:` 또는 `https:` 북마크를 모두 새 탭으로 엽니다. 중첩 폴더도 포함됩니다.

## 보안 메모

- 필요한 권한: `bookmarks`
- `tabs` 권한 요청 없음
- `storage` 권한 요청 없음
- host permission 요청 없음
- content script 사용 없음
- 원격 코드 로딩 없음
- 분석/추적 코드 없음
- `http:` 및 `https:` 북마크 URL만 열기

## 개발

```sh
npm test
npm run validate
```
