/* 부트니스 소식 받기 동의 — 설정 초안 (2026-11-18 한결 · MacminiM4 · 배포 전 · 활성화 처방 03-07 C-0)

   ▣ 하는 일: 12월 만기 193명 중 광고 수신 동의가 살아 있는 분이 원장상 64명뿐이라(11/18 통합원장 동의 탭),
     멤버십 · 강의 · 특강 소식을 카카오톡 · 문자로 받을지 다시 여쭙는다. 혜택 · 가격 · 연장 · 마감 말은 넣지 않는다(GPT 2차 검토 8).
   ▣ alarm(다음 무료특강 알림)과 같은 엔진 · 같은 동의 구조. 범위만 「강의 · 특강 · 멤버십 소식」으로 넓다.
   ▣ 서버 FORMS.news 필요 — 탭 「소식받기_동의」, 칸: 타임스탬프 · 신청번호 · 닉네임 · 휴대폰 · 받을 소식 · 유입경로 · 개인정보동의(+일시) · 소식동의(+일시) · 동의문구판 · 수신거부일.
     통합원장 동의 탭 「광고수신동의」에 붙도록 통합원장 연동에 탭 추가. 배포는 대표 「올려」 뒤, 동의 문구는 이음이 · privacy-kr 확인 뒤.
   ▣ 미리보기: ?preview=1 */

window.FORM = {
  formId: 'news',
  endpoint: 'https://script.google.com/macros/s/AKfycbxjd7-hFlao-hi2A-kB4Rg1OC1NbCBneBieqWA9lCkKUWk3c1Gv7D3hNlpKf6VloYnF/exec',   // 모든 신청폼 공통
  deadline: '2027-12-31T23:59:00+09:00',   // 상시 폼 — 2027-12-01 에 한결이 다시 보고 늘림(GPT 검토 23)
  previewId: 'NW-SAMPLE00',
  keepDraft: false,                                   // 개인정보를 브라우저에 남기지 않는다(GPT 검토 7)
  privacyUrl: 'https://apply.btns.kr/privacy/',
  accent: '#383839',
  eyebrow: '부트니스 소식 받기',
  title: '부트니스 소식, 받아 보실래요?',
  heroLines: [
    '📣 강의 · 특강 · 멤버십 소식을 카카오톡 · 문자로 보내 드려요.',
    '🙅 받기로 하신 분께만 보내고, 원하실 때 언제든 끊을 수 있어요.',
    '💛 동의하지 않으셔도 지금 이용하시는 멤버십 혜택은 그대로예요.'
  ],
  banner: '',
  submitLabel: function () { return '소식 받기'; },
  sendingLabel: function () { return '보내는 중…'; },

  pages: [
    { title: '', fields: [
      { key: 'nick', type: 'text', label: '닉네임이나 성함을 적어 주세요.', hint: '카페·단톡방에서 쓰시는 이름이면 좋아요.', maxlength: 40, autocomplete: 'nickname' },
      { key: 'phone', type: 'tel', label: '알림 받을 휴대폰 번호를 적어 주세요.', hint: '숫자만 적어 주세요 (예: 01012345678)', required: true, autocomplete: 'tel', confirmLine: true },
      { key: 'topics', type: 'multi', label: '받고 싶은 소식을 골라 주세요.', hint: '여러 개 골라도 돼요', required: true,
        options: ['무료특강', '정기특강', '정규강의', '멤버십'] },
      { key: 'privacy', type: 'consent', question: '개인 정보 수집 · 이용에 동의하시나요?', label: '네, 동의합니다.', required: true,
        err: '개인 정보 수집·이용에 동의해야 알림을 신청할 수 있어요',
        notice: [['1. 목적 :', '고르신 강의 · 특강 · 멤버십 소식 보내기'],
                 ['2. 필수 항목 :', '휴대폰 번호, 받을 소식'],
                 ['3. 선택 항목 :', '닉네임 또는 성함, 들어온 경로'],
                 ['4. 보관 기간 :', '신청일부터 3년. 그 전에 수신을 끊으시면 그때 지웁니다'],
                 ['5. 다루는 사람 :', '부트니스 대표 및 스탭(다른 곳에 주지 않습니다)'],
                 ['6. 거부할 권리 :', '동의하지 않으셔도 되고, 그러면 소식만 가지 않아요. 멤버십 · 카페 · 특강 이용에는 아무 불이익이 없어요']] },
      { key: 'marketing', type: 'consent', label: '고른 소식(광고성 정보) 받기에 동의합니다.', required: true,
        err: '소식을 보내 드리려면 동의가 필요해요',
        notice: '부트니스가 고르신 강의 · 특강 · 멤버십 소식을 카카오톡 · 문자로 보내 드립니다. 문자의 무료 수신거부 번호나 부트니스 카카오채널로 언제든 끊을 수 있어요.' }
    ] }
  ],

  computed: function () { return {}; },

  done: function () {
    return {
      title: '소식 받기 신청이 완료되었어요',
      html: '고르신 소식을 보내 드릴게요. 🔔<br><br>원하실 때 언제든 끊을 수 있어요.',
      button: { label: '부트니스 네이버 카페', href: 'https://btns.kr' }
    };
  },
  closed: {
    title: '지금은 알림 신청을 받지 않아요',
    html: '특강 소식은 <a href="https://btns.kr" target="_blank" rel="noopener">부트니스 네이버카페</a>에서 가장 빨리 보실 수 있어요. 😊'
  }
};
