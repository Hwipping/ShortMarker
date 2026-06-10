# ShortMarker

Safari-style bookmark bar shortcuts for Chrome on macOS.

ShortMarker lets you open the first nine top-level bookmark bar URLs with Chrome extension commands. Folders are skipped while counting, so the next URL bookmark keeps the next number.

## Features

- Opens bookmark bar URLs by number.
- Counts only top-level bookmark bar items that are real web URLs.
- Skips folders and non-web URL schemes such as `javascript:`, `data:`, and `file:`.
- Opens the selected bookmark in the active tab, falling back to a new tab if the active tab cannot be navigated.
- Uses Manifest V3.
- Does not inject scripts into websites.
- Does not make network requests.

## Chrome Shortcut Limitation

Chrome already reserves `Command+1` through `Command+9` on macOS for tab switching. Chrome extensions cannot disable or override some browser-level shortcuts.

For that reason, ShortMarker declares nine commands without default shortcuts. After installing it, open `chrome://extensions/shortcuts` and assign shortcuts manually. If Chrome refuses `Command+1` through `Command+9`, use a non-reserved alternative such as `Command+Shift+1` through `Command+Shift+9`.

Chrome's commands API also allows only a limited number of default shortcut suggestions in `manifest.json`, so ShortMarker intentionally leaves the command shortcuts unassigned by default.

## Installation

1. Download or clone this repository.
2. Open `chrome://extensions` in Chrome.
3. Enable `Developer mode`.
4. Click `Load unpacked`.
5. Select the `ShortMarker` folder.
6. Open `chrome://extensions/shortcuts`.
7. Assign shortcuts to `Open bookmark bar URL 1` through `Open bookmark bar URL 9`.

## Usage

1. Put your frequently used sites directly on Chrome's bookmark bar.
2. Keep folders wherever you like; folders are ignored while counting.
3. Trigger the shortcut assigned to a command.

Example bookmark bar:

```text
GitHub | Work Folder | Gmail | Calendar
```

The command order is:

```text
1 -> GitHub
2 -> Gmail
3 -> Calendar
```

## Security Notes

- Required permission: `bookmarks`.
- No `tabs` permission is requested.
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

## Docker Test

```sh
docker build -t shortmarker .
docker run --rm shortmarker
```

---

# ShortMarker 한국어 안내

macOS Chrome에서 Safari처럼 북마크바 사이트를 단축키로 여는 확장 프로그램입니다.

ShortMarker는 Chrome 확장 명령을 통해 북마크바의 상위 URL 북마크 1번부터 9번까지를 열 수 있게 해줍니다. 폴더는 번호 계산에서 제외되므로, 폴더 뒤에 있는 URL 북마크가 다음 번호를 이어받습니다.

## 주요 기능

- 북마크바 URL을 번호로 열기
- 북마크바의 최상위 항목 중 실제 웹 URL만 계산
- 폴더와 `javascript:`, `data:`, `file:` 같은 비웹 URL 스킴은 제외
- 선택한 북마크를 현재 활성 탭에서 열고, 활성 탭 이동이 실패하면 새 탭으로 열기
- Manifest V3 사용
- 웹사이트에 스크립트를 주입하지 않음
- 외부 네트워크 요청 없음

## Chrome 단축키 제한

macOS Chrome은 이미 `Command+1`부터 `Command+9`까지를 탭 전환 단축키로 사용합니다. Chrome 확장 프로그램은 일부 브라우저 기본 단축키를 비활성화하거나 강제로 우선할 수 없습니다.

그래서 ShortMarker는 9개의 명령만 선언하고 기본 단축키는 비워둡니다. 설치 후 `chrome://extensions/shortcuts`로 이동해 직접 단축키를 지정하세요. Chrome이 `Command+1`부터 `Command+9`까지를 허용하지 않으면 `Command+Shift+1`부터 `Command+Shift+9` 같은 대체 조합을 사용하면 됩니다.

또한 Chrome commands API는 `manifest.json`에서 기본 단축키 제안 수를 제한하므로, ShortMarker는 의도적으로 기본 단축키를 지정하지 않습니다.

## 설치 방법

1. 이 저장소를 다운로드하거나 클론합니다.
2. Chrome에서 `chrome://extensions`를 엽니다.
3. `Developer mode`를 켭니다.
4. `Load unpacked`를 클릭합니다.
5. `ShortMarker` 폴더를 선택합니다.
6. `chrome://extensions/shortcuts`를 엽니다.
7. `Open bookmark bar URL 1`부터 `Open bookmark bar URL 9`까지 원하는 단축키를 지정합니다.

## 사용 방법

1. 자주 쓰는 사이트를 Chrome 북마크바에 직접 등록합니다.
2. 폴더는 원하는 위치에 두어도 됩니다. 번호 계산에서 제외됩니다.
3. 각 명령에 지정한 단축키를 누릅니다.

예시 북마크바:

```text
GitHub | 업무 폴더 | Gmail | Calendar
```

명령 순서는 다음과 같습니다.

```text
1 -> GitHub
2 -> Gmail
3 -> Calendar
```

## 보안 메모

- 필요한 권한: `bookmarks`
- `tabs` 권한 요청 없음
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

## Docker 테스트

```sh
docker build -t shortmarker .
docker run --rm shortmarker
```
