document.getElementById('exportAllPresets').addEventListener('click', function(e) {
    const dialog = document.getElementById('exportDialog');
    const dialogContent = dialog.querySelector('.dialog-content');
    
    // 클릭 위치 저장
    const clickX = e.clientX;
    const clickY = e.clientY;
    
    // 다이얼로그 표시
    dialog.style.display = 'block';
    
    // 다이얼로그 크기 계산
    const dialogWidth = dialogContent.offsetWidth;
    const dialogHeight = dialogContent.offsetHeight;
    
    // 화면 경계 체크
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // X 위치 계산 (화면 왼쪽/오른쪽 경계 체크)
    let leftPos = clickX - (dialogWidth / 2);
    leftPos = Math.max(20, Math.min(leftPos, viewportWidth - dialogWidth - 20));
    
    // Y 위치 계산 (항상 마우스 위에 표시)
    let topPos = clickY - dialogHeight - 20; // 마우스 위 20px 간격
    
    // 상단 경계 체크
    if (topPos < 20) {
        topPos = clickY + 20; // 공간이 부족하면 마우스 아래로
    }
    
    // 위치 적용
    dialogContent.style.left = leftPos + 'px';
    dialogContent.style.top = topPos + 'px';
});
// 프리셋 번호 관리
let currentPresetNumber = 1;
let totalPresets = 1;
const maxPresets = 15;

// 변경 사항 추적 변수
let isDirty = false;

// 프리셋 초기화
const presetsContainer = document.getElementById('presets-container');

// 페이지 로드 시 totalPresets 값을 localStorage에서 가져옴
if (localStorage.getItem('totalPresets')) {
    totalPresets = parseInt(localStorage.getItem('totalPresets'));
} else {
    totalPresets = 1;
    localStorage.setItem('totalPresets', totalPresets);
}

function initializePresets() {
    presetsContainer.innerHTML = '';
    for (let i = 1; i <= totalPresets; i++) {
        createPresetButton(i);
    }
    updateCurrentPresetDisplay();
}

function createPresetButton(presetNumber) {
    let button = document.createElement('button');
    button.className = 'preset-button';
    button.textContent = presetNumber;

    // 버튼 클릭 시 이벤트 처리
    button.onclick = function() {
        if (currentPresetNumber !== presetNumber) {
            if (isDirty) {
                if (confirm('저장되지 않은 변경 사항이 있습니다. 정말로 프리셋을 전환하시겠습니까?')) {
                    loadPreset(presetNumber);
                    isDirty = false; // 변경 사항 초기화
                } else {
                    return; // 취소하면 아무 것도 하지 않음
                }
            } else {
                loadPreset(presetNumber);
            }
        }
    };

    button.onmouseover = function() { showTooltip(presetNumber); };
    button.onmouseout = function() { hideTooltip(presetNumber); };
    button.id = 'preset-button-' + presetNumber;

    // 툴팁 요소 생성 및 클래스 추가
    let tooltip = document.createElement('div');
    tooltip.className = 'preset-tooltip'; // .preset-tooltip 클래스 추가
    tooltip.id = 'tooltip-' + presetNumber;

    button.appendChild(tooltip);
    presetsContainer.appendChild(button);
    updateTooltip(presetNumber);
}

// 현재 프리셋 표시 업데이트
function updateCurrentPresetDisplay() {
    // 모든 버튼에서 'selected-preset' 클래스 제거
    for (let i = 1; i <= totalPresets; i++) {
        const button = document.getElementById('preset-button-' + i);
        if (button) {
            button.classList.remove('selected-preset');
        }
    }

    // 현재 버튼에 'selected-preset' 클래스 추가
    const currentButton = document.getElementById('preset-button-' + currentPresetNumber);
    if (currentButton) {
        currentButton.classList.add('selected-preset');
    }
}

document.getElementById('toggle-checkboxes').addEventListener('click', function () {
    const checkboxContainer = document.getElementById('checkbox-container');
    const isHidden = checkboxContainer.classList.contains('hidden');

    // 토글 상태 변경
    if (isHidden) {
        checkboxContainer.classList.remove('hidden');
        this.textContent = 'Hide'; // 버튼 텍스트 업데이트
    } else {
        checkboxContainer.classList.add('hidden');
        this.textContent = 'Form Setting'; // 버튼 텍스트 업데이트
    }
});

