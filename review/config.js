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

  /* ⬜ 고칠 곳 둘 — 정해지면 이 두 줄만 바꾸면 된다 ------------------------------ */
  var REPLAY = '';                    // 다시보기 주소. **비워 두면 그 줄이 화면에 안 나온다** (2026-09-21 현재 미정)
  var DEADLINE = '2026-10-05T00:00:00+09:00';  // 마감 시각 — 10/4(일) 자정까지 받는다 (2026-09-27 오너 「후기는 10/4 자정까지 (10/4에서 10/5 넘어가는) 받고」) (예: '2026-10-08T23:59:59+09:00'). 비우면 마감 없이 계속 받는다
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
      K.split(', ').map(function (q) { return q + '{margin:0 0 8px 18px;padding:0 0 8px 12px;border-bottom:0;border-left:2px solid #efe8d6}'; }).join('') +
      K.split(', ').map(function (q) { return q + ' .consent input{width:19px;height:19px}' + q + ' .consent b{font-size:14.5px;font-weight:700}'; }).join('');
    (document.head || document.documentElement).appendChild(st);
  })();
  window.__agreeAll = function (on) {
    ['privacy', 'marketing'].forEach(function (k) {
      var el = document.querySelector('input[data-key="' + k + '"]');
      if (el && el.checked !== on) { el.checked = on; el.dispatchEvent(new Event('change', { bubbles: true })); }
    });
  };
  function folded(rows, summary) {                 // 표를 접힌 상자로 — 줄마다 「이름: 내용」
    return '<details style="margin:6px 0 0 32px;font-size:13.5px;color:var(--sub)"><summary style="cursor:pointer">' +
      (summary || '자세히') + '</summary>\n<div style="margin-top:6px;line-height:1.6">' +      // 줄바꿈 글자는 화면엔 안 보이고, 증거 글에선 칸 사이 띄어쓰기로 남는다
      rows.map(function (r) { return '<b>' + r[0] + '</b> ' + r[1]; }).join('<br>\n') + '</div></details>';
  }

  window.FORM = {
    formId:   'review',               // 백엔드 FORMS 의 키와 같아야 한다
    endpoint: 'https://script.google.com/macros/s/AKfycbxjd7-hFlao-hi2A-kB4Rg1OC1NbCBneBieqWA9lCkKUWk3c1Gv7D3hNlpKf6VloYnF/exec',
    keepDraft: true,                  // 새로고침해도 쓰던 답이 남는다 — **사진은 빼고**(용량). 다시 고르셔야 한다
    privacyUrl: 'https://apply.btns.kr/privacy/',
    deadline: DEADLINE || undefined,
    accent:   '#6b4c9a',
    eyebrow:  '부트니스',
    title:    '후기 리워드 신청',
    heroLines: ['<b>「AI로 컴퓨터 업무 자동화 하기」</b> 특강 후기를 남겨 주신 분께'],

    /* 동의 문구를 한 글자라도 고치면 이 번호를 올린다.
       동의 일시·문구 원문과 함께 시트에 적혀서, 나중에 「그때 뭐라고 쓰여 있었나」를 되읽을 수 있다 */
    consentVersion: '2026-09-27.6',

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
        hint: '방 이름이 보이게 찍어 주시면 확인이 빠릅니다. 말풍선만 잘린 캡처는 확인이 어려워 다시 여쭙게 됩니다.' +
              (CAPTURE_HELP ? '<details style="margin-top:6px"><summary style="cursor:pointer;font-weight:600;color:var(--ink)">' +
                CAPTURE_HELP.title + '</summary><div style="margin-top:6px">' + CAPTURE_HELP.body + '</div></details>' : ''),
        err: '후기 캡처를 올려 주세요' },

      { key: 'agreeAll', type: 'info', cls: 'agree-all', html: function (a) {
          var on = a && a.privacy === true && a.marketing === true;
          return '<b>' + AGREE_HEAD + '</b>' +
            '<label style="display:flex;gap:12px;align-items:center;margin-top:12px;cursor:pointer;font-weight:800;font-size:17.5px;color:var(--ink)">' +
            '<input type="checkbox" style="width:26px;height:26px;margin:0;flex:none;accent-color:var(--ink)" ' + (on ? 'checked ' : '') +
            'onclick="window.__agreeAll(this.checked)"> 모두 동의하고 리워드 받기</label>';
        } },

      /* 동의 칸 문구 — 공문서체(9/27 밤 오너 「요로 끝나는 말투 쓰지 말고 공문서처럼」) · 문안 술술이.
         수집·이용은 [필수] — 안 누르면 제출이 막힌다(서버도 거절). (가) 오너 확정 */
      { key: 'privacy', type: 'consent', label: '[필수] 개인정보 수집·이용 동의', required: true,
        err: '리워드를 받으시려면 개인정보 수집·이용에 동의하셔야 합니다.',
        notice: folded([['수집 항목', '성함, 무료특강방 닉네임, 휴대폰 번호, 이메일, 후기 캡처'],
                        ['이용 목적', '후기 리워드 지급 및 안내'],
                        ['보유 기간', '수집일로부터 3년간 보관하며, 기간 경과 후 파기합니다.'],
                        ['동의 거부', '동의를 거부할 수 있으나, 거부 시 신청서를 제출할 수 없으며 리워드가 지급되지 않습니다.']]) },

      /* [선택] 광고성 정보 수신 — 이 폼의 진짜 목적. 없으면 6개월 뒤에는 연락드릴 길이 없다.
         ⛔ 필수로 걸 수 없다 (개인정보 보호법 제22조 제5항 — 동의하지 않는다고 서비스를 거부하면 안 된다).
         ⛔ 밤 9시~아침 8시에는 문자·알림톡을 보내지 않는다 (정보통신망법 제50조 제3항 — 야간 동의는 따로 받아야 한다).
            이 폼은 야간 동의를 받지 않는다. 예외는 전자우편뿐이다 */
      /* 오너 9/27: 「동의칸만 남겨놓고 동의하지 않으면 리워드는 지급되지 않습니다. 라고 적어줘」.
         칸은 **선택 그대로**(required 없음) — 안 눌러도 제출은 된다. 제22조 제5항 위험은 오너가 알고 정하셨다(한결 전달) */
      { key: 'marketing', type: 'consent', label: '[선택] 소식·광고 수신 동의',
        notice: folded([['수집 항목', '성함, 휴대폰 번호, 이메일'],
                        ['이용 목적', '새 강의·무료특강·할인·모집 소식 등 광고성 정보 전송'],
                        ['전송 방법', '카카오톡, 문자, 이메일'],
                        ['보유 기간', '동의일로부터 3년간 보관합니다.'],
                        ['동의 거부', '동의를 거부할 수 있으나, 거부 시 리워드가 지급되지 않습니다.']]) }
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
      var mk = res && res.marketing !== undefined ? res.marketing === true : (a && a.marketing === true);
      if (mk) return {
        title: '후기 잘 받았어요. 고맙습니다 🙏',
        html: '확인되는 대로 리워드를 보내 드릴게요.',
        button: REPLAY ? { label: '다시보기 보러 가기', href: REPLAY } : null,
        tail: '아직 못 보신 분이 계시면 방에 한 번 더 나눠 주세요.<br>그 한 줄이 다음 분을 데려옵니다.',
        note: '강의·특강 소식 받기에 <b>동의하신 것으로</b> 처리했어요.' + at +
              '<br>언제든 <a href="https://apply.btns.kr/optout/">그만 받기</a>에서 멈추실 수 있어요.'
      };
      return {
        title: '후기 고맙습니다 🙏',
        html: '리워드는 소식 받기에 동의하신 분께 드려요.<br>받고 싶으시면 소식 받기에 체크하고, 캡처와 함께 한 번 더 내 주세요.',
        button: { label: '다시 내기', restart: true },            // 답을 비우고 첫 화면으로(엔진 restart)
        note: '강의·특강 소식 받기는 <b>동의하지 않으신 것으로</b> 처리했어요.' + at
      };
    },
    closed: { title: '후기 접수가 끝났어요',
      html: '늦게 오셔서 아쉬워요. 다음 특강 소식은 부트니스 카페에서 알려 드릴게요.',
      button: { label: '부트니스 카페 가기', href: 'https://cafe.naver.com/goldentree2nd' } }
  };
})();
