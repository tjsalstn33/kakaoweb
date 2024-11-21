document.addEventListener('DOMContentLoaded', () => {
  const factElement = document.getElementById('cat-fact');
  const gifElement = document.getElementById('cat-gif');
  const giphyApiKey = 'api-key';
  const deeplApiKey = 'api-key';

  // Cat Facts API에서 랜덤 고양이 사실 가져오기
  fetch('https://cat-fact.herokuapp.com/facts/random')
      .then(response => {
          if (!response.ok) {
              throw new Error('Cat Facts API 응답 실패');
          }
          return response.json();
      })
      .then(data => {
          const catFact = data.text; // 영어 또는 러시아어 텍스트
          console.log('받아온 고양이 사실:', catFact);

          // DeepL API를 사용하여 텍스트를 한국어로 번역
          return fetch('https://api-free.deepl.com/v2/translate', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
              },
              body: new URLSearchParams({
                  auth_key: deeplApiKey, // DeepL API 키
                  text: catFact,         // 번역할 텍스트
                  target_lang: 'KO'      // 타겟 언어: 한국어
              })
          });
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('DeepL API 응답 실패');
          }
          return response.json();
      })
      .then(translationData => {
          const translatedFact = translationData.translations[0].text; // 번역된 텍스트
          console.log('번역된 고양이 사실:', translatedFact);
          factElement.textContent = translatedFact;

          // GIPHY API에서 고양이 관련 GIF 가져오기
          return fetch(`https://api.giphy.com/v1/gifs/search?api_key=${giphyApiKey}&q=cat&limit=20`);
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('GIPHY API 응답 실패');
          }
          return response.json();
      })
      .then(gifData => {
          if (gifData.data.length > 0) {
              const randomIndex = Math.floor(Math.random() * gifData.data.length);
              const gifUrl = gifData.data[randomIndex].images.fixed_height.url;
              console.log('선택된 GIF URL:', gifUrl);
              gifElement.src = gifUrl;
          } else {
              gifElement.alt = "GIF를 찾을 수 없습니다.";
          }
      })
      .catch(error => {
          console.error('에러 발생:', error);
          factElement.textContent = "데이터를 불러오는 중 오류가 발생했습니다.";
          gifElement.alt = "이미지를 로드할 수 없습니다.";
      });
});
