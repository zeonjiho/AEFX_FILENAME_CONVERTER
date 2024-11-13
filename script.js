        // 프리셋 번호 관리
        let currentPresetNumber = 1;
        let totalPresets = 1;
        const maxPresets = 15;

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
    button.onclick = function() { loadPreset(presetNumber); };
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
                    version_final: 1 // version_final을 1로 설정
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
                    if (confirm('Preset ' + totalPresets + ' has data. Do you really want to delete it?')) {
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
            displayPresetMessage('No data to save.', false);
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

        // 버전 상태에 따른 버전 번호 업데이트
        if (versionState === 'prev') {
            presetData.version_prev = versionNumber;
        } else if (versionState === 'final') {
            presetData.version_final = versionNumber;
        }

        localStorage.setItem('preset' + currentPresetNumber, JSON.stringify(presetData));
        displayPresetMessage('Preset ' + currentPresetNumber + ' saved.', true);
        updateTooltip(currentPresetNumber);
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

                displayPresetMessage('Preset ' + presetNumber + ' loaded.', true);
            } else {
                displayPresetMessage('No data in preset ' + presetNumber + '.', false);
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
            }
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
            // 업데이트된 버전 번호를 프리셋 데이터에 저장
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
        });

        // 현재 프리셋 리셋
        function resetCurrentPreset() {
            if (confirm('현재 프리셋의 모든 데이터를 삭제하시겠습니까?')) {
                localStorage.removeItem('preset' + currentPresetNumber);
                displayPresetMessage('Preset ' + currentPresetNumber + ' reset.', false);
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
            }
        }

        // 모든 데이터 리셋
        function resetAllData() {
            if (confirm('모든 데이터와 프리셋을 삭제하시겠습니까?')) {
                localStorage.clear();
                displayPresetMessage('All data reset.', false);
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
            }
        }

        function convertAndCopy() {
            // 입력 검증
            const projectNameInput = document.getElementById('projectName');
            const productInput = document.getElementById('product');
            const cutNameInput = document.getElementById('cut_name');
            const founderInput = document.getElementById('founder');
        
            if (!projectNameInput.checkValidity() || !productInput.checkValidity() || !cutNameInput.checkValidity() || !founderInput.checkValidity()) {
                alert('Project Name, Product, Cut Name 필드에는 영어와 숫자만 입력 가능합니다. Founder 필드에는 영어만 입력 가능합니다.');
                return;
            }
        
            let versionNumber = document.getElementById('version').value;
            let versionFormatted = 'v' + ('000' + versionNumber).slice(-3);
        
            // Frame Number Length 값 가져오기 (기본값은 4로 설정)
            const frameNumberLength = parseInt(document.getElementById('frame-number').value) || 4;
            const framePlaceholder = '#'.repeat(frameNumberLength);  // Frame Number Length에 맞춰 # 개수 설정
        
            // 필드 수집
            const fields = [
                document.getElementById('projectName').value,
                document.getElementById('product').value,
                document.getElementById('cut_name').value,
                document.getElementById('colorspace').value,
            ];
        
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
        
            fields.push(
                document.getElementById('product_type').value,
                document.getElementById('founder').value,
                document.getElementById('version-state').value,
                versionFormatted
            );
        
            const nonEmptyFields = fields.filter(field => field && field.trim() !== '');
        
            let result = nonEmptyFields.join('_') + '.' + framePlaceholder;
        
            document.getElementById('result').textContent = result;
        
            // `#result`에 `visible` 클래스 추가하여 페이드 인 효과 적용
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

        // 페이지 로드 시 데이터 로드
        window.onload = function() {
            // 결과 영역 초기화
            document.getElementById('result').textContent = '';
            initializePresets(); // 추가된 부분: 프리셋 초기화
            loadPreset(currentPresetNumber); // 기본으로 현재 선택된 프리셋 로드
        };