// 프리셋 추가
document.getElementById('add-preset-button').addEventListener('click', function() {
    if (totalPresets < maxPresets) {
        totalPresets++;
        createPresetButton(totalPresets);

        // 현재 프리셋의 데이터를 새로운 프리셋에 복사 (버전 번호 제외)
        let currentData = {
            projectName: document.getElementById('projectName').value,
            product: document.getElementById('product').value,
            cut_name: document.getElementById('cut_name').value,
            colorspace: document.getElementById('colorspace').value,
            x_resolution: document.getElementById('x_resolution').value,
            y_resolution: document.getElementById('y_resolution').value,
            product_type: document.getElementById('product_type').value,
            founder: document.getElementById('founder').value,
            version_state: document.getElementById('version-state').value,
            version_prev: 1, // version_prev를 1로 설정
            version_final: 1, // version_final을 1로 설정
            frameNumberLength: document.getElementById('frame-number').value || 4, // frame number length 저장
            checkboxStates: getCheckboxStates() // 체크박스 상태 저장
        };
        localStorage.setItem('preset' + totalPresets, JSON.stringify(currentData));

        // totalPresets 값을 localStorage에 저장
        localStorage.setItem('totalPresets', totalPresets);

        updateTooltip(totalPresets);
    } else {
        alert('더 이상 프리셋을 추가할 수 없습니다.');
    }
});

// 프리셋 제거
document.getElementById('remove-preset-button').addEventListener('click', function() {
    if (totalPresets > 1) {
        let presetData = localStorage.getItem('preset' + totalPresets);
        let hasData = false;
        if (presetData) {
            presetData = JSON.parse(presetData);
            // 필수 필드에 데이터가 있는지 확인
            const projectName = presetData.projectName && presetData.projectName.trim();
            const product = presetData.product && presetData.product.trim();
            const cutName = presetData.cut_name && presetData.cut_name.trim();

            if (projectName || product || cutName) {
                hasData = true;
            }
        }

        if (hasData) {
            if (confirm('Preset ' + totalPresets + '에 데이터가 있습니다. 정말로 삭제하시겠습니까?')) {
                localStorage.removeItem('preset' + totalPresets);
            } else {
                return;
            }
        } else {
            // 데이터가 없으면 확인 없이 제거
            localStorage.removeItem('preset' + totalPresets);
        }

        let button = document.getElementById('preset-button-' + totalPresets);
        presetsContainer.removeChild(button);
        if (currentPresetNumber === totalPresets) {
            currentPresetNumber = 1;
            loadPreset(currentPresetNumber);
        }
        totalPresets--;
        // totalPresets 값을 localStorage에 저장
        localStorage.setItem('totalPresets', totalPresets);
        updateCurrentPresetDisplay();
    } else {
        alert('최소 하나의 프리셋은 있어야 합니다.');
    }
});

// 현재 데이터를 현재 프리셋에 저장
function saveCurrentToPreset() {
    // 필드 값 가져오기
    const projectName = document.getElementById('projectName').value.trim();
    const product = document.getElementById('product').value.trim();
    const cutName = document.getElementById('cut_name').value.trim();
    const frameNumberLength = parseInt(document.getElementById('frame-number').value) || 4; // frame number length 저장

    // 필드 검증
    if (!projectName || !product || !cutName) {
        displayPresetMessage('저장할 데이터가 없습니다.', false);
        return;
    }

    // 현재 버전 상태 및 버전 번호 가져오기
    const versionState = document.getElementById('version-state').value;
    const versionNumber = document.getElementById('version').value;

    // 기존 프리셋 데이터 가져오기 또는 새로 생성
    let presetData = localStorage.getItem('preset' + currentPresetNumber);
    if (presetData) {
        presetData = JSON.parse(presetData);
    } else {
        presetData = {};
    }

    // 체크박스 상태 저장
    const checkboxStates = getCheckboxStates();

    // 프리셋 데이터 업데이트
    presetData.projectName = projectName;
    presetData.product = product;
    presetData.cut_name = cutName;
    presetData.colorspace = document.getElementById('colorspace').value;
    presetData.x_resolution = document.getElementById('x_resolution').value;
    presetData.y_resolution = document.getElementById('y_resolution').value;
    presetData.product_type = document.getElementById('product_type').value;
    presetData.founder = document.getElementById('founder').value;
    presetData.version_state = versionState;
    presetData.frameNumberLength = frameNumberLength; // frame number length 저장
    presetData.checkboxStates = checkboxStates; // 체크박스 상태 저장

    // 버전 상태에 따른 버전 번호 업데이트
    if (versionState === 'prev') {
        presetData.version_prev = versionNumber;
    } else if (versionState === 'final') {
        presetData.version_final = versionNumber;
    }

    localStorage.setItem('preset' + currentPresetNumber, JSON.stringify(presetData));
    displayPresetMessage('Preset ' + currentPresetNumber + ' 저장되었습니다.', true);
    updateTooltip(currentPresetNumber);

    isDirty = false; // 저장 후 변경 사항 초기화
}

