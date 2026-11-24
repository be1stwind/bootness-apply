/* 「인스타 수익화 스타터 키트」(옛 이름 「내 계정 찾기」) 웹 리워드 — 설정 (2026-11-16 뚝딱이 · MacminiM4, 한결 요청)
   위드선율 11/27(금) 밤 8시 무료특강 「인스타로 수익화 시작하기」 무료특강방 참여 리워드.
   화면 흐름은 app.js, 추천 주제는 data.js(99_자동화/내계정찾기_데이터넣기.py 가 만든다). 바꿀 곳은 대개 이 파일뿐이다.

   ▣ 전자책 링크 — 분야 id 마다 btns.kr 링크 하나. 비어 있으면 그 분야는 「전자책 받기」 칸이 「준비 중」으로 뜬다(신청도 안 받는다).
     ⚠️ 이 파일은 공개라 링크도 누구나 볼 수 있다(소스 보기). 회원 개인정보가 아니라 무료 전자책이라 이렇게 둔다.
   ▣ 동의 문구를 한 글자라도 고치면 CONSENT_VERSION 을 올린다 — 시트에 그때 문구 원문과 함께 남는다.
   ▣ 개인정보 수집·이용 [필수] 목적에는 홍보를 넣지 않는다 — 강의·이벤트 안내는 [선택] 광고성 정보 수신 쪽.
     (개인정보 보호법 제22조 제1항·제5항: 홍보 목적은 따로 동의받고, 선택에 동의 안 했다고 전자책을 안 주면 안 된다)
   ▣ 문자·카톡으로 광고를 보낼 때는 밤 9시~아침 8시를 피한다(정보통신망법 제50조 제3항 — 야간 동의는 받지 않았다) */
window.MYTOPIC = {
  name: '인스타 수익화 스타터 키트',      // 리워드 이름(11/17 다시 기획 — 옛 이름 「내 계정 찾기」). 화면 머리·카드에 쓴다. 표지 큰 제목 줄바꿈은 nameLines
  nameLines: ['인스타 수익화', '스타터 키트'],
  badge: '부트니스 11월 무료특강 참여 리워드',   // 11/20 대표 — 표지에는 강사님 이름을 넣지 않는다(부트니스 홍보를 겸하는 리워드)
  formId: 'mytopic2611',                // 백엔드 신청폼_백엔드.gs FORMS 의 키와 같아야 한다
  endpoint: 'https://script.google.com/macros/s/AKfycbxjd7-hFlao-hi2A-kB4Rg1OC1NbCBneBieqWA9lCkKUWk3c1Gv7D3hNlpKf6VloYnF/exec',   // 모든 신청폼 공통
  privacyUrl: 'https://apply.btns.kr/privacy/',

  EBOOKS: {                             // 분야별 전자책 부트링크(한결 11/16 · 홍보 화면 없음). ⚠️ 서버 신청폼_백엔드.gs FORMS.mytopic2611.mail.books 와 같게 — 메일 링크는 서버 목록을 쓴다
    money: 'https://btns.kr/eb-money-k28fo',
    saving: 'https://btns.kr/eb-saving-ebb4n',
    cook: 'https://btns.kr/eb-cook-ucni8',
    health: 'https://btns.kr/eb-health-mtrh2',
    beauty: 'https://btns.kr/eb-beauty-rd90r',
    kids: 'https://btns.kr/eb-kids-2d8sj',
    shop: 'https://btns.kr/eb-shop-5bwva',
    work: 'https://btns.kr/eb-work-ub6yy',
    hobby: 'https://btns.kr/eb-hobby-kvs2s',
    // 팔거리 있는 분(핏 2번 가게·지식) 유형별 판매자 전자책(한결 11/16)
    seller1: 'https://btns.kr/eb-seller1-zjtve',   // ① 지식 + 얼굴
    seller2: 'https://btns.kr/eb-seller2-35ih2',   // ② 가게
    seller3: 'https://btns.kr/eb-seller3-vwets'    // ③ 지식 + 얼굴 없이
  },

  live: {
    date: '11월 27일(금) 밤 8시',
    dateShort: '11/27(금) 밤 8시',   // 표지 카드 작은 줄
    title: '인스타로 수익화 시작하기',
    who: '위드선율 강사'
  },

  CONSENT_VERSION: '2026-11-20.1',     // 11/20 이메일 추가(사례 모음 링크를 메일로도 — 대표 「제출하는 순간 메일로 보내고」)
  privacy: {
    label: '[필수] 개인정보 수집·이용 동의',
    rows: [['수집 항목', '이름(또는 닉네임), 휴대폰 번호, 이메일, 진단 결과(내 유형·관심 분야)'],
           ['이용 목적', '사례 모음 제공(화면 · 이메일), 문의 응대'],
           ['보유 기간', '수집일로부터 3년간 보관하며, 기간 경과 후 파기합니다.'],
           ['동의 거부', '동의를 거부할 수 있으나, 거부 시 사례 모음을 받으실 수 없습니다. 진단 결과는 동의와 관계없이 보실 수 있습니다.']]
  },
  marketing: {
    label: '[선택] 광고성 정보 수신 동의',
    rows: [['수집 항목', '이름(또는 닉네임), 휴대폰 번호, 이메일'],          // 이메일을 받는 다른 폼(review)과 같은 결 — 11/20
           ['이용 목적', '부트니스 강의·무료특강·이벤트 안내 등 광고성 정보 전송'],
           ['전송 방법', '카카오톡, 문자, 이메일'],
           ['보유 기간', '동의일로부터 3년간 보관하며, 동의를 철회하시면 바로 파기합니다.'],
           ['동의 거부', '동의하지 않으셔도 사례 모음을 받으실 수 있습니다.']]
  }
};
