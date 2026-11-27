/* 2026 부트니스 감사의 밤(송년회) 신청 — 2026-11-28 뚝딱이 · MacminiM4 (한결 요청 · 배포는 대표 「올려」 뒤 한결)
   apply.btns.kr/thanks2612/ · renew/apply 와 같은 계좌이체 꼴, lecture2611 과 같은 여러 쪽 꼴.
   ▣ 확정 값(한결 요청서 · 목표 문서 4절): 12/19(토) 저녁 6시 시작 · 6시 반 식사 · 밤 10시쯤 마침 · 회비 3만 원(현금영수증 3만 3천 원)
     · 계좌이체(renew 와 같은 계좌) · 회원 먼저 → 외부는 12/1부터 열 수 있음 · 신청 90명 · 마감 12/9(수) 밤 11시 59분.
   ▣ 장소 이름·주소는 화면에 쓰지 않는다 — 「참석이 확정된 분께 따로 안내」(한결 요청).
   ▣ 개인정보 동의는 회원·비회원 모두 체크(필수). 보관 기간은 개인정보처리방침 표(회원 1년 · 그 밖 3년)와 같다.
     동의 문구를 한 글자라도 고치면 consentVersion 을 올린다(서버가 문구 원문과 함께 시트에 적는다).
   ▣ 금액은 서버(FORMS.thanks2612.amountBy)가 다시 정한다. 화면 금액과 서버 금액이 같아야 입금 대조가 맞는다.
   ▣ 확인 메일은 보내지 않는다(renew 와 같다). 그래서 화면에 「메일로 보내 드립니다」를 쓰지 않는다.
   ▣ 미리보기(시트에 아무것도 안 적힌다): ?preview=1  처음부터 끝까지 · ?preview=done  끝 화면 · ?preview=closed  마감 화면
       ?preview=done&receipt=예  현금영수증을 고른 끝 화면 */

var 감사의밤 = {
  formId:   'thanks2612',                         // 백엔드 FORMS 키 → 「정기특강_신청명단」 시트의 탭 「2612_감사의밤」(12월은 정기특강 대신 송년회)
  endpoint: 'https://script.google.com/macros/s/AKfycbxjd7-hFlao-hi2A-kB4Rg1OC1NbCBneBieqWA9lCkKUWk3c1Gv7D3hNlpKf6VloYnF/exec',   // 모든 신청폼 공통 백엔드
  /* ── 여기 세 줄이 설정값이다 ───────────────────────────────── */
  외부신청: false,                                 // false = 멤버십 회원만 · true = 회원이 아닌 분도 · '2026-12-01T00:00:00+09:00' 처럼 시각을 적으면 그때부터 저절로 열림
  capacity: 90,                                    // 화면에 보이는 정원. 실제로 막는 건 서버 FORMS.thanks2612.capacity — 둘을 같게
  deadline: '2026-12-09T23:59:59+09:00',           // 12/9(수) 밤 11시 59분까지. 서버 deadline 과 같게. 화면의 마감 글자는 이 값에서 만든다
  /* ───────────────────────────────────────────────────────── */
  when:     '2026년 12월 19일(토) <span style="white-space:nowrap">저녁 6시 ~ 밤 10시쯤</span>',   // 폰에서 「밤 / 10시쯤」으로 끊기지 않게 시간은 한 덩어리로
  dinner:   '저녁 식사는 6시 반에 시작합니다.',
  fee: 30000, feeReceipt: 33000,                   // 현금영수증을 원하면 10% 더한 금액
  bank: '카카오뱅크', accountNo: '3333-17-0228060', holder: '이진규',   // renew/apply 와 같은 계좌
  kakaoChannel: 'https://pf.kakao.com/_xmHxgNT',
  previewId: 'TN2612-SAMPLE00'
};