// 체크박스 상태 가져오기
function getCheckboxStates() {
    const checkboxStates = {};

    // '#checkbox-container' 내의 체크박스 상태 저장
    const containerCheckboxes = document.querySelectorAll('#checkbox-container input[type="checkbox"]');
    containerCheckboxes.forEach((checkbox) => {
        checkboxStates['container_' + checkbox.name] = checkbox.checked;
    });

    // 'optionalFields'에 정의된 체크박스 상태 저장
    optionalFields.forEach(field => {
        const checkbox = document.getElementById(field.checkboxId);
        if (checkbox) {
            checkboxStates['optional_' + checkbox.id] = checkbox.checked;
        }
    });

    return checkboxStates;
}

// 메시지 표시
function displayPresetMessage(message, isPositive) {
    const presetMessage = document.getElementById('preset-message');
    presetMessage.textContent = message;
    
    // 테마에 따른 색상 설정
    const theme = document.documentElement.getAttribute('data-theme');
    if (isPositive) {
        if (theme === 'dark') {
            presetMessage.style.color = '#FFFFFF'; // Dark 모드에서 흰색 글씨
        } else {
            presetMessage.style.color = '#000000'; // Light 모드에서 검은색 글씨
        }
    } else {
        presetMessage.style.color = '#FF6666'; // 부정적인 메시지는 빨간색
    }
    
    // 페이드 인
    presetMessage.style.opacity = '1';
    // 5초 후 페이드 아웃
    setTimeout(() => {
        presetMessage.style.opacity = '0';
    }, 5000);
}

// 프리셋 데이터 로드
function loadPreset(presetNumber) {
    // 현재 프리셋 번호 업데이트 및 표시 업데이트
    currentPresetNumber = presetNumber;
    updateCurrentPresetDisplay();

    // 프리셋 데이터 로드
    let presetData = localStorage.getItem('preset' + presetNumber);
    if (presetData) {
        presetData = JSON.parse(presetData);
        document.getElementById('projectName').value = presetData.projectName || '';
        document.getElementById('product').value = presetData.product || '';
        document.getElementById('cut_name').value = presetData.cut_name || '';
        document.getElementById('colorspace').value = presetData.colorspace || 'srgb';
        document.getElementById('x_resolution').value = presetData.x_resolution || '';
        document.getElementById('y_resolution').value = presetData.y_resolution || '';
        document.getElementById('product_type').value = presetData.product_type || 'cgi';
        document.getElementById('founder').value = presetData.founder || '';
        document.getElementById('version-state').value = presetData.version_state || 'prev';
        document.getElementById('frame-number').value = presetData.frameNumberLength || 4; // frame number length 로드

        // 버전 상태에 따른 버전 번호 설정
        const versionState = document.getElementById('version-state').value;
        let version = versionState === 'prev' ? presetData.version_prev : presetData.version_final;
        document.getElementById('version').value = version || 1;

        // 체크박스 상태 복원
        if (presetData.checkboxStates) {
            // '#checkbox-container' 내의 체크박스 상태 복원
            const containerCheckboxes = document.querySelectorAll('#checkbox-container input[type="checkbox"]');
            containerCheckboxes.forEach((checkbox) => {
                const key = 'container_' + checkbox.name;
                if (presetData.checkboxStates.hasOwnProperty(key)) {
                    checkbox.checked = presetData.checkboxStates[key];
                } else {
                    checkbox.checked = true; // 기본값은 체크 상태
                }
            });

            // 'optionalFields'에 정의된 체크박스 상태 복원
            optionalFields.forEach(field => {
                const checkbox = document.getElementById(field.checkboxId);
                const key = 'optional_' + checkbox.id;
                if (checkbox && presetData.checkboxStates.hasOwnProperty(key)) {
                    checkbox.checked = presetData.checkboxStates[key];
                } else if (checkbox) {
                    checkbox.checked = true; // 기본값은 체크 상태
                }
            });
        } else {
            // 체크박스 기본 상태 설정 (모두 체크)
            const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');
            allCheckboxes.forEach((checkbox) => {
                checkbox.checked = true;
            });
        }

        displayPresetMessage('Preset ' + presetNumber + ' 로드되었습니다.', true);
    } else {
        displayPresetMessage('Preset ' + presetNumber + '에 데이터가 없습니다.', false);
        // 데이터가 없으면 필드 초기화
        document.getElementById('projectName').value = '';
        document.getElementById('product').value = '';
        document.getElementById('cut_name').value = '';
        document.getElementById('colorspace').value = 'srgb';
        document.getElementById('x_resolution').value = '';
        document.getElementById('y_resolution').value = '';
        document.getElementById('product_type').value = 'cgi';
        document.getElementById('founder').value = '';
        document.getElementById('version-state').value = 'prev';
        document.getElementById('version').value = 1;
        document.getElementById('frame-number').value = 4; // 기본값 설정

        // 체크박스 기본 상태 설정 (모두 체크)
        const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');
        allCheckboxes.forEach((checkbox) => {
            checkbox.checked = true;
        });
    }

    // 폼 필드 가시성 업데이트
    updateFormFieldVisibility();

    isDirty = false; // 프리셋 로드 후 변경 사항 초기화
}

