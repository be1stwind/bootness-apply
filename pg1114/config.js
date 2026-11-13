/* 아이고빡시다(폐가콜렉터) 님 깜짝 특강 신청 — 11/14(토) (2026-11-13 뚝딱이 · MacminiM4 · 한결 의뢰)
   대표 11/13 원문: 「아이고빡시다(폐가콜렉터) 님의 깜짝 특강이 내일 갑자기 잡혀서 신청서와 단톡방 문안을 만들어줘. 강의비는 강의실비 1만원만 받고 뒷풀이가 있을거야」
   lecture2611 을 바탕으로 줄였다(구글 로그인 전 엔진 그대로 · googleLogin 없음).
   ▣ 참가비는 누구나 10,000원(강의실 비용 실비) · 계좌 입금만 — 카드·그로블·쿠폰·현금영수증 10% 덧붙임 모두 없음. 멤버십/비회원 금액 차이 없음.
   ▣ 멤버십 문항은 남겨 둔다 — 대상이 「멤버십」이면 비회원은 고르는 순간 멈춤 화면, 회원은 개인정보 동의 체크 없이 받는다(정기특강과 같은 규칙).
   ▣ 온라인 여부가 true 면 온오프라인 문항이 뜨고, false 면 모두 오프라인으로 적는다(computed).
   ▣ 아직 정하지 않은 값은 아래 「회차」에 중괄호+미정 글자로 둔다 → 신청페이지_올리기.sh 가 그 글자를 보면 한 파일도 안 올린다.
   ▣ 백엔드 FORMS.pg1114 → 「정기특강_신청명단」 시트 탭 「2611_아이고빡시다」. 마감·정원은 서버에도 같은 값을 넣는다.
   ▣ 미리보기: ?preview=1 처음부터 끝까지 · ?preview=done 끝 화면 · ?preview=stop&member=아니오 멤버십 대상 멈춤 화면 · ?preview=closed */

var 회차 = {
  formId:   'pg1114',
  endpoint: 'https://script.google.com/macros/s/AKfycbxjd7-hFlao-hi2A-kB4Rg1OC1NbCBneBieqWA9lCkKUWk3c1Gv7D3hNlpKf6VloYnF/exec',   // 모든 폼 공통
  강사: '아이고빡시다',
  title: '『5차 국가철도망 구축계획 발표 해설』 깜짝 특강',
  when: '11월 14일 (토) 오후 4시 ~ 7시',
  place: '영등포구청역 4번 출구 챌린지플레이스 (서울 영등포구 당산로38길 5, 3층)',
  online: false,
  정원: 56,
  대상: '누구나',
  deadline: '2026-11-13T12:00:00+09:00',  // 11/13 대표 「닫아둬」 — 잠정 연기, 원래 '2026-11-14T15:00:00+09:00'
  deadlineText: '<b>11월 14일(토) 오후 3시까지</b> 신청 가능합니다.',
  뒤풀이안내: '뒤풀이 비용은 참석하신 분들끼리 나눠 냅니다.',
  placeUrl: 'https://naver.me/GGGxFt0T',             // 8월 호완정 했던 곳(대표 11/13)
  대상안내: '🤝 <b>호완정 수강생 · 부트니스 멤버십 회원</b> 대상 네트워킹 특강입니다.',   // 대상은 「누구나」로 받되 안내만(한결 11/13)
  fee:      10000,                                   // 누구나 같은 금액 — 강의실 비용(대표 11/13)
  previewId: 'PG1114-SAMPLE00',
  account:  '카카오뱅크 3333-17-0228060 · 예금주 이진규',
  kakaoChannel: 'https://pf.kakao.com/_xmHxgNT'
};

/* ── 여기부터는 값이 바뀌어도 그대로 둔다 ─────────────────────────────── */
function won(n) { return Math.round(n).toLocaleString('ko-KR') + '원'; }
var 온라인 = 회차.online === true;
var 멤버십만 = 회차.대상 === '멤버십';
function offline(a) { return !온라인 || a.mode === '오프라인'; }