function won(n) { return Math.round(n).toLocaleString('ko-KR') + '원'; }
/* 외부 신청이 열렸는가 — true/false 또는 시각 글자 */
function 외부열림() {
  var v = 감사의밤.외부신청;
  if (typeof v === 'string') { var t = new Date(v).getTime(); return !isNaN(t) && Date.now() >= t; }
  return v === true;
}
/* 마감 글자 — deadline 하나에서 만든다(설정과 화면 글자가 어긋나지 않게). 한국 시각 기준 */
function deadlineText() {
  var d = new Date(new Date(감사의밤.deadline).getTime() + 9 * 3600 * 1000);   // UTC 로 읽으면 한국 시각
  var h = d.getUTCHours(), m = d.getUTCMinutes();
  var part = h < 6 ? '새벽 ' : h < 12 ? '오전 ' : h === 12 ? '낮 ' : h < 18 ? '오후 ' : h < 21 ? '저녁 ' : '밤 ';
  var h12 = h > 12 ? h - 12 : (h === 0 ? 12 : h);
  return (d.getUTCMonth() + 1) + '월 ' + d.getUTCDate() + '일(' + '일월화수목금토'.charAt(d.getUTCDay()) + ') ' +
    part + h12 + '시' + (m ? ' ' + m + '분' : '');
}
/* 입금 상자 — renew/apply 와 같은 꼴(같은 크기 · 왼쪽 이름 회색 · 오른쪽 값 굵게) */
function payRow(k, v, sp) {
  return '<span style="display:flex;gap:12px;text-align:left"><span style="flex:none;width:3em;white-space:nowrap;font-weight:400;color:var(--sub)' +
    (sp ? ';letter-spacing:1em' : '') + '">' + k + '</span><b style="font-size:inherit;font-weight:700">' + v + '</b></span>';
}
function payAmount(a) { return (a && a.receipt) ? 감사의밤.feeReceipt : 감사의밤.fee; }
function payRows(a) {
  return payRow('은행', 감사의밤.bank, true) + payRow('계좌', 감사의밤.accountNo, true) + payRow('예금주', 감사의밤.holder) +
    payRow('금액', won(payAmount(a)) + ((a && a.receipt) ? ' (현금영수증 포함)' : ''), true);
}

var 회원선택지 = [{ label: '멤버십 회원', value: '예' }];
if (외부열림()) 회원선택지.push({ label: '아직 회원 아님', value: '아니오' });

