/* 멤버십 연장 신청 (계좌이체) — 2026-11-26 한결 · MacminiM4
   대표 11/26 「연장은 B로 해줘」(B = 연장 신청서 + 계좌이체) · 「ㅇㅇ 그렇게 적으면 돼」(12/21부터 24만 원 → 입금액 26만 4천 원).
   ▣ 값: 1년 12만 원(부가세 별도) = 입금액 132,000원 · 12월 20일(일) 밤 12시까지 입금한 분까지.
         12월 21일(월) 0시부터는 24만 원(부가세 별도) = 입금액 264,000원. 시각이 지나면 화면 금액이 저절로 바뀐다(PRICE_SWITCH).
   ▣ 신청하는 사람은 모두 멤버십 회원 → 개인정보 동의 체크 없이 안내 한 줄(정기특강 회원과 같은 규칙, 계약 이행).
     서버에는 member '예' 를 실어 보낸다(computed) — 백엔드 FORMS.renew2612 memberNoConsent 로 받는다.
   ▣ 현금영수증은 선택. 부가세가 이미 입금액에 들어 있어 추가 금액이 없다.
   ▣ 입금 대조: 「카카오뱅크_입금기록」 강의목록 탭에 이 탭을 한 줄 넣으면, 안내금액과 같은 입금 + 성함·입금자명으로 맞춘다.
   ▣ 미리보기(시트에 아무것도 안 적힌다): ?preview=1  처음부터 끝까지 · ?preview=done  끝 화면 */

var 연장 = {
  formId:   'renew2612',
  endpoint: 'https://script.google.com/macros/s/AKfycbxjd7-hFlao-hi2A-kB4Rg1OC1NbCBneBieqWA9lCkKUWk3c1Gv7D3hNlpKf6VloYnF/exec',   // 신청서 백엔드(정기특강과 같은 곳)
  account:  '카카오뱅크 3333-17-0228060<br>예금주 이진규',
  kakaoChannel: 'https://pf.kakao.com/_xmHxgNT',
  PRICE_SWITCH: '2026-12-21T00:00:00+09:00',
  early: { fee: 120000, total: 132000 },
  late:  { fee: 240000, total: 264000 },
  previewId: 'MR2612-SAMPLE00'
};

function won(n) { return Math.round(n).toLocaleString('ko-KR') + '원'; }
function man(n) { return (n / 10000) + '만 원'; }
function late() { return Date.now() >= new Date(연장.PRICE_SWITCH).getTime(); }
function price() { return late() ? 연장.late : 연장.early; }
function amountTag() { return '1년 ' + man(price().fee) + ' + 부가세 ' + won(price().total - price().fee); }

window.FORM = {
  formId: 연장.formId,
  endpoint: 연장.endpoint,
  previewId: 연장.previewId,
  keepDraft: true,
  privacyUrl: 'https://apply.btns.kr/privacy/',
  accent: '#383839',
  eyebrow: '부트니스 멤버십',
  title: '멤버십 연장 신청',
  /* 11/26 대표 「마감과 연장의 단어 폭을 맞추고 연장혜택 마감일자 같은건 강조를 좀 해야되지 않을까? (색으로)
     그리고 12월 20일 까지 연장하면 50% 할인된 가격으로 연장할 수 있다. 는 식으로 혜택 안내를 적는게 좋을 듯」 */
  heroLines: function () {
    var K = function (t) { return '<span style="display:inline-block;width:3em;text-align:justify;text-align-last:justify">' + t + '</span> '; };
    var HOT = function (t) { return '<b style="color:var(--err)">' + t + '</b>'; };
    return late()
      ? [K('연장가') + '<b>1년 ' + man(연장.late.fee) + '</b> (부가세 별도)']
      : ['🎁 ' + HOT('12월 20일(일)까지') + ' 연장하시면 <span style="white-space:nowrap">' + HOT('50% 할인') + '된 가격으로</span> 연장하실 수 있어요.',
         K('연장가') + '<b>1년 ' + man(연장.early.fee) + '</b> (부가세 별도)',
         K('마감') + HOT('12월 20일(일) 밤 12시까지 입금'),
         '12월 21일(월)부터는 1년 ' + man(연장.late.fee) + '(부가세 별도)입니다.'];
  },

  pages: [
    { title: '', fields: [
      { key: 'name', type: 'text', label: '성함을 적어 주세요.', required: true, maxlength: 30, autocomplete: 'name', err: '성함을 적어 주세요' },
      { key: 'phone', type: 'tel', label: '휴대폰 번호를 적어 주세요.', hint: '숫자만 적어 주세요 (예: 01012345678)', required: true, autocomplete: 'tel' },
      { key: 'phone2', type: 'tel', label: '휴대폰 번호를 한 번 더 적어 주세요.', required: true, mustEqual: 'phone', noSubmit: true,
        err: '위에 적은 번호와 똑같이 적어 주세요' },
      { type: 'info', html: '적어 주신 정보는 멤버십 연장 확인과 안내에만 씁니다.' },

      { type: 'info', divider: true, html: function () {
          return '입금계좌<br><b>' + 연장.account + '</b><br>' +
            '<span class="big">입금하실 금액 ' + won(price().total) + '</span> <span class="sub">(' + amountTag() + ')</span>';
        } },
      { key: 'depositor', type: 'text', label: '입금자명이 앞서 적은 성함과 다르면 입금자명을 적어 주세요.', maxlength: 30 },
      { key: 'receipt', type: 'ack', checkLabel: '예', divider: true,
        label: '현금영수증 발급을 원하시면 「예」를 눌러 주세요. 부가세가 입금액에 들어 있어 따로 더 내실 돈은 없어요.' },
      { key: 'receiptNo', type: 'text', label: '현금영수증을 받을 휴대폰 번호 또는 사업자 번호를 적어 주세요.', maxlength: 20,
        showIf: function (a) { return !!a.receipt; }, requiredIf: function (a) { return !!a.receipt; },
        err: '현금영수증 받을 번호를 적어 주세요' },
      { key: 'depositAck', type: 'ack', checkLabel: '예', required: true, err: '확인하고 「예」를 눌러 주세요',
        label: '입금까지 마쳐야 연장 신청이 끝납니다. 확인하셨나요?' }
    ] }
  ],

  /* 시트 「안내금액」·「결제방식」 — 입금 대조가 이 금액과 같은 입금만 이 사람으로 맞춘다 */
  computed: function () { return { member: '예', amount: won(price().total), payMethod: '계좌' }; },
  submitLabel: '연장 신청하기',
  sendingLabel: '보내는 중…',

  done: function (a) {
    return {
      title: '연장 신청서를 받았어요',
      html: '<span class="paybox">입금계좌<br><b style="font-size:16px">' + 연장.account + '</b><br>입금하실 금액 <b>' + won(price().total) + '</b> <span class="sub">(' + amountTag() + ')</span>' +
        (late() ? '' : '<br><b style="color:var(--err)">12월 20일(일) 밤 12시까지</b> 입금해 주세요.') + '</span>' +
        '입금이 확인되면 연장이 끝납니다.<br>궁금한 점은 아래 부트니스 카카오채널로 물어봐 주세요.',
      button: { label: '부트니스 카카오채널', href: 연장.kakaoChannel }
    };
  },
  closed: {
    title: '멤버십 연장 신청이 마감되었어요',
    html: '궁금한 점은 <a href="https://pf.kakao.com/_xmHxgNT" target="_blank" rel="noopener">부트니스 카카오채널</a>로 물어봐 주세요.'
  }
};