// 버전 상태 변경 처리
document.getElementById('version-state').addEventListener('change', function() {
    const versionState = this.value;
    let presetData = localStorage.getItem('preset' + currentPresetNumber);
    let versionNumber = 1;
    if (presetData) {
        presetData = JSON.parse(presetData);
        if (versionState === 'prev') {
            versionNumber = presetData.version_prev || 1;
        } else if (versionState === 'final') {
            versionNumber = presetData.version_final || 1;
        }
    }
    document.getElementById('version').value = versionNumber;
});

// 버전 번호 실시간 업데이트
document.getElementById('version').addEventListener('input', function() {
    // 업데이트된 버전 번호를 프리셋 데이터에 장
    const versionNumber = this.value;
    const versionState = document.getElementById('version-state').value;
    let presetData = localStorage.getItem('preset' + currentPresetNumber);
    if (presetData) {
        presetData = JSON.parse(presetData);
    } else {
        presetData = {};
    }

    if (versionState === 'prev') {
        presetData.version_prev = versionNumber;
    } else if (versionState === 'final') {
        presetData.version_final = versionNumber;
    }

    localStorage.setItem('preset' + currentPresetNumber, JSON.stringify(presetData));

    isDirty = true; // 변경 사항 추적
});

// 현재 프리셋 리셋
function resetCurrentPreset() {
    if (confirm('현재 프리셋의 모든 데이터를 삭제하시겠습니까?')) {
        localStorage.removeItem('preset' + currentPresetNumber);
        displayPresetMessage('Preset ' + currentPresetNumber + '이(가) 초기화되었습니다.', false);
        updateTooltip(currentPresetNumber);
        // 필드 초기화
        document.getElementById('projectName').value = '';
        document.getElementById('product').value = '';
        document.getElementById('cut_name').value = '';
        document.getElementById('colorspace').value = 'srgb';
        document.getElementById('x_resolution').value = '';
        document.getElementById('y_resolution').value = '';
        document.getElementById('product_type').value = 'cgi';
        document.getElementById('founder').value = '';
        document.getElementById('version-state').value = 'prev';
        document.getElementById('version').value = 1;
        document.getElementById('frame-number').value = 4; // 기본값 설정

        // 체크박스 기본 상태 설정 (모두 체크)
        const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');
        allCheckboxes.forEach((checkbox) => {
            checkbox.checked = true;
        });

        // 폼 필드 가시성 업데이트
        updateFormFieldVisibility();

        isDirty = false; // 변경 사항 초기화
    }
}