window.FORM = {
  formId: 감사의밤.formId,
  endpoint: 감사의밤.endpoint,
  deadline: 감사의밤.deadline,
  previewId: 감사의밤.previewId,
  consentVersion: '2026-11-28.1',
  keepDraft: true,                                 // 새로고침해도 쓰던 답이 남는다(이 기기·이 탭에만). 제출·마감 때 지운다
  privacyUrl: 'https://apply.btns.kr/privacy/',
  accent: '#383839',
  eyebrow: '부트니스 송년회',
  title: '2026 부트니스 감사의 밤',
  heroLines: [
    '📅 일시 : <b>' + 감사의밤.when + '</b>',
    '🍽️ ' + 감사의밤.dinner,
    '📍 장소 : 참석이 확정된 분께 따로 안내해 드립니다.',
    '💳 회비 : <b>' + won(감사의밤.fee) + '</b> (현금영수증을 원하시면 ' + won(감사의밤.feeReceipt) + ') · 계좌이체',
    '👥 정원 : <b>' + 감사의밤.capacity + '명</b>',
    외부열림() ? null : '💛 지금은 <b>멤버십 회원</b> 신청을 먼저 받고 있습니다.',
    '⚠️ <b>' + deadlineText() + '까지</b> 신청하실 수 있습니다.'
  ].filter(function (x) { return x; }),
  submitLabel: '신청서 제출',
  sendingLabel: '보내는 중…',

  pages: [
    { title: '신청하시는 분', fields: [
      { key: 'member', type: 'choice', label: '부트니스 멤버십 회원이신가요?', required: true, options: 회원선택지,
        hint: 외부열림() ? '' : '지금은 멤버십 회원 신청만 받고 있습니다.', err: '회원 여부를 골라 주세요' },
      { key: 'nick', type: 'text', label: '카페·카카오톡에서 쓰시는 닉네임을 적어 주세요.', required: true, maxlength: 40, autocomplete: 'nickname',
        err: '닉네임을 적어 주세요' },
      { key: 'name', type: 'text', label: '성함을 적어 주세요.', required: true, maxlength: 30, autocomplete: 'name', err: '성함을 적어 주세요' },
      { key: 'phone', type: 'tel', label: '휴대폰 번호를 적어 주세요.', hint: '숫자만 적어 주세요 (예: 01012345678)', required: true, autocomplete: 'tel' },
      { key: 'phone2', type: 'tel', label: '휴대폰 번호를 한 번 더 적어 주세요.', required: true, mustEqual: 'phone', noSubmit: true,
        err: '위에 적은 번호와 똑같이 적어 주세요' },
      { key: 'email', type: 'email', label: '이메일 주소를 적어 주세요.', required: true, maxlength: 120, autocomplete: 'email',
        err: '이메일 주소를 다시 확인해 주세요' },
      /* 동의 칸 — 공문서체(alarm 과 같은 결). 보관 기간은 개인정보처리방침 4절 표와 같다 */
      { key: 'privacy', type: 'consent', question: '개인정보 수집·이용에 동의하십니까?', label: '동의합니다.', required: true, divider: true,
        err: '개인정보 수집·이용에 동의하셔야 신청하실 수 있습니다',
        notice: [['1. 목적 :', '2026 부트니스 감사의 밤 신청 접수, 참석 안내, 회비 입금 확인, 시상 추천 집계'],
                 ['2. 필수 항목 :', '멤버십 회원 여부, 닉네임, 성함, 휴대폰 번호, 이메일, 시상 추천 내용'],
                 ['3. 선택 항목 :', '내년에 바라는 점, 입금자명, 현금영수증 발급 번호'],
                 ['4. 보관 기간 :', '행사가 끝난 뒤 멤버십 회원은 1년, 회원이 아닌 분은 3년간 보관한 뒤 파기합니다. 현금영수증 번호는 발급 뒤 법이 정한 기간 동안 보관합니다.'],
                 ['5. 처리자 :', '부트니스 대표 및 스태프'],
                 ['6. 동의 거부 :', '동의를 거부하실 수 있으며, 거부하시면 감사의 밤 신청이 되지 않습니다.']] }
    ] },

    { title: '시상 추천과 바라는 점', fields: [
      { key: 'award', type: 'textarea', label: '올해 시상식에 추천하고 싶은 분과 그 이유를 적어 주세요.', required: true, maxlength: 500,
        hint: '추천하시는 분의 닉네임과 이유를 함께 적어 주세요.', err: '추천하고 싶은 분과 이유를 적어 주세요' },
      { key: 'wish', type: 'textarea', label: '내년 부트니스에 바라는 점이 있으면 적어 주세요.', maxlength: 500 }
    ] },

    { title: '회비 입금 안내', fields: [
      { type: 'info', html: function (a) { return payRows(a); } },
      { key: 'receipt', type: 'ack', checkLabel: '예, 발급해 주세요', checkValue: '예', divider: true,
        label: '현금영수증이 필요하시면 회비에 10%(부가세)를 더한 ' + won(감사의밤.feeReceipt) + '을 입금해 주세요.' },
      { key: 'receiptNo', type: 'text', label: '현금영수증을 받으실 휴대폰 번호 또는 사업자 번호를 적어 주세요.', maxlength: 20,
        showIf: function (a) { return !!a.receipt; }, requiredIf: function (a) { return !!a.receipt; },
        err: '현금영수증을 받으실 번호를 적어 주세요' },
      { key: 'depositAck', type: 'ack', checkLabel: '예, 확인했습니다', checkValue: '예', required: true, err: '확인하고 「예, 확인했습니다」를 눌러 주세요',
        label: '회비 입금까지 마치셔야 신청이 끝납니다. 확인하셨나요?' },
      { key: 'depositor', type: 'text', label: '입금자명이 앞서 적은 성함과 다르면 입금자명을 적어 주세요.', maxlength: 30 }
    ] }
  ],

  /* 시트 「안내금액」·「결제방식」 — 서버가 금액을 다시 정하지만 같은 값을 보낸다 */
  computed: function (a) { return { amount: won(payAmount(a)), payMethod: '계좌' }; },

  done: function (a) {
    return {
      title: '감사의 밤 신청이 접수되었습니다',
      html: '<span class="paybox">' + payRows(a) + '</span>' +
        '회비 입금까지 마치셔야 신청이 끝납니다.<br>장소는 참석이 확정된 분께 따로 안내해 드립니다.<br>궁금한 점은 카카오채널로 문의해 주세요.',
      button: { label: '부트니스 카카오채널', href: 감사의밤.kakaoChannel }
    };
  },
  closed: {
    title: '감사의 밤 신청이 마감되었습니다',
    html: '궁금한 점은 <a href="https://pf.kakao.com/_xmHxgNT" target="_blank" rel="noopener">부트니스 카카오채널</a>로 문의해 주세요.'
  },
  /* 정원이 찼을 때 — 서버가 error: 'full' · capacity 로 답한다. 숫자는 서버 값을 쓴다 */
  full: function (a, res) {
    var n = (res && res.capacity) || 감사의밤.capacity;
    return {
      title: '감사의 밤 신청 자리가 모두 찼습니다',
      html: '정원 ' + n + '명이 모두 채워졌습니다.<br>궁금한 점은 카카오채널로 문의해 주세요.',
      button: { label: '부트니스 카카오채널', href: 감사의밤.kakaoChannel }
    };
  }
};
