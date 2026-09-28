/* 후기 리워드 신청 — 설정 (설계: 03_광고/_집행물대장_260920.md 5장)

   ▣ 이 폼이 하는 일은 「후기를 모으는 것」이 아니다. **후기가 단톡방에서 돌게 하는 것**이다.
     (2026-09-21 오너: 「단톡방에서 후기가 계속 회자되면 관심이 없던 사람도 다시보기를 보게 되고
      그럼으로써 전환될 확률이 높아진다」)
     그래서 **주연은 방에 올라간 글이고 이 신청서는 조연**이다. 첫 문항이 「먼저 방에 올려 주세요」인 까닭이다.
     순서를 뒤집으면 방에 안 올리고 폼만 채운다. 문항을 고칠 때 이 순서를 지킨다.

   ▣ 리워드 종류는 여기 적지 않는다 (2026-09-20 오너: 「고정해 놓으면 매번 수정해야 하잖아」).
     무엇을 드리는지는 그때그때 단톡방 공지로 알린다.
     ⛔ 광고·양식·완료화면에서 특정 리워드를 약속하지 않는다 — 약속한 것은 조건 없이 줘야 한다. */
(function () {

  /* ⬜ 특강마다 고칠 곳 셋 — DEADLINE · LECTURE · ACCENT. ⚠️ 서버 신청폼_백엔드.gs FORMS.review.deadline 도 같은 시각으로 (9/28 오너) ---- */
  var DEADLINE = '2026-10-05T00:00:00+09:00';  // 마감 시각 — 10/4(일) 자정까지 받는다 (2026-09-27 오너 「후기는 10/4 자정까지 (10/4에서 10/5 넘어가는) 받고」) (예: '2026-10-08T23:59:59+09:00'). 비우면 마감 없이 계속 받는다
  var LECTURE = 'AI로 컴퓨터 업무 자동화 하기';   // 맨 위 「부트니스」 옆에 붙는 강의명(9/28 오너). 특강마다 바꾼다
  var ACCENT = '#6b4c9a';            // 머리띠 색 = 이번 특강의 강의색. 강의색은 02_콘텐츠/브랜드_컬러팔레트.md 5장(「강의 브랜드색」)
                                      // 지금은 인생업(인공지능으로 생산성 레벨업) 보라. 9/28 오너 「마감일 수정하면서 컬러만 같이 바꿔줘」
  /* 캡처 칸 「누르면 펼쳐지는 안내」 — 비워 두면(null) 안 나온다. 문구는 술술이(04_강의/인생업2기/후기리워드폼_문구_260927.md) */
  var CAPTURE_HELP = {              // 문구: 술술이 9/27. 펼침 표시(▸)는 브라우저가 그려서 제목 끝 ▾ 는 뺐다
    title: '카카오톡 캡처하는 법',
    body: '무료특강방에서 내 후기가 보이게 화면을 맞춘 뒤, 휴대폰 화면을 그대로 찍어 주세요. 방 이름이 함께 찍혀야 합니다.<br><br><b>아이폰</b><br>· 홈 버튼이 없는 모델: 옆 버튼과 음량 올리기 버튼을 함께 눌렀다 떼세요.<br>· 홈 버튼이 있는 모델: 옆(또는 위) 버튼과 홈 버튼을 함께 눌렀다 떼세요.<br><br><b>갤럭시</b><br>· 옆 버튼과 음량 내리기 버튼을 함께 짧게 눌렀다 떼세요.<br><br><b>PC 카카오톡</b><br>· 윈도우: Windows 키 + Shift + S<br>· 맥: Command + Shift + 4<br><br>찍은 사진은 휴대폰 사진첩(갤러리)에 저장됩니다. 위 「캡처 고르기」를 눌러 골라 주세요.<br><br>※ 카카오톡 안의 대화 캡처 기능으로 찍으면 방 이름이 빠질 수 있어요. 방 이름까지 보이게 하려면 위처럼 휴대폰 화면을 찍어 주세요.'
  };
  /* ---------------------------------------------------------------------------- */

  /* ── 동의 묶음(9/27 밤 오너: 「두 개를 … 합쳐」) — 엔진은 그대로, 이 폼에만 붙인다 ───────────────
     · 체크는 **둘 그대로** 둔다(제22조 제1항 — 홍보 동의는 구분해 각각). 「모두 동의」는 두 칸을 대신 눌러 주는 단추일 뿐 따로 저장하지 않는다.
     · 엔진이 칸을 다시 그릴 때마다 「모두 동의」도 두 칸 상태로 다시 그려진다 → 둘 다 켜지면 저절로 켜진다.
     · 긴 설명은 접어 둔다. 동의 증거(동의문구원문)에는 접혀 있어도 글자가 그대로 남는다(엔진이 태그만 걷어 낸다) */
  var AGREE_HEAD = '<span style="color:var(--err)">두 항목에 모두 동의</span>하셔야 리워드가 지급됩니다.';   // 9/27 밤 오너: 한 줄만 · 「두 항목에 모두 동의」 빨간 글씨(오류 글씨와 같은 색)
  /* 빈 상자 없애기 — 엔진은 동의 설명을 <p class="agree-note"> 로 감싸는데, 접는 <details> 는 문단 안에 못 들어가서
     테두리 있는 빈 문단만 남는다(9/27 밤 오너 「그 위에 빈 박스는 왜 둔거야?」). 엔진은 그대로 두고 이 폼에서만 빈 문단을 숨긴다 */
  (function () {
    var st = document.createElement('style');
    /* 9/27 밤 오너: 「[선택] 앞에 있는데 뒤에 선택을 또 쓸 필요 없잖아」 → 엔진이 붙이는 꼬리표(선택·*)를 이 두 칸에서만 숨긴다.
       「모두 동의 체크박스가 더 작아서 위계가 뒤틀린 느낌」 → 두 칸은 줄이고 들여써서 딸린 항목으로 */
    var K = '.q[data-k="privacy"], .q[data-k="marketing"]';
    st.textContent =
      '.q[data-k="privacy"] p:empty, .q[data-k="marketing"] p:empty { display: none !important; }' +
      '.q[data-k="privacy"] [data-tag], .q[data-k="marketing"] [data-tag] { display: none !important; }' +
      K.split(', ').map(function (q) { return q + '{margin:0 0 8px 14px;padding:0 0 8px 12px;border-bottom:0;border-left:2px solid #efe8d6}'; }).join('') +
      K.split(', ').map(function (q) { return q + ' .consent input{width:19px;height:19px}' + q + ' .consent b{font-size:14.5px;font-weight:700}'; }).join('') +
      /* 「보기 ›」 — 라벨 같은 줄 오른쪽 끝, 작은 회색(9/28 오너 「자세히가 아래로 가니까 시선이 집중」 · 네이버·쿠팡 약관 모양) */
      K.split(', ').map(function (q) {
        return q + '{position:relative}' + q + ' .consent{padding-right:57px}' +   // 「보기」 폭 + 오른쪽 여백만큼 라벨이 비켜 준다
          q + ' details.bogi{margin:0}' +
          /* 9/28 오너 「필수·선택이 왼쪽에서 떨어진 만큼 보기도 오른쪽에서」 → 좌우 14px 대칭.
             18px 로 맞추면 360폭(갤럭시)에서 [필수] 라벨이 두 줄로 꺾여 14px 로 둘 다 맞췄다 */
          q + ' details.bogi>summary{position:absolute;top:1px;right:14px;list-style:none;cursor:pointer;font-size:12.5px;color:var(--sub);padding:2px 0 2px 8px;line-height:1.5}' +
          q + ' details.bogi>summary::-webkit-details-marker{display:none}' +
          q + ' details.bogi>summary::after{content:"보기 ›"}' +
          q + ' details.bogi[open]>summary::after{content:"접기"}' +
          q + ' .bogi-body{margin:8px 0 0 29px;font-size:13px;color:var(--sub);line-height:1.6}';
      }).join('') +
      '.q[data-k="marketing"]{margin-bottom:30px !important}' +
      '.q[data-k="privacy"] .err{display:none !important}' +
      '.q[data-k="privacy"].bad ~ .q[data-k="marketing"] .err{display:block}' +
      '.q[data-k="marketing"] .err{margin:10px 0 0 !important;font-size:14px;font-weight:700;color:var(--err)}';   // 9/28 오너 「선택 동의 줄과 후기 보내기 버튼 사이 간격」
    (document.head || document.documentElement).appendChild(st);
  })();
  /* 9/28 오너: 「모두 동의를 권하는 메시지는 팝업으로. 지금은 눈에 너무 안 띄어서 버튼이 작동 안 하는 것처럼 느껴져」.
     엔진은 「후기 보내기」를 폼 submit 으로 받는다 → 문서 단계에서 그 신호를 먼저 가로채, 두 동의가 없으면
     가운데 팝업을 띄우고 제출을 멈춘다(엔진은 그대로). 빨간 한 줄도 같이 켜 둔다 — 팝업을 닫은 뒤 어디를 봐야 하는지 */
  var POPUP_MSG = '모두 동의하지 않으면 후기 리워드를<br>받으실 수 없습니다.';   // 9/28 오너: 「리워드를」 뒤 줄바꿈
  function consentOk() {
    var p = document.querySelector('input[data-key="privacy"]'), m = document.querySelector('input[data-key="marketing"]');
    return !!(p && p.checked && m && m.checked);
  }
  function popup() {
    var box = document.getElementById('agreePopup');
    if (!box) {
      box = document.createElement('div'); box.id = 'agreePopup';
      box.setAttribute('role', 'alertdialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-labelledby', 'agreePopupMsg');
      box.style.cssText = 'position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(30,30,30,.45)';
      box.innerHTML = '<div style="background:#fff;border-radius:16px;max-width:320px;width:100%;padding:26px 22px 18px;text-align:center;box-shadow:0 10px 30px rgba(0,0,0,.18)">' +
        '<p id="agreePopupMsg" style="margin:0 0 20px;font-size:16.5px;font-weight:700;line-height:1.55;color:var(--ink);word-break:keep-all">' + POPUP_MSG + '</p>' +
        '<button type="button" id="agreePopupOk" style="width:100%;font:inherit;font-size:16px;font-weight:700;padding:13px 0;border:0;border-radius:12px;background:#f4d017;color:#1e2a33;cursor:pointer">확인</button></div>';
      document.body.appendChild(box);
      var close = function () {
        box.style.display = 'none';
        var t = document.querySelector('.q[data-k="agreeAll"]');
        if (t) t.scrollIntoView({ behavior: 'smooth', block: 'center' });   // 닫으면 동의 칸으로
      };
      box.querySelector('#agreePopupOk').addEventListener('click', close);
      box.addEventListener('click', function (e) { if (e.target === box) close(); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && box.style.display !== 'none') close(); });
    }
    box.style.display = 'flex';
    box.querySelector('#agreePopupOk').focus();
  }
  document.addEventListener('submit', function (e) {
    var p = document.querySelector('input[data-key="privacy"]');
    if (!p || !e.target.contains(p) || consentOk()) return;       // 이 폼·동의가 다 됐으면 엔진에 그대로 넘긴다
    e.preventDefault(); e.stopImmediatePropagation();
    ['privacy', 'marketing'].forEach(function (k) {
      var el = document.querySelector('input[data-key="' + k + '"]'), q = el && el.closest('.q');
      if (q && !el.checked) q.classList.add('bad');                 // 빨간 한 줄도 켠다
    });
    popup();
  }, true);
  /* 빨간 굵은 글씨 — .paybox b 는 19px 로 키우는 규칙이 있어 크기는 둘레 글자를 따르게 한다 */
  function RED(t) { return '<b style="color:#d93025;font-size:inherit;font-weight:800">' + t + '</b>'; }
  /* 처리한 날 — 서버가 준 처리 시각(res.at 「YYYY-MM-DD HH:mm」)을 「YYYY년 M월 D일」로. 없으면(미리보기) 오늘 */
  function agreedOn(res) {
    var m = String((res && res.at) || '').match(/^(\d{4})-(\d{2})-(\d{2})/), d = new Date();
    return m ? (m[1] + '년 ' + (+m[2]) + '월 ' + (+m[3]) + '일') : (d.getFullYear() + '년 ' + (d.getMonth() + 1) + '월 ' + d.getDate() + '일');
  }
  window.__agreeAll = function (on) {
    ['privacy', 'marketing'].forEach(function (k) {
      var el = document.querySelector('input[data-key="' + k + '"]');
      if (el && el.checked !== on) { el.checked = on; el.dispatchEvent(new Event('change', { bubbles: true })); }
    });
  };
  function folded(rows) {                          // 표를 접힌 상자로 — 「보기 ›」는 라벨 줄 오른쪽 끝(CSS 로 그림), 펼치면 라벨 아래로
    return '<details class="bogi"><summary></summary>\n<div class="bogi-body">' +     // 줄바꿈 글자는 화면엔 안 보이고, 증거 글에선 칸 사이 띄어쓰기로 남는다
      rows.map(function (r) { return '<b>' + r[0] + '</b> ' + r[1]; }).join('<br>\n') + '</div></details>';
  }


  window.FORM = {
    formId:   'review',               // 백엔드 FORMS 의 키와 같아야 한다
    endpoint: 'https://script.google.com/macros/s/AKfycbxjd7-hFlao-hi2A-kB4Rg1OC1NbCBneBieqWA9lCkKUWk3c1Gv7D3hNlpKf6VloYnF/exec',
    keepDraft: true,                  // 새로고침해도 쓰던 답이 남는다 — **사진은 빼고**(용량). 다시 고르셔야 한다
    privacyUrl: 'https://apply.btns.kr/privacy/',
    deadline: DEADLINE || undefined,
    accent:   ACCENT,                 // 맨 위 ⬜ 고칠 곳에서 바꾼다
    eyebrow:  '부트니스 「' + LECTURE + '」',   // 9/28 오너 「무료특강 강의명을 맨 상단 부트니스 옆에」
    title:    '후기 리워드 신청',
    // heroLines 없음 — 9/28 오너 「제목 밑 부연설명은 지워줘. 다른 무료특강에서도 쓸 수 있게」

    /* 동의 문구를 한 글자라도 고치면 이 번호를 올린다.
       동의 일시·문구 원문과 함께 시트에 적혀서, 나중에 「그때 뭐라고 쓰여 있었나」를 되읽을 수 있다 */
    consentVersion: '2026-09-28.5',

    pages: [{ fields: [
      /* 문구는 술술이 것을 그대로 쓴다 — 04_강의/인생업2기/후기리워드_공지문안_261001.md 「폼·완료 화면 문구 셋」 */
      { key: 'howto', type: 'info', html:
        '<b>먼저 단톡방에 후기를 올려 주세요.</b><br>' +
        '그 화면을 캡처해 이 신청서에 올려 주시면 됩니다.' },

      { key: 'name', type: 'text', label: '성함', required: true, maxlength: 30,
        autocomplete: 'name', err: '성함을 적어 주세요' },

      /* 필수 — 캡처에 찍히는 건 성함이 아니라 방 닉네임이라, 비면 누구 캡처인지 맞춰 볼 수 없다(술술이 권고 · 한결 확정 9/27) */
      { key: 'nick', type: 'text', label: '무료특강방 닉네임', required: true, maxlength: 40,
        hint: '무료특강 오픈채팅방에서 쓰시는 이름이에요. 후기 캡처와 맞춰 보는 데만 씁니다.',
        autocomplete: 'nickname', err: '무료특강방 닉네임을 적어 주세요' },

      { key: 'phone', type: 'tel', label: '휴대폰 번호', required: true, autocomplete: 'tel',
        hint: '리워드를 이 번호로 보내 드려요. 숫자만 적어 주세요 (예: 01012345678)',
        confirmLine: true },

      /* 휴대폰 한 번 더 — 두 칸이 다르면 제출을 막는다(엔진 mustEqual). 시트에는 보내지 않는다(noSubmit) — 2026-09-27 오너 */
      { key: 'phone2', type: 'tel', label: '휴대폰 번호 확인', required: true, autocomplete: 'tel',
        mustEqual: 'phone', noSubmit: true,
        hint: '번호가 한 자리만 틀려도 리워드가 가지 않아요. 한 번 더 적어 주세요.',
        err: '위에 적은 번호와 달라요. 두 번호를 한 번 더 확인해 주세요.' },

      /* 이메일 필수 — 「DB는 휴대폰 + 이메일 동시 수집」(2026-09-27 오너 원칙). 형식 검사는 엔진·서버 둘 다 */
      { key: 'email', type: 'email', label: '이메일', required: true, maxlength: 120,
        hint: '리워드와 안내를 이메일로도 보내 드려요.',   // 9/27 오너 확정. 리워드 메일은 폼이 아니라 한결이 대상을 뽑아 보낸다
        autocomplete: 'email', err: '이메일 주소를 한 번 더 확인해 주세요. (예: name@example.com)' },

      { key: 'shot', type: 'file', label: '단톡방 후기 캡처를 올려 주세요', required: true,
        pickLabel: '캡처 고르기',
        hint: '말풍선만 잘린 캡처는 확인이 어려워 다시 여쭙게 됩니다.' +   // 「방 이름이 보이게 …」 줄은 9/28 오너 지시로 뺐다
              (CAPTURE_HELP ? '<details style="margin-top:6px"><summary style="cursor:pointer;font-weight:600;color:var(--ink)">' +
                CAPTURE_HELP.title + '</summary><div style="margin-top:6px">' + CAPTURE_HELP.body + '</div></details>' : ''),
        err: '후기 캡처를 올려 주세요' },

      { key: 'agreeAll', type: 'info', cls: 'agree-all', html: function (a) {
          var on = a && a.privacy === true && a.marketing === true;
          return '<b>' + AGREE_HEAD + '</b>' +
            '<label style="display:flex;gap:12px;align-items:center;margin-top:12px;cursor:pointer;font-weight:800;font-size:17.5px;color:var(--ink)">' +
            '<input type="checkbox" style="width:19px;height:19px;margin:0;flex:none;accent-color:var(--ink)" ' + (on ? 'checked ' : '') +
            'onclick="window.__agreeAll(this.checked)"> 모두 동의하고 리워드 받기</label>';
        } },

      /* 동의 칸 문구 — 공문서체(9/27 밤 오너 「요로 끝나는 말투 쓰지 말고 공문서처럼」) · 문안 술술이.
         수집·이용은 [필수] — 안 누르면 제출이 막힌다(서버도 거절). (가) 오너 확정 */
      { key: 'privacy', type: 'consent', label: '[필수] 개인정보 수집·이용 동의', required: true,
        err: ' ',                  // 오류 글은 아래 소식·광고 칸 밑 한 줄로 합친다(9/28 오너)
        notice: folded([['수집 항목', '성함, 무료특강방 닉네임, 휴대폰 번호, 이메일, 후기 캡처'],
                        ['이용 목적', '후기 리워드 지급 및 안내'],
                        ['보유 기간', '수집일로부터 3년간 보관하며, 기간 경과 후 파기합니다.'],
                        ['동의 거부', '동의를 거부할 수 있으나, 거부 시 신청서를 제출할 수 없으며 리워드가 지급되지 않습니다.']]) },

      /* [선택] 광고성 정보 수신 — 이 폼의 진짜 목적. 없으면 6개월 뒤에는 연락드릴 길이 없다.
         ⛔ 필수로 걸 수 없다 (개인정보 보호법 제22조 제5항 — 동의하지 않는다고 서비스를 거부하면 안 된다).
         ⛔ 밤 9시~아침 8시에는 문자·알림톡을 보내지 않는다 (정보통신망법 제50조 제3항 — 야간 동의는 따로 받아야 한다).
            이 폼은 야간 동의를 받지 않는다. 예외는 전자우편뿐이다 */
      /* 오너 9/27: 「동의칸만 남겨놓고 동의하지 않으면 리워드는 지급되지 않습니다. 라고 적어줘」.
         (9/27 판에서는 안 눌러도 제출됐다. 9/28 부터는 제출이 막힌다 — 아래 칸 설명) 제22조 제5항 위험은 오너가 알고 정하셨다(한결 전달) */
      /* 9/28 오너: 「모두 동의를 하지 않은 상태에서 후기 보내기를 누르면 그 자리에서 … 경고창이 뜨면서 제출을 못하게 막아줘」.
         → 이 칸도 안 누르면 제출이 막힌다(서버도 거절). 칸 이름 「[선택]」은 오너 답으로 그대로 둔다.
         경고는 브라우저 팝업 대신 이 칸 바로 밑 빨간 한 줄 + 그 자리로 스크롤(엔진이 해 준다) */
      { key: 'marketing', type: 'consent', label: '[선택] 소식·광고 수신 동의', required: true,
        err: '모두 동의하지 않으면 후기 리워드를 받으실 수 없습니다.',
        notice: folded([['수집 항목', '성함, 휴대폰 번호, 이메일'],
                        ['이용 목적', '새 강의·무료특강·할인·모집 소식 등 광고성 정보 전송'],
                        ['전송 방법', '카카오톡, 문자, 이메일'],
                        ['보유 기간', '동의일로부터 3년간 보관합니다.'],
                        ['동의 거부', '동의를 거부할 수 있으나, 거부 시 신청서를 제출할 수 없으며 리워드가 지급되지 않습니다.']]) }
    ] }],

    submitLabel: '후기 보내기',
    sendingLabel: '보내는 중…',

    /* 완료 화면 — 후기를 쓰신 분이 곧 전달자다. 여기서 한 번 더 방으로 돌려보낸다(문안: 술술이).
       ⚠️ 「나눠 주세요」는 **부탁이지 조건이 아니다.** 리워드를 여기에 걸지 않는다 */
    done: function (a, res) {
      /* 완료 화면 — 동의 여부로 두 벌(문안: 술술이 9/27 확정).
         맨 아랫줄은 **소식 받기를 어떻게 처리했는지** 알린다 — 정보통신망법 제50조 제7항(처리 결과를 알려야 한다).
         이 폼은 메일을 안 보내니 이 화면이 그 몫을 한다 */
      var at = (res && res.at) ? ' <span class="when">(' + res.at + ' 처리)</span>' : '';
      var mk = res && res.marketing !== undefined ? res.marketing === true : (a && a.marketing === true) || !!(res && res.preview);   // 미리보기(?preview=done)도 동의 화면으로 — 동의는 필수라 실제로는 이 화면뿐이다
      if (mk) return {                                              // 9/28 오너 지시: 안내 두 줄을 상자 안에(paybox 모양을 빌린다)
        title: '후기 잘 받았습니다. 감사합니다. 😊',
        html: '<span class="paybox" style="word-break:keep-all">' + RED('리워드는') + ' 후기 리워드 신청기간 종료 후 ' + RED('2~3일 이내에 발송') + '됩니다.<br>' +   // 9/28 오너: 두 곳 빨간 굵은 글씨
              '부트니스에서는 여러분께 도움이 되는 강의를 준비하기 위해 늘 노력하고 있습니다.</span>',
        button: null,                                             // 다시보기 버튼은 두지 않는다(9/28 오너 「완료 화면에 다시보기 주소를 적을 필요는 없어」)
        tail: '<span style="font-size:12.5px;color:var(--sub);line-height:1.6;word-break:keep-all">' +
              '[광고성 정보 수신동의 처리 결과]<br>귀하는 ' + agreedOn(res) + ' 부트니스의 광고성 정보 수신에 동의하셨으며, 수신동의 처리가 완료되었습니다.</span>'
        /* ↑ 수신동의 처리 결과 알림 — 정보통신망법 제50조 제7항 · 시행령 제62조의2: ① 보내는 곳 이름 ② 동의 사실과 날짜 ③ 처리 결과를
             **14일 안에** 알려야 한다(어기면 1천만원 이하 과태료). 방법은 제한이 없어 완료 화면에 둔다. 광고 문구를 섞으면 안 된다.
             9/28 오너: 상자는 빼고(「박스 지워줘」), 흔히 쓰는 무난한 문구로 — 작은 회색 글씨로 둔다 */
      };
      return {
        title: '후기 고맙습니다 🙏',
        html: '리워드는 소식 받기에 동의하신 분께 드려요.<br>받고 싶으시면 소식 받기에 체크하고, 캡처와 함께 한 번 더 내 주세요.',
        button: { label: '다시 내기', restart: true },            // 답을 비우고 첫 화면으로(엔진 restart)
        note: '강의·특강 소식 받기는 <b>동의하지 않으신 것으로</b> 처리했습니다.' + at
      };
    },
    closed: { title: '후기 접수가 끝났어요',
      html: '늦게 오셔서 아쉬워요. 다음 특강 소식은 부트니스 카페에서 알려 드릴게요.',
      button: { label: '부트니스 카페 가기', href: 'https://cafe.naver.com/goldentree2nd' } }
  };
})();