// 모든 데이터 리셋
function resetAllData() {
    if (confirm('모든 데이터와 프리셋을 삭제하시겠습니까?')) {
        localStorage.clear();
        displayPresetMessage('모든 데이터가 초기화되었습니다.', false);
        // 프리셋 번호 초기화
        currentPresetNumber = 1;
        totalPresets = 1;
        // totalPresets 값을 localStorage에 저장
        localStorage.setItem('totalPresets', totalPresets);
        initializePresets();
        // 필드 초기화
        document.getElementById('projectName').value = '';
        document.getElementById('product').value = '';
        document.getElementById('cut_name').value = '';
        document.getElementById('colorspace').value = 'srgb';
        document.getElementById('x_resolution').value = '';
        document.getElementById('y_resolution').value = '';
        document.getElementById('product_type').value = 'cgi';
        document.getElementById('founder').value = '';
        document.getElementById('version-state').value = 'prev';
        document.getElementById('version').value = 1;
        document.getElementById('frame-number').value = 4; // 기본값 설정

        // 체크박스 기본 상태 설정 (모두 체크)
        const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');
        allCheckboxes.forEach((checkbox) => {
            checkbox.checked = true;
        });

        // 폼 필드 가시성 업데이트
        updateFormFieldVisibility();

        isDirty = false; // 변경 사항 초기화
    }
}

// 선택 가능한 필드 목록과 해당 체크박스 ID, 입력 그룹 ID 매핑
const optionalFields = [
    { checkboxId: 'include-colorspace', groupId: 'group-colorspace' },
    { checkboxId: 'include-resolution', groupId: 'group-resolution' },
    { checkboxId: 'include-productType', groupId: 'group-productType' },
    { checkboxId: 'include-founder', groupId: 'group-founder' },
    { checkboxId: 'include-versionState', groupId: 'group-versionState' },
    { checkboxId: 'include-version', groupId: 'group-version' },
    { checkboxId: 'include-frameNumber', groupId: 'group-frameNumber' },
];

// 폼 필드 표시/숨김 업데이트 함수
function updateFormFieldVisibility() {
    optionalFields.forEach(field => {
        const checkbox = document.getElementById(field.checkboxId);
        const formGroup = document.getElementById(field.groupId);
        if (checkbox.checked) {
            formGroup.style.display = ''; // 표시
        } else {
            formGroup.style.display = 'none'; // 숨김
        }
    });
}

// 체크박스에 이벤트 리스너 추가
optionalFields.forEach(field => {
    const checkbox = document.getElementById(field.checkboxId);
    checkbox.addEventListener('change', function() {
        updateFormFieldVisibility();
        isDirty = true; // 변경 사항 추적
    });
});

// 모든 폼 필드에 이벤트 리스너 추가
const formFields = document.querySelectorAll('.form-container input, .form-container select');

formFields.forEach(field => {
    field.addEventListener('input', function() {
        isDirty = true;
    });
});

