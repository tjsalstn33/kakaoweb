document.addEventListener("DOMContentLoaded", () => {
    console.log(document.getElementById('plant1'));
    dragElement(document.getElementById('plant1'));
    dragElement(document.getElementById('plant2'));
    dragElement(document.getElementById('plant3'));
    dragElement(document.getElementById('plant4'));
    dragElement(document.getElementById('plant5'));
    dragElement(document.getElementById('plant6'));
    dragElement(document.getElementById('plant7'));
    dragElement(document.getElementById('plant8'));
    dragElement(document.getElementById('plant9'));
    dragElement(document.getElementById('plant10'));
    dragElement(document.getElementById('plant11'));
    dragElement(document.getElementById('plant12'));
    dragElement(document.getElementById('plant13'));
    dragElement(document.getElementById('plant14'));
});

let zIndexCounter = 1; // z-index 값을 관리하기 위한 변수

function dragElement(terrariumElement) {
    let pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
    
    if (terrariumElement) { // 요소가 존재하는지 확인
        terrariumElement.style.position = 'absolute'; // 요소의 위치를 절대값으로 설정하여 이동 가능하게 만듦
        terrariumElement.onpointerdown = pointerDrag;
        terrariumElement.ondblclick = bringToFront; // 더블 클릭 이벤트 핸들러 등록
    }

    function pointerDrag(e) {
        e.preventDefault();
        console.log(e);
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onpointermove = elementDrag;
        document.onpointerup = stopElementDrag;
    }

    function elementDrag(e) {
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        console.log(pos1, pos2, pos3, pos4);
        terrariumElement.style.top = (terrariumElement.offsetTop - pos2) + 'px';
        terrariumElement.style.left = (terrariumElement.offsetLeft - pos1) + 'px';
    }

    function stopElementDrag() {
        document.onpointerup = null;
        document.onpointermove = null;
    }

    function bringToFront(e) {
        e.preventDefault(); // 기본 동작 방지
        zIndexCounter++; // z-index 카운터 증가
        terrariumElement.style.zIndex = zIndexCounter; // 현재 요소를 가장 위로 가져오기
        console.log(`Element brought to front with z-index: ${zIndexCounter}`); // 로그 추가
    }
}