window.FORM = {
  formId: 회차.formId,
  endpoint: 회차.endpoint,
  deadline: 회차.deadline,
  previewId: 회차.previewId,
  keepDraft: true,
  privacyUrl: 'https://apply.btns.kr/privacy/',
  accent: '#383839',
  eyebrow: '부트니스 깜짝 특강',
  title: 회차.강사 + ' 님의 ' + 회차.title,
  heroLines: [
    '📅 일정 : <b>' + 회차.when + '</b>',
    '📍 장소 : <b>' + 회차.place + '</b>' + (회차.placeUrl ? ' <a href="' + 회차.placeUrl + '" target="_blank" rel="noopener">지도 보기</a>' : ''),
    온라인 ? '🖥️ <b>온라인 라이브</b>도 함께 진행됩니다.' : '🛑 <b>오프라인으로만</b> 진행됩니다.',
    typeof 회차.정원 === 'number' ? '👥 오프라인 <b>선착순 ' + 회차.정원 + '명</b>' : null,
    '💳 참가비 : <b>' + won(회차.fee) + '</b> (강의실 비용)',
    '🍻 강의가 끝나고 <b>뒤풀이</b>가 있습니다. ' + 회차.뒤풀이안내,
    멤버십만 ? '💛 이번 특강은 <b>부트니스 멤버십 회원</b>만 신청하실 수 있습니다.' : null,
    회차.대상안내 || null,
    '⚠️ ' + 회차.deadlineText
  ].filter(function (x) { return x; }),
  submitLabel: '신청서 제출',

  pages: [
    { title: '', fields: [
      { key: 'member', type: 'choice', label: "부트니스 '유료' 멤버십 회원인가요?", required: true, options: ['예', '아니오'] },
      { key: 'nick', type: 'text', label: '닉네임이 어떻게 되시나요? (한글로 입력하여 주세요)', required: true, maxlength: 40, autocomplete: 'nickname', err: '닉네임을 적어 주세요' },
      { key: 'name', type: 'text', label: '성함을 적어주세요.', required: true, maxlength: 30, autocomplete: 'name', err: '성함을 적어 주세요' },
      { key: 'phone', type: 'tel', label: '휴대폰 번호를 적어주세요.', hint: '숫자만 적어 주세요 (예: 01012345678)', required: true, autocomplete: 'tel' },
      { key: 'phone2', type: 'tel', label: '휴대폰 번호가 틀리면 안내가 불가하니 한 번 더 적어주세요.', required: true, mustEqual: 'phone', noSubmit: true,
        err: '위에 적은 번호와 똑같이 적어 주세요' },
      { key: 'email', type: 'email', label: '이메일 주소를 적어주세요.', hint: '신청 내용을 이 주소로 보내 드려요.', required: true, maxlength: 120,
        autocomplete: 'email', err: '이메일 주소를 다시 확인해 주세요' },
      /* 개인정보 동의 — 비회원만 체크(필수). 회원은 계약 이행이라 안내 한 줄 (정기특강과 같은 문구) */
      { key: 'privacy', type: 'consent', question: '개인 정보 수집 · 이용에 동의하시나요?', label: '네, 동의합니다.', required: true,
        showIf: function (a) { return a.member === '아니오'; },
        err: '개인 정보 수집·이용에 동의해야 신청할 수 있어요',
        notice: [['1. 개인 정보 수집·이용 목적 :', '강의 진행 및 안내, 자료배포 등'],
                 ['2. 수집하려는 개인정보의 항목 :', '성함, 휴대폰 번호, 이메일'],
                 ['3. 개인 정보의 보유 및 이용 기간 :', '3년'],
                 ['4. 개인 정보를 제공 받는 자 :', '부트니스 대표 및 스탭']] },
      { type: 'info', html: '적어 주신 정보(이메일 포함)는 이번 특강 안내와 진행에만 쓰고, 1년 뒤 지웁니다.',
        showIf: function (a) { return a.member === '예'; } }
    ] },

    { title: '강의 진행 관련 필요사항 설문', fields: [
      온라인 ? { key: 'mode', type: 'choice', label: '온오프라인 참석여부를 선택해주세요', required: true, options: ['온라인', '오프라인'] } : null,
      { key: 'afterparty', type: 'choice', label: '뒤풀이 참석여부를 선택해주세요. 원활한 진행을 위해 가부를 확실히 부탁드립니다.',
        required: true, options: ['참석', '불참'], showIf: offline, hint: 회차.뒤풀이안내 },
      { key: 'wish', type: 'textarea', label: '차후 원하는 종류의 특강이 있으면 적어주세요.', maxlength: 500 }
    ] },

    { title: '입금 정보 및 환불 관련 안내', fields: [
      { type: 'info', cls: 'kakao-note', html: '📱 <b>수강 방법과 강의 진행 안내는 카카오톡으로 보내 드려요.</b><br>신청서에 적은 휴대폰 번호로 갑니다. 번호가 틀리면 안내를 받을 수 없어요.' },
      { type: 'info', html: function () {
          return '입금계좌 : <b>' + 회차.account + '</b><br>' +
            '<span class="big">입금하실 금액 ' + won(회차.fee) + '</span> <span class="sub">(강의실 비용)</span>';
        } },
      { key: 'depositAck', type: 'ack', checkLabel: '예', required: true, err: '확인하고 「예」를 눌러 주세요', divider: true,
        label: '본 신청서를 제출하시면 계좌조회가 불가하며 입금이 완료되어야 신청이 완료된 것으로 봅니다. 숙지하셨나요?' },
      { key: 'depositor', type: 'text', label: '입금자명이 앞서 적은 성함과 다르면 입금자명을 적어주세요.', maxlength: 30 }
    ] }
  ],

  /* 시트 「안내금액」·「결제방식」·「온오프라인」 — 온라인을 열지 않으면 문항 없이 오프라인으로 적는다 */
  computed: function (a) { return { amount: won(회차.fee), payMethod: '계좌', mode: 온라인 ? (a.mode || '') : '오프라인' }; },

  stopIf: 멤버십만 ? function (a) { return a.member === '아니오'; } : null,

  done: function (a, res) {
    var mail = res && (res.mail === 'sent' || res.preview)
      ? '신청 내용을 <b>' + String(a.email || '').replace(/[&<>"']/g, '') + '</b> 주소로 보내 드렸어요. 메일이 안 보이면 스팸함도 봐 주세요.' : '';
    return {
      title: '신청서 제출이 완료되었어요',
      html: '<span class="paybox">입금하실 금액 <b>' + won(회차.fee) + '</b> <span class="sub">(강의실 비용)</span><br>' +
        '입금 계좌를 적어두는 것을 깜박하신 분은 아래 부트니스 카카오채널로 문의해 주세요.</span>' +
        '부트니스에서는 수강생의 귀한 비용과 시간이 아깝지 않은 강의 준비를 위해 최선을 다하고 있습니다.<br><br>부트니스의 다양한 강의 소식들을 가장 빨리 접하고 싶으시다면<br>카카오채널을 추가해주세요! 😄',
      button: { label: '부트니스 카카오채널 추가', href: 회차.kakaoChannel },
      note: mail
    };
  },
  closed: {
    title: '특강 일정 연기 안내',
    html: '아이고빡시다 님의 깜짝 특강은 일정이 미뤄졌습니다. 새 날짜가 정해지면 다시 안내드리겠습니다. 🙏<br><br>특강 공지는 <a href="https://btns.kr" target="_blank" rel="noopener">부트니스 네이버카페</a>에서 가장 빨리 접하실 수 있습니다. 😊'
  },
  full: function (a, res) {
    var n = (res && res.capacity) || '';
    if (res && res.part === '오프라인' && 온라인) return {
      title: '오프라인 자리가 모두 찼어요',
      html: '강의실 ' + (n ? n + '석이' : '자리가') + ' 모두 채워졌어요.<br>온라인 라이브로는 지금도 신청하실 수 있어요.',
      button: { label: '온라인으로 다시 고르기', back: true, clear: ['mode'] }
    };
    return {
      title: '부트니스 특강 모집마감 안내',
      html: '강의실 자리가 모두 채워져 이번 특강 접수는 마감되었습니다. 더 좋은 특강으로 찾아뵙겠습니다. 🙏'
    };
  },
  stop: {
    title: '이번 특강은 멤버십 회원 대상이에요',
    html: '부트니스 멤버십 회원만 신청하실 수 있어요. 다음 특강 소식은 부트니스 네이버카페와 카카오채널에서 가장 먼저 알려 드려요.',
    button: { label: '잘못 골랐어요, 돌아가기', back: true, clear: ['member'] }
  }
};