// convertAndCopy 함수에서 체크박스 상태에 따라 필드 반영
function convertAndCopy() {
    // 입력 검증
    const projectNameInput = document.getElementById('projectName');
    const productInput = document.getElementById('product');
    const cutNameInput = document.getElementById('cut_name');
    const founderInput = document.getElementById('founder');

    // Founder 필드만 입력 검증 (영어만 허용)
    if (!founderInput.checkValidity()) {
        alert('Founder 필드에는 영어만 입력 가능합니다.');
        return;
    }

    let versionNumber = document.getElementById('version').value;
    let versionFormatted = 'v' + ('000' + versionNumber).slice(-3);

    // Frame Number Length 값 가져오기 (기본값은 4로 설정)
    const frameNumberLength = parseInt(document.getElementById('frame-number').value) || 4;
    let framePlaceholder = '';
    if (document.getElementById('include-frameNumber').checked) {
        framePlaceholder = '.' + '#'.repeat(frameNumberLength);  // Frame Number Length에 맞춰 # 개수 설정
    }

    const fields = [];

    // 항상 포함되는 필드: Project Name, Product, Cut Name
    fields.push(projectNameInput.value);
    fields.push(productInput.value);
    fields.push(cutNameInput.value);

    // 체크박스에 따른 필드 추가
    if (document.getElementById('include-colorspace').checked) {
        fields.push(document.getElementById('colorspace').value);
    }

    if (document.getElementById('include-resolution').checked) {
        const x_resolution = document.getElementById('x_resolution').value;
        const y_resolution = document.getElementById('y_resolution').value;

        let resolution = '';
        if (x_resolution && y_resolution) {
            resolution = x_resolution + 'x' + y_resolution;
        } else if (x_resolution) {
            resolution = x_resolution;
        } else if (y_resolution) {
            resolution = y_resolution;
        }

        if (resolution) {
            fields.push(resolution);
        }
    }

    if (document.getElementById('include-productType').checked) {
        fields.push(document.getElementById('product_type').value);
    }

    if (document.getElementById('include-founder').checked) {
        const founderValue = founderInput.value.trim(); // 공백 제거
        if (founderValue) { // 값이 있을 때만 추가
            fields.push(founderValue);
        }
    }

    if (document.getElementById('include-versionState').checked) {
        fields.push(document.getElementById('version-state').value);
    }

    if (document.getElementById('include-version').checked) {
        fields.push(versionFormatted);
    }

    // 결과 생성
    let result = fields.join('_') + framePlaceholder;

    document.getElementById('result').textContent = result;

    // `#result`에 `visible` 클래스 추가하여 페드 인 효과 적용
    const resultElement = document.getElementById('result');
    resultElement.classList.add('visible'); // `visible` 클래스 추가로 페이드 인

    // 클립보드에 복사
    navigator.clipboard.writeText(result).then(() => {
        const copyMessage = document.getElementById('copy-message');
        
        // 페이드 인 효과 적용
        copyMessage.classList.add('visible'); 

        // 2초 후 `visible` 클래스 제거하여 페이드 아웃 효과 적용
        setTimeout(() => {
            copyMessage.classList.remove('visible'); // 페이드 아웃
        }, 2000);

        // 버전 번호 증가
        let versionInput = document.getElementById('version');
        let versionNumber = parseInt(versionInput.value);
        versionNumber += 1;
        versionInput.value = versionNumber;

        // 업데이트된 버전 번호를 프리셋에 저장
        saveCurrentToPreset();

        isDirty = false; // 변경 사항 초기화
    });
}

// 툴팁 내용 업데이트
function updateTooltip(presetNumber) {
    let tooltip = document.getElementById('tooltip-' + presetNumber);
    let presetData = localStorage.getItem('preset' + presetNumber);

    if (presetData) {
        presetData = JSON.parse(presetData);

        const projectName = presetData.projectName && presetData.projectName.trim();
        const product = presetData.product && presetData.product.trim();
        const cutName = presetData.cut_name && presetData.cut_name.trim();

        // 필드 모두 비어 있을 경우 'No data' 표시
        if (!projectName && !product && !cutName) {
            tooltip.innerHTML = 'No data';
        } else {
            tooltip.innerHTML = '';  // 비우기
            if (projectName) tooltip.innerHTML += `Project Name: ${projectName}<br>`;
            if (product) tooltip.innerHTML += `Product: ${product}<br>`;
            if (cutName) tooltip.innerHTML += `Cut Name: ${cutName}`;
        }
    } else {
        tooltip.innerHTML = 'No data';
    }
}

// 툴팁 표시
function showTooltip(presetNumber) {
    updateTooltip(presetNumber);
}

function hideTooltip(presetNumber) {
    // CSS에 의해 자동으로 숨겨집니다
}

// 프리셋 초기화
initializePresets();

// 테마 전환 로직
const themeToggle = document.getElementById('theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
let currentTheme = localStorage.getItem('theme');

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
        themeToggle.textContent = 'Dark mode';
    } else {
        themeToggle.textContent = 'Light mode';
    }
}

if (currentTheme) {
    setTheme(currentTheme);
} else {
    if (prefersDarkScheme.matches) {
        setTheme('dark');
    } else {
        setTheme('light');
    }
}

themeToggle.addEventListener('click', function() {
    let theme = document.documentElement.getAttribute('data-theme');
    if (theme === 'dark') {
        setTheme('light');
    } else {
        setTheme('dark');
    }
});

// 시스템 테마 변경 감지
prefersDarkScheme.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        if (e.matches) {
            setTheme('dark');
        } else {
            setTheme('light');
        }
    }
});

// 프리셋 매니저 클래스
class PresetManager {
    constructor() {
        this.initializeEventListeners();
        this.initializeDragAndDrop();
    }

