/* 다음 무료특강 알림 신청 — 설정 초안 (2026-11-18 한결 · MacminiM4 · 배포 전 · 대표 「시작해」 활성화 작업 처방 1)

   ▣ 이 폼이 하는 일: 무료특강방(익명 1,800명)과 카페에서 「다음 특강 소식을 받고 싶은 사람」의 연락처를 받는다.
     11/04 무료특강방에서 다시보기 마감 뒤 「놓쳤는데 볼 방법 없나요」가 나왔지만 받아 둘 곳이 없었다(02_무료특강방_진단.md).
     특강이 끝나면 방에서 나가는 사람이 들어오는 사람보다 많다(10/30~11/08 들어옴 60 · 나감 111).
   ▣ 쓰는 곳: 다시보기 마감 공지 끝 · 무료특강방 맨 위 공지 · 카페 대문 · 공지마다 끝 한 줄. 링크는 부트링크(btns.kr/next 가안).
   ▣ 리워드를 약속하지 않는다. 받는 것은 「다음 무료특강이 열리면 가장 먼저 알려 드림」 하나뿐 — 지킬 수 있는 약속만.
   ▣ 광고성 정보: 「다음 특강 소식」은 광고성 정보라서 수신 동의를 따로 받는다(정보통신망법 50조). 이 폼은 소식을 받는 것이
     목적이라 수신 동의 없이는 신청할 이유가 없다 → 필수 체크로 두되 문구에 「받기 싫으면 언제든 끊을 수 있다」를 넣었다.
     ⚠️ 배포 전 이음이(CRM)·privacy-kr 로 「필수 동의에 광고 수신을 넣어도 되는지」 한 번 더 본다(결재에 같이 올림).
   ▣ 서버(신청폼_백엔드.gs)에 FORMS.alarm 을 새로 넣어야 한다 — 「다음특강_알림신청」 탭(통합원장 시트 또는 무료특강 명단 시트).
     칸: 타임스탬프·신청번호·닉네임·휴대폰·관심주제·놓친특강·하고싶은말·유입경로(?src=)·개인정보동의(+일시)·수신동의(+일시)·동의문구판.
     확인 메일은 보내지 않는다(이메일을 받지 않음). 배포는 대표 「올려」 뒤.
   ▣ 미리보기: ?preview=1 (제출해도 안 보낸다) · ?preview=done */

window.FORM = {
  formId: 'alarm',
  endpoint: 'https://script.google.com/macros/s/AKfycbxjd7-hFlao-hi2A-kB4Rg1OC1NbCBneBieqWA9lCkKUWk3c1Gv7D3hNlpKf6VloYnF/exec',   // 모든 신청폼 공통
  deadline: '2027-12-31T23:59:00+09:00',   // 상시 폼 — 마감 없음(1년마다 다시 본다)
  previewId: 'AL-SAMPLE00',
  keepDraft: true,
  privacyUrl: 'https://apply.btns.kr/privacy/',
  accent: '#383839',
  eyebrow: '부트니스 무료특강',
  title: '다음 무료특강, 가장 먼저 알려 드릴게요',
  heroLines: [
    '📣 부트니스 무료특강은 보통 한 달에 한 번 열려요.',
    '🔔 새 특강 <b>신청이 시작되는 날</b> 카카오톡·문자로 알려 드려요.',
    '🙅 특강·강의 소식만 보내고, 원하실 때 언제든 끊을 수 있어요.'
  ],
  banner: '',
  submitLabel: function () { return '알림 신청하기'; },
  sendingLabel: function () { return '보내는 중…'; },

  pages: [
    { title: '', fields: [
      { key: 'nick', type: 'text', label: '닉네임이나 성함을 적어 주세요.', hint: '카페·단톡방에서 쓰시는 이름이면 좋아요.', required: true, maxlength: 40, autocomplete: 'nickname', err: '닉네임이나 성함을 적어 주세요' },
      { key: 'phone', type: 'tel', label: '알림 받을 휴대폰 번호를 적어 주세요.', hint: '숫자만 적어 주세요 (예: 01012345678)', required: true, autocomplete: 'tel', confirmLine: true },
      { key: 'topics', type: 'multi', label: '어떤 주제의 특강 소식을 받고 싶으세요?', hint: '여러 개 골라도 돼요', required: true,
        options: ['부동산 투자', '재개발·재건축', '경매', '청약·내 집 마련', '주식', '세금', 'AI 활용', '인스타·SNS 수익화', '부업·창업'] },
      { key: 'missed', type: 'choice', label: '혹시 놓쳐서 아쉬운 특강이 있으셨나요?',
        options: ['네, 다시보기를 놓쳤어요', '라이브 시간이 안 맞았어요', '아니요, 소식만 받고 싶어요'] },
      { key: 'wish', type: 'textarea', label: '듣고 싶은 특강이 있으면 적어 주세요.', maxlength: 300 },
      { key: 'privacy', type: 'consent', question: '개인 정보 수집 · 이용에 동의하시나요?', label: '네, 동의합니다.', required: true,
        err: '개인 정보 수집·이용에 동의해야 알림을 신청할 수 있어요',
        notice: [['1. 수집·이용 목적 :', '다음 무료특강 알림 발송'],
                 ['2. 수집 항목 :', '닉네임 또는 성함, 휴대폰 번호, 관심 주제'],
                 ['3. 보유·이용 기간 :', '3년, 또는 수신을 끊으실 때까지'],
                 ['4. 제공받는 자 :', '부트니스 대표 및 스탭']] },
      { key: 'marketing', type: 'consent', label: '특강 소식 받기에 동의합니다.', required: true,
        err: '알림을 보내 드리려면 소식 받기 동의가 필요해요',
        notice: '부트니스 무료특강·강의 소식을 카카오톡·문자로 받습니다. 3년간 보관하고, 받은 문자의 수신거부 안내나 카카오채널로 언제든 끊을 수 있습니다.' }
    ] }
  ],

  computed: function () { return {}; },

  done: function () {
    return {
      title: '알림 신청이 완료되었어요',
      html: '다음 무료특강 신청이 시작되면 가장 먼저 알려 드릴게요. 🔔<br><br>지난 특강 이야기와 후기는 부트니스 네이버 카페에서 볼 수 있어요.',
      button: { label: '부트니스 네이버 카페', href: 'https://btns.kr' }
    };
  },
  closed: {
    title: '지금은 알림 신청을 받지 않아요',
    html: '특강 소식은 <a href="https://btns.kr" target="_blank" rel="noopener">부트니스 네이버카페</a>에서 가장 빨리 보실 수 있어요. 😊'
  }
};
