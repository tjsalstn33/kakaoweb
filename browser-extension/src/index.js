// 폼 필드 선택
const form = document.querySelector('.form-data');
const region = document.querySelector('.region-name');
const apiKey = document.querySelector('.api-key');

// 결과 및 로딩 상태 선택
const errors = document.querySelector('.errors');
const loading = document.querySelector('.loading');
const resultContainer = document.querySelector('.result'); // 전체 result div 선택
const usage = document.querySelector('.carbon-usage');
const fossilfuel = document.querySelector('.fossil-fuel');
const myregion = document.querySelector('.my-region');
const clearBtn = document.querySelector('.clear-btn');

// 이벤트 리스너 설정
form.addEventListener('submit', handleSubmit);
clearBtn.addEventListener('click', reset);

// 초기화 함수 호출
init();

// 초기화 함수: 저장된 데이터에 따라 초기 화면 설정
function init() {
    const storedApiKey = localStorage.getItem('apiKey');
    const storedRegion = localStorage.getItem('regionName');

    if (!storedApiKey || !storedRegion) {
        // 폼이 보이고 결과와 로딩은 숨김
        form.style.display = 'block';
        resultContainer.style.display = 'none';
        loading.style.display = 'none';
        clearBtn.style.display = 'none';
        errors.textContent = ""; // 오류 메시지 초기화
    } else {
        // 저장된 데이터가 있을 경우 즉시 결과 표시
        displayCarbonUsage(storedApiKey, storedRegion);
    }
}

// 폼 제출 이벤트 핸들러
function handleSubmit(event) {
    event.preventDefault();
    const apiKeyValue = apiKey.value.trim();
    const regionValue = region.value.trim();

    if (apiKeyValue && regionValue) {
        setUpUser(apiKeyValue, regionValue);
        errors.textContent = ""; // 오류 메시지 초기화
        form.style.display = 'none';
        resultContainer.style.display = 'block';
        loading.style.display = 'none';
        clearBtn.style.display = 'block';
    } else {
        errors.textContent = "Please enter both Region Name and API Key.";
    }
}

// 사용자 설정 및 즉시 결과 화면 표시
function setUpUser(apiKey, regionName) {
    localStorage.setItem('apiKey', apiKey);
    localStorage.setItem('regionName', regionName);

    form.style.display = 'none';
    displayCarbonUsage(apiKey, regionName); // 로딩 화면 없이 바로 결과 화면 표시
}

// 데이터 표시 함수
function displayCarbonUsage(apiKey, region) {
    loading.style.display = 'none'; // 로딩을 생략
    resultContainer.style.display = 'block';

    // 실제 API 호출을 위한 자리표시 데이터를 설정합니다.
    myregion.textContent = region;
    usage.textContent = "292 grams (grams CO₂ emitted per kilowatt hour)";
    fossilfuel.textContent = "55.41% (percentage of fossil fuels used to generate electricity)";

    // Change region 버튼 보이기
    clearBtn.style.display = 'block';
}

// 리셋 함수
function reset(event) {
    event.preventDefault();
    localStorage.removeItem('apiKey');
    localStorage.removeItem('regionName');
    form.reset();
    init();
}
