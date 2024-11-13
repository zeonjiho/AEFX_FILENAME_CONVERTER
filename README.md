# AEFX_FILENAME_CONVERTER
Filename converter and generator for VFX pipeline, based on Netflix naming conventions.

# AEFX Filename Converter - Features Summary

The **AEFX Filename Converter** tool provides a streamlined interface to generate and manage file names for a VFX pipeline, following Netflix-style naming conventions. Below is an overview of the available features.

## Core Features

### 1. Project and Product Fields
- **Project Name**: Input field to enter the name of the project.
- **Product Name**: Input field to specify the product name related to the project.

### 2. Cut Name and Color Space Selection
- **Cut Name**: Input field for specifying the cut name.
- **Color Space**: Dropdown menu to select from standard color spaces (e.g., sRGB, ACEScg, Rec. 709, Linear, etc.).

### 3. Resolution Fields
- **X and Y Resolution**: Numeric input fields for specifying the horizontal and vertical resolution.

### 4. Product Type and Founder
- **Product Type**: Dropdown to categorize the product as either CGI or Comp.
- **Founder**: Input field to enter the founder's name, limited to alphabetic characters.

### 5. Version State and Version Number
- **Version State**: Dropdown to select between `Preview` and `Final`.
- **Version Number**: Numeric input to define the current version number, auto-incrementing with each conversion.

## Preset Management

### 6. Preset Buttons
- **Preset Navigation**: Interface for managing multiple presets with selectable buttons.
- **Add/Remove Presets**: Buttons for adding a new preset (up to 15) or removing an existing one.
- **Save Current Preset**: Saves current field values into a preset for future use.
- **Load and Reset Presets**: Load selected preset data or reset data for the current preset.

## Conversion and Display

### 7. Filename Conversion
- **Convert & Copy**: Generates a filename based on input values and automatically copies it to the clipboard.
- **Filename Display**: Shows the converted filename in a styled display container.

### 8. Clipboard Copy Notification
- **Copy Success Message**: Notifies the user when the filename has been successfully copied to the clipboard.

### 9. Dynamic Tooltips
- **Preset Tooltips**: Hover over preset buttons to see project, product, and cut name details.

## Dark and Light Theme Toggle
- **Theme Toggle Button**: Fixed button to toggle between light and dark themes.
- **Auto Theme Detection**: Detects and adapts to the user's system theme on page load.

## Field Validations and Warnings
- **Input Validations**: Ensures valid entry for each field, displaying alerts for incorrect inputs.
- **Preset Messages**: Dynamic message display when a preset is loaded, saved, or reset.

## Mobile Responsiveness
- **Responsive Design**: Adapts layout and button sizes for screens under 600px wide.


# AEFX_FILENAME_CONVERTER

VFX 파이프라인을 위한 파일명 변환기 및 생성기, 넷플릭스 네이밍 규칙을 기반으로 설계되었습니다.

# AEFX Filename Converter - 기능 요약

**AEFX Filename Converter**는 넷플릭스 스타일의 네이밍 규칙을 따르는 VFX 파이프라인용 파일명을 생성 및 관리할 수 있는 직관적인 인터페이스를 제공합니다. 아래는 해당 기능들에 대한 요약입니다.

## 핵심 기능

### 1. 프로젝트 및 제품 필드
- **프로젝트 이름**: 프로젝트 이름을 입력할 수 있는 필드.
- **제품 이름**: 프로젝트와 관련된 제품 이름을 지정하는 필드.

### 2. 컷 이름 및 색 공간 선택
- **컷 이름**: 컷 이름을 지정하는 필드.
- **색 공간**: sRGB, ACEScg, Rec. 709, Linear 등의 표준 색 공간을 선택할 수 있는 드롭다운 메뉴.

### 3. 해상도 필드
- **X 및 Y 해상도**: 가로 및 세로 해상도를 지정하는 숫자 입력 필드.

### 4. 제품 유형 및 설립자
- **제품 유형**: CGI 또는 Comp로 제품을 분류할 수 있는 드롭다운.
- **설립자**: 영어 문자만 입력 가능한 설립자 이름 필드.

### 5. 버전 상태 및 버전 번호
- **버전 상태**: `Preview`와 `Final` 중 선택할 수 있는 드롭다운.
- **버전 번호**: 현재 버전 번호를 정의하는 숫자 입력 필드로, 변환 시 자동 증가.

## 프리셋 관리

### 6. 프리셋 버튼
- **프리셋 내비게이션**: 여러 프리셋을 관리하기 위한 버튼 인터페이스.
- **프리셋 추가/제거**: 새 프리셋 추가(최대 15개) 또는 기존 프리셋 삭제 버튼.
- **현재 프리셋 저장**: 현재 필드 값을 프리셋에 저장하여 나중에 사용할 수 있음.
- **프리셋 로드 및 리셋**: 선택한 프리셋 데이터 로드 또는 현재 프리셋 데이터 리셋.

## 변환 및 표시

### 7. 파일명 변환
- **변환 및 복사**: 입력된 값에 따라 파일명을 생성하고 자동으로 클립보드에 복사.
- **파일명 표시**: 변환된 파일명을 스타일이 적용된 표시 컨테이너에 보여줌.

### 8. 클립보드 복사 알림
- **복사 성공 메시지**: 파일명이 클립보드에 성공적으로 복사되었음을 사용자에게 알림.

### 9. 동적 툴팁
- **프리셋 툴팁**: 프리셋 버튼 위로 마우스를 올리면 프로젝트, 제품, 컷 이름 등의 상세 정보를 표시.

## 다크 및 라이트 테마 전환
- **테마 전환 버튼**: 라이트와 다크 테마를 전환할 수 있는 고정 버튼.
- **자동 테마 감지**: 페이지 로드 시 시스템 테마를 감지하여 자동으로 적용.

## 필드 검증 및 경고
- **입력 검증**: 각 필드의 올바른 입력을 보장하며, 잘못된 입력 시 경고를 표시.
- **프리셋 메시지**: 프리셋이 로드, 저장 또는 리셋될 때 동적으로 메시지 표시.

## 모바일 대응
- **반응형 디자인**: 600px 이하의 화면에서 레이아웃과 버튼 크기를 조정하여 사용성을 높임.