    initializeEventListeners() {
        document.getElementById('exportAllPresets').addEventListener('click', () => this.showExportDialog());
        document.getElementById('importPresets').addEventListener('click', () => document.getElementById('importInput').click());
        document.getElementById('importInput').addEventListener('change', (e) => this.handleImport(e));
        document.getElementById('confirmExport').addEventListener('click', () => this.exportAllPresets());
        document.getElementById('cancelExport').addEventListener('click', () => this.hideExportDialog());
    }

    initializeDragAndDrop() {
        // 드래그 오버레이 생성 및 추가
        const overlay = document.createElement('div');
        overlay.className = 'drag-overlay';
        overlay.style.display = 'none'; // 기본적으로 숨김
        const overlayText = document.createElement('div');
        overlayText.className = 'drag-overlay-text';
        overlayText.textContent = 'Drop JSON file here';
        overlay.appendChild(overlayText);
        document.body.appendChild(overlay);

        // 전체 document에 대한 기본 이벤트 방지
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            document.body.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        });

        // 드래그 시작
        document.body.addEventListener('dragenter', (e) => {
            overlay.style.display = 'flex'; // 드래그 시작 시 오버레이 표시
        });

        // 드래그 오버
        document.body.addEventListener('dragover', (e) => {
            overlay.style.display = 'flex'; // 드래그 오버 시 오버레이 표시
        });

        // 드래그 떠남
        document.body.addEventListener('dragleave', (e) => {
            if (!e.relatedTarget || !document.body.contains(e.relatedTarget)) {
                overlay.style.display = 'none'; // 드래그 떠날 때 오버레이 숨김
            }
        });

        // 드롭
        document.body.addEventListener('drop', (e) => {
            overlay.style.display = 'none'; // 드롭 시 오버레이 숨김
            const file = e.dataTransfer.files[0];
            if (file && file.name.toLowerCase().endsWith('.json')) {
                this.handleImport({ target: { files: [file] } });
            } else {
                alert('JSON 파일만 가져올 수 있습니다.');
            }
        });
    }

    showExportDialog() {
        document.getElementById('exportDialog').style.display = 'flex';
    }

    hideExportDialog() {
        document.getElementById('exportDialog').style.display = 'none';
    }

    exportAllPresets() {
        const fileName = document.getElementById('presetFileName').value.trim();

        // 파일명 검증
        if (!fileName) {
            alert('파일 이름을 입력해주세요.');
            return;
        }

        const totalPresets = parseInt(localStorage.getItem('totalPresets')) || 1;
        const presets = {};

        for (let i = 1; i <= totalPresets; i++) {
            const presetData = localStorage.getItem('preset' + i);
            if (presetData) {
                presets['preset' + i] = JSON.parse(presetData);
            }
        }

        if (Object.keys(presets).length === 0) {
            alert('내보낼 프리셋이 없습니다.');
            return;
        }

        const exportData = {
            presets: presets,
            totalPresets: totalPresets,
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        this.hideExportDialog();
    }

    handleImport(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importData = JSON.parse(e.target.result);
                    if (importData.presets && importData.totalPresets) {
                        // 기존 프리셋 삭제
                        const existingTotalPresets = parseInt(localStorage.getItem('totalPresets')) || 1;
                        for (let i = 1; i <= existingTotalPresets; i++) {
                            localStorage.removeItem('preset' + i);
                        }

                        // 프리셋 가져오기
                        for (let key in importData.presets) {
                            localStorage.setItem(key, JSON.stringify(importData.presets[key]));
                        }
                        localStorage.setItem('totalPresets', importData.totalPresets);

                        // 프리셋 재초기화
                        totalPresets = importData.totalPresets;
                        initializePresets();
                        loadPreset(1);

                        alert('프리셋을 성공적으로 가져왔습니다.');
                    } else {
                        alert('프리셋 파일 형식이 올바르지 않습니다.');
                    }
                } catch (error) {
                    alert('프리셋 파일을 불러오는데 실패했습니다.');
                }
            };
            reader.readAsText(file);
        }
    }
}

const presetManager = new PresetManager();


// 페이지 로드 시 데이터 로드
window.onload = function() {
    // 결과 영역 초기화
    document.getElementById('result').textContent = '';
    initializePresets(); // 프리셋 초기화
    loadPreset(currentPresetNumber); // 기본으로 현재 선택된 프리셋 로드

    // 폼 필드 가시성 초기화
    updateFormFieldVisibility();

    isDirty = false; // 페이지 로드 시 변경 사항 없음
};

