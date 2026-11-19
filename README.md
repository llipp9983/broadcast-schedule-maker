# 방송시간표 메이커

스트리머를 위한 **주간 방송 시간표 이미지 제작 프로그램**입니다. 일정을 입력하면 디자인된 시간표를 PNG / JPEG 이미지로 바로 내보낼 수 있습니다. (Windows 전용)

## 주요 기능

- **템플릿 2종**
  - **템플릿 1 · 고정형** — 보라색 정사각형(1080×1080). 틀은 고정, 글자만 수정. 토요일은 파란색, 일요일은 빨간색 강조.
  - **템플릿 2 · 사진 배경형** — 하늘색 16:9(1920×1080). 왼쪽 배경에 사진을 올려 **드래그로 이동, 모서리를 끌어 크기 조절**. 오른쪽 스케줄 패널은 고정, 글자만 수정.
- **색상 커스터마이징** — 배경색, 패널색, 포인트색, 글자색, 토요일/일요일 글자색
- **내보내기** — PNG / JPEG, 해상도 1x / 2x / 3x 선택. 미리보기와 결과물이 동일합니다.
- **자동 저장** — 입력한 내용은 자동으로 저장되며, `프로젝트 저장` / `불러오기`로 파일 백업도 가능합니다.
- **오프라인 사용** — 한글 폰트와 모든 리소스가 프로그램에 포함되어 인터넷 없이 동작합니다.
- **자동 업데이트** — 인터넷이 연결되어 있을 때만 새 버전을 확인하고, "업데이트 하시겠어요?" 안내가 뜹니다. 인터넷이 없으면 확인 없이 바로 실행됩니다.

## 설치 방법 (사용자)

1. [Releases](https://github.com/llipp9983/broadcast-schedule-maker/releases) 페이지에서 최신 `BroadcastScheduleMaker-Setup-x.x.x.exe`를 다운로드합니다.
2. 실행하여 설치합니다.
3. > **Windows 경고 안내**: 코드 서명 인증서(유료)를 사용하지 않아 첫 실행 시 "Windows의 PC 보호" 경고가 나타날 수 있습니다. **추가 정보 → 실행**을 눌러 진행하세요.

## 사용 방법

1. 상단에서 템플릿을 선택합니다.
2. 왼쪽 패널에서 기간(또는 SNS 아이디/날짜 뱃지), 요일별 제목·설명·시간을 입력합니다. 오른쪽 미리보기에 바로 반영됩니다.
3. (템플릿 2) `사진 추가`로 사진을 불러온 뒤, 미리보기에서 드래그/모서리 조절로 위치와 크기를 맞춥니다. 사진 바깥을 클릭하면 선택 표시가 사라집니다.
4. 색상 항목에서 원하는 색으로 변경합니다.
5. 상단에서 형식(PNG/JPEG)과 배율(1x/2x/3x)을 고르고 `이미지 내보내기`를 누릅니다.

## 개발자용

필요: Node.js 20 이상

```bash
npm install
npm run start     # 빌드 후 앱 실행
npm run dist      # Windows 설치 파일 생성 (release/ 폴더)
```

기술 스택: Electron, React, Vite, html-to-image, electron-updater, electron-builder

### 새 버전 배포하기

1. `package.json`의 `version`을 올립니다. (예: `1.0.1`)
2. `npm run dist`로 설치 파일을 만듭니다.
3. `release/` 폴더의 `BroadcastScheduleMaker-Setup-x.x.x.exe`, `.exe.blockmap`, `latest.yml` 세 파일을 GitHub Release(태그 `v1.0.1`)에 업로드합니다.

```bash
gh release create v1.0.1 release/BroadcastScheduleMaker-Setup-1.0.1.exe release/BroadcastScheduleMaker-Setup-1.0.1.exe.blockmap release/latest.yml --title "v1.0.1"
```

설치된 프로그램은 실행 시 `latest.yml`을 확인해 새 버전을 안내합니다.

## 라이선스

MIT
