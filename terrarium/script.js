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
    if (terrariumElement) {
        terrariumElement.addEventListener('mousedown', dragMouseDown);
        terrariumElement.ondblclick = bringToFront; // 더블 클릭 이벤트 핸들러 등록
    }

    let offsetX = 0, offsetY = 0, startX = 0, startY = 0;

    function dragMouseDown(e) {
        e.preventDefault();
        startX = e.clientX;
        startY = e.clientY;
        document.addEventListener('mousemove', elementDrag);
        document.addEventListener('mouseup', stopElementDrag);
    }

    function elementDrag(e) {
        e.preventDefault();
        offsetX = e.clientX - startX;
        offsetY = e.clientY - startY;
        startX = e.clientX;
        startY = e.clientY;
        terrariumElement.style.position = 'absolute';
        terrariumElement.style.top = (terrariumElement.offsetTop + offsetY) + 'px';
        terrariumElement.style.left = (terrariumElement.offsetLeft + offsetX) + 'px';
    }

    function stopElementDrag() {
        document.removeEventListener('mousemove', elementDrag);
        document.removeEventListener('mouseup', stopElementDrag);
    }

    function bringToFront() {
        zIndexCounter++;
        terrariumElement.style.zIndex = zIndexCounter; // 요소를 가장 위로 가져오기
    }
}
//