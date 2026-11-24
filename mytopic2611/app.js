/* 「인스타 수익화 스타터 키트」(옛 이름 「내 계정 찾기」) 웹 리워드 — 화면 흐름 (2026-11-16 뚝딱이 · MacminiM4)
 * 11/17 한결: 대표 「참여리워드 처음부터 다시 기획해서 완성본 만들어」 → 키트 구성 셋으로 다시 짬
 *   ① 주제 진단(10문항) → ② 내 주제 카드(추천 주제 중 하나를 골라 카드 한 장으로) → ③ 맞춤 전자책. 문항·추천 주제·전자책 내용은 그대로.
 *
 * 표지 → 핏 진단 5문항(한 화면 한 문항) → (동점이면 고르기) → 할 얘기 찾기 + 분야 고르기 → 결과 → (선택) 전자책 받기 → 전자책 열기
 * 문항·보기는 PDF판(참여리워드_261116/내계정찾기_모바일.html) 그대로. 추천 주제는 data.js, 설정은 config.js.
 *
 * - 결과까지는 아무것도 서버로 보내지 않는다. 전자책 받기를 누른 사람만 이름·번호·이메일·동의가 시트로 간다(신청폼_백엔드.gs FORMS.mytopic2611).
 * - 11/20 대표 「제출하는 순간 메일로 보내고 나와의 채팅에 보낼 수 있게 링크 버튼 하나」 — 사례 모음 키(book)를 함께 보내면 서버가 자기 목록의 링크로 메일을 보내고
 *   결과(j.mail)를 돌려준다. 받은 뒤 화면은 그 결과대로만 말한다(sent → 보냈다 · queued → 늦게 · 그 밖 → 메일 얘기 없음). ?preview=1&pvmail=sent|queued 로 문장을 미리 본다.
 * - 성공 판정은 신청번호(j.id)가 있는지로 한다 — ok 만 보면 doGet 핑({ok, ping})이 성공으로 섞인다(9/13 사고). 없으면 한 번 더 보낸다.
 * - ?preview=1 — 서버로 보내지 않는다. 전자책 링크가 빈 분야도 받기 화면까지 가 볼 수 있다.
 * - ?src=코드 — 유입경로. 신청폼과 같은 코드만 받는다(서버가 한 번 더 거른다).
 * - 뒤로 가기(안드로이드 버튼)는 앞 화면으로. 새로고침해도 이 탭에서는 답이 남는다(sessionStorage, 실패해도 그냥 처음부터).
 * 오래된 안드로이드 카톡 웹뷰 때문에 ?. ?? 화살표 함수는 쓰지 않는다.
 */
(function () {
  'use strict';
  var C = window.MYTOPIC, D = window.TOPIC_DATA, app = document.getElementById('app');
  if (!C || !D || !app) { if (app) app.innerHTML = '<p class="loaderr">화면을 불러오지 못했습니다. 새로고침해 주세요.</p>'; return; }

  var QS = [
    { q: '얼굴과 이름을 드러내도 괜찮나요?', o: ['괜찮다', '가게·서비스 이름으로', '드러내고 싶지 않다'] },
    { q: '이 계정으로 알리고 싶은 것은?', h: '파는 것이 둘이면, 1년 뒤 더 키우고 싶은 쪽 하나를 골라 주세요. 다른 하나는 두 번째 계정으로 남겨 둡니다.', o: ['내 지식·경험', '가게·서비스', '아직 없다'] },   // 11/23 대표 「하나만 고르는 쪽으로 해」
    { q: '일주일에 콘텐츠에 쓸 수 있는 시간은?', o: ['3시간 이상', '1~2시간', '1시간이 안 된다'] },
    { q: '가장 편하게 만들 수 있는 형식은?', o: ['말하기·얼굴 영상', '사진·현장', '글·표·정리·손 영상'] },
    { q: '1년 뒤 이 계정으로 얻고 싶은 것은?', o: ['나에게 일을 맡기는 사람(상담·강의·의뢰)', '내 가게·상품을 사는 손님(매출·예약·주문)', '나를 찾아오는 브랜드(협찬·공구·광고)'] }   // 11/23 교차 검증 D — 「누가 돈을 내는가」로 나눠 지식 판매자의 상담 예약이 두 보기에 걸리지 않게
  ];
  var NO = ['①', '②', '③'];
  var SRC_CODES = ['cafe', 'blog', 'insta', 'threads', 'youtube', 'kakaoopen', 'db', 'meta', 'ref', 'direct'];
  var qs = new URLSearchParams(location.search);
  var PREVIEW = !!qs.get('preview');
  var SRC = (qs.get('src') || qs.get('utm_source') || '').trim().toLowerCase();
  if (SRC_CODES.indexOf(SRC) < 0) SRC = '';
  var REF = SRC === 'ref' ? (qs.get('ref') || '').slice(0, 30) : '';
  var KEY = 'mytopic2611';

  var S = { ans: [], type: '', tans: [], biz: '', bizLabel: '', cat: '', mine: '', mine2: '', pick: false, rec: 0, got: null };   // 핏 답 · 유형('1'~'3') · 할 얘기 답(분야 id, 「딱히 없다」는 '') · 확정 분야 · 분야 직접 고르기 · 전자책 받은 결과
  try { var sv = JSON.parse(sessionStorage.getItem(KEY) || 'null'); if (sv && sv.ans) { S = sv; if (!S.tans) S.tans = []; if (!S.rec) S.rec = 0; } } catch (e) {}
  function save() { try { sessionStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function cat(id) { for (var i = 0; i < D.categories.length; i++) if (D.categories[i].id === id) return D.categories[i]; return null; }
  /* 유형 표 세기 — 얼굴·형식·목표처럼 유형을 가르는 답만 센다(11/20 대표 「두 가지 다 손보고 비슷한 오류 있는지 크로스 체크해」)
     · 3번(쓸 수 있는 시간)은 세지 않는다 — 시간이 적다고 얼굴 없는 계정이 맞는 것은 아니다. 답은 결과의 ⏰ 안내에만 쓴다
     · 2번 「아직 없다」도 세지 않는다 — 팔 것이 없다고 얼굴 없는 계정이 맞는 것은 아니다(「내 지식·경험」은 ①로 센다) */
  function counts() {
    var n = [0, 0, 0];
    S.ans.forEach(function (a, i) { if (i === 2 || (i === 1 && a === 3)) return; if (a >= 1 && a <= 3) n[a - 1]++; });
    return n;
  }
  /* 유형 설명 — 5번(1년 뒤 얻고 싶은 것) 답에 맞춘 글이 있으면 그 글을 쓴다. 협찬을 고른 분께 「상담·강의·의뢰」라고 하지 않게(11/20 대표) */
  function typeName(x) { var ty = D.types[x] || {}; return (x === '2' && S.ans[1] === 3 && ty.nameNoSell) || (ty.nameByFace && ty.nameByFace[S.ans[0]]) || ty.name || ''; }   // 11/23 교차 검증 A·B·C
  function typeDesc(x) { var ty = D.types[x] || {}; return (x === '2' && S.ans[1] === 3 && ty.descNoSell) || (ty.descByFace && ty.descByFace[S.ans[0]]) || ty.desc || ''; }
  /* 유형 후보(11/16 대표 「비슷한 부분이 또 있을 것 같은데 체크해봐」 — 답끼리 앞뒤가 안 맞는 결과 막기)
     · 2번 「가게·서비스」 → ② 하나로 정한다
     · 2번이 가게가 아니면 ②는 후보에서 뺀다(② 가게·사업 계정은 가게가 있는 분만)
     · 1번 「드러내고 싶지 않다」 → ①(얼굴 드러내는 퍼스널 브랜딩)을 뺀다
     · 1번 「괜찮다」 + 4번 「말하기·얼굴 영상」 → ③(얼굴 없는 주제 계정)을 뺀다(11/20 대표 「얼굴 보이고 말하는게 가장 자신있다고 했는데 왜 얼굴 없는 주제 계정이 나와?」
       — 2·3·5번이 모두 ③ 자리면 3:2로 ③이 나왔다)
     남은 후보 중 가장 많이 나온 것, 같으면 고르기 화면 */
  function tops() { return [String(S.ans[4] || 1)]; }   // 11/23 대표 「뭘 원하는지에 맞춰서 제시」 → 유형은 5번 목표 하나로(표 세기 · 동점 화면 안 씀)
  /* 할 얘기 찾기 집계 — 가장 많이 나온 분야. 동점이거나 1개 차이면 두 분야, 최다가 1개 이하면 직접 고르기(11/16 대표 「바꿔」) */
  function talkVerdict() {
    var n = {}, order = [];
    S.tans.forEach(function (c) { if (!c || !cat(c)) return; if (!n[c]) { n[c] = 0; order.push(c); } n[c]++; });
    order.sort(function (a, b) { return n[b] - n[a] || catIndex(a) - catIndex(b); });
    var top = order[0], max = top ? n[top] : 0;
    if (max <= 1) return { kind: 'none', n: n };
    var tops2 = order.filter(function (c) { return n[c] === max; });
    if (tops2.length >= 2) return { kind: 'two', a: tops2[0], b: tops2[1], n: n };
    var seconds = order.filter(function (c) { return n[c] === max - 1; });
    if (max >= 3 && seconds.length === 1) return { kind: 'two', a: top, b: seconds[0], n: n };   // 2 대 1은 「비슷하게」가 아니다(11/20)
    return { kind: 'one', a: top, n: n };
  }
  function catIndex(id) { for (var i = 0; i < D.categories.length; i++) if (D.categories[i].id === id) return i; return 99; }
  function fill(t, o) { return String(t).replace(/\{(\w+)\}/g, function (m, k) { return o[k] != null ? o[k] : m; }); }
  function catBtn(c, big) {
    return '<button class="chip' + (big ? ' big' : '') + '" data-act="cat" data-v="' + esc(c.id) + '">' +
      '<span class="nm">' + esc(c.name) + '</span>' + (c.hint ? '<span class="ht">' + esc(c.hint) + '</span>' : '') + '</button>';
  }
  /* 핏 진단 2번(지금 돈을 받고 파는 것)에 ② 가게·서비스 → 할 얘기 5문항 뒤 가게 분야 질문으로 분야를 정한다(11/16 대표) */
  function extraKey() { return S.ans[1] === 2 ? 'biz' : S.ans[1] === 1 ? 'know' : ''; }   // 2번 ② 가게 → bizQ · ① 내 지식 → knowQ · ③ 아직 없다 → 집계
  function extraQ() { var k = extraKey(); return k ? D[k + 'Q'] : null; }
  /* 팔거리가 있는 분(핏 2번 가게·서비스 / 내 지식·경험)은 주제 찾기를 건너뛰고 유형별 운영 조언과 판매자 전자책만(11/16 대표
     「팔거리가 있는 사람은 그게 바로 주제가 되니까 핏에 따른 상담과 관련된 전자책만 주면」). 업종·지식 분야는 시트와 결과 첫 줄에만 쓴다 */
  function isSeller() { return !!(extraKey() && S.biz); }
  function resultView() { return isSeller() ? 'seller' : 'result'; }
  /* 11/20 GPT·제미나이 검토 — 뒤로 가서 답을 바꾼 뒤에도 옛 결과·옛 사례 모음 링크가 섞여 나오지 않게 */
  function sig() { return [S.type, S.cat, isSeller() ? 's' : 'n'].join('|'); }
  function gotNow() { if (S.got && S.got.sig !== sig()) S.got = null; return S.got; }              // 유형·분야가 달라졌으면 받은 기록을 버린다
  function done() { return !!(S.type && S.cat && cat(S.cat) && S.ans.length === 5 && (isSeller() || S.tans.length === D.talk.length)); }   // 문항을 다 답한 결과만 결과로 본다
  function resetCat() { S.cat = isSeller() ? S.biz : ''; }                                         // 문항으로 돌아가면 앞서 고른 분야를 지운다(판매자는 업종이 분야)
  var SELLER_TBD = { title: '판매자 결과 글을 준비하고 있습니다', intro: '[자리표시] 술술이 글이 들어올 자리입니다.', tips: ['[자리표시] 조언 1', '[자리표시] 조언 2', '[자리표시] 조언 3'],
                     ebookTitle: '[자리표시] 판매자 전자책 제목', ebookDesc: '[자리표시] 판매자 전자책 설명' };
  function sellerKey() { return S.ans[1] === 2 ? '2' : S.ans[0] === 3 ? '3' : '1'; }   // 11/23 판매자 글·사례 모음은 파는 것과 얼굴로(유형은 목표로 따로) — 교차 검증 F
  function sellerData() { return (D.sellerResult && D.sellerResult[sellerKey()]) || SELLER_TBD; }
  function bridge() { return (D.bridges || {})[S.ans[1] + '-' + S.ans[4]] || null; }
  function ebookKey() { return isSeller() ? 'seller' + sellerKey() : S.cat; }                          // 서버 FORMS.mytopic2611.mail.books 의 키와 같다
  function ebookUrl() { return (C.EBOOKS && C.EBOOKS[ebookKey()]) || ''; }
  function bookTitle() { return KIT + ' · ' + (isSeller() ? sellerData().ebookTitle : ((cat(S.cat) || { name: '' }).name + ' 사례 모음')); }
  var EMAIL_RE = /^[^\s@<>"',;]+@[^\s@<>"',;]+\.[^\s@<>"',;]+$/;                            // 서버 EMAIL_RE 와 같게
  var PVMAIL = qs.get('pvmail') || '';
  if (D.sample) document.getElementById('sampleBar').hidden = false;

  /* ── 화면 하나 그리기 ─────────────────────────────────── */
  var cur = '', depth = 0, hi = 0, skipPop = false;             // depth: 이 페이지 안에서 쌓은 뒤로 가기 수 · hi: 지금 화면의 방문 순번(앞으로 가기 가려내기)
  function show(name, push) {
    if (push !== false && (name !== cur || name === 'q' || name === 't')) { try { history.pushState({ s: name, i: hi + 1 }, '', location.href); hi++; depth++; } catch (e) {} }
    cur = name;
    app.innerHTML = VIEWS[name]();
    if (name === 'cover') fitCover();
    document.querySelector('meta[name=theme-color]').setAttribute('content', name === 'cover' ? '#f4d017' : '#ffffff');
    window.scrollTo(0, 0);
    if (AFTER[name]) AFTER[name]();
    save();
  }
  /* 뒤로 가기(폰 버튼·화면 「이전」 둘 다) — 문항으로 돌아가면 마지막 답을 지워 다시 고르게 한다 */
  window.addEventListener('popstate', function (e) {
    var ni = (e.state && e.state.i) || 0;
    if (skipPop) { skipPop = false; hi = ni; return; }
    if (ni > hi) { skipPop = true; try { history.back(); } catch (x) { skipPop = false; } return; }   // 「앞으로 가기」는 받지 않고 제자리로 — 답이 거꾸로 지워지지 않게
    hi = ni;
    depth = Math.max(0, depth - 1);
    S.pend = 0;                                                      // 누른 직후 돌아왔으면 예약된 답 넣기를 버린다(아래 pick·tpick 이 확인)
    var s = e.state && e.state.s;
    if (!s || !VIEWS[s]) s = 'cover';
    if (s === 'q') { if (S.ans.length) S.ans.pop(); S.type = ''; resetCat(); }
    if (s === 't') { if (S.tans.length) S.tans.pop(); resetCat(); }
    if (s === 'verdict') { S.pick = false; resetCat(); }
    if (s === 'intro' || s === 'tie') resetCat();
    if (s === 'tie') S.type = '';
    if (s === 'biz') { S.biz = ''; S.bizLabel = ''; S.cat = ''; if (S.ans.length < 2 || !extraKey()) s = S.ans.length ? 'q' : 'cover'; }
    if (s === 'ebook' && gotNow()) s = resultView();                  // 받은 뒤 뒤로 오면 같은 신청을 또 내지 않게
    if ((s === 'intro' || s === 't' || s === 'verdict') && !S.type) s = 'cover';   // 가게·지식 질문(biz)은 핏 2번 뒤라 아직 유형이 없다 — 위에서 따로 본다
    if ((s === 'result' || s === 'ebook' || s === 'got' || s === 'seller') && !done()) s = 'cover';
    if (s === 'got' && !gotNow()) s = resultView();
    if (s === 'seller' && !isSeller()) s = 'cover';
    if ((s === 'mine' || s === 'mine2') && !(S.type && S.cat && cat(S.cat) && !isSeller())) s = 'cover';
    if (s === 'mine2' && !S.mine) s = 'mine';
    show(s, false);
  });
  function goBack(fallback) { if (depth > 0) history.back(); else fallback(); }

  var KIT = C.name || '인스타 수익화 스타터 키트';
  var STEP = { fit: '핏 진단 중', diag: '주제 진단 중', card: '주제 진단 결과지', book: '사례 모음' };   // 11/19 대표 「참여리워드는 사전과제? 정도의 느낌인데 너무 딥한건 아냐?」 → 구성품 둘: ① 내 주제 카드 ② 내 분야 사례 모음(수익화 길은 안 씀)
  function head(step, label, pct) {
    return '<div class="top"><span>' + esc(KIT) + '</span><span class="step">' + step + '</span></div>' +
      (pct != null ? '<div class="bar" aria-hidden="true"><i style="width:' + pct + '%"></i></div>' : '') +
      (label ? '<p class="qn">' + label + '</p>' : '');
  }

  function fitCover() {
    /* 큰 제목 덩어리(342×318)를 남는 폭·높이에 맞춰 통째로 줄인다. 낮은 폰에서 오른쪽 아래 글(질문 12개…)이 「키트」 줄보다 길면
       「스타터」와 겹치지 않게 그 글 폭만큼 더 줄인다(대표가 캔버스에서 고친 낮은 폰 375×667 판 = 0.71배와 같은 모양) */
    var s = document.querySelector('#cover .cvs'), g = document.querySelector('#cover .cvbox'), m = document.querySelector('#cover .cvm');
    if (!s || !g || !m) return;
    var k = Math.min(s.clientWidth / 342, (s.clientHeight - 20) / 318, 1.12);
    s.style.setProperty('--m', (k < 0.95 ? 23 : 24) + 'px');
    if (108 * k < m.offsetHeight) k = Math.min(k, (s.clientWidth - m.offsetWidth + 17) / 342);
    k = Math.max(k, 0.6);
    g.style.width = (342 * k) + 'px'; g.style.height = (318 * k) + 'px';
    g.firstChild.firstChild.style.transform = 'scale(' + k + ')';
  }
  window.addEventListener('resize', fitCover);

  var VIEWS = {
    cover: function () {
      /* 표지 — 11/19 대표 확정 「A 포스터」(캔버스 최종본 v42 · 글꼴 페이퍼로지). 노랑 위: 검은 알약 + 큰 제목 덩어리(342×318 기준을
         폰 폭·남는 높이에 맞춰 통째로 줄임 — fitCover) + 오른쪽 아래 「질문 12개, 3분이면 충분해요.」 / 흰 아래: 구성품 둘 + 버튼 */
      var it = function (lb, nm, ds) {
        return '<div class="cvi"><div class="lb">' + lb + '</div><div><div class="nm">' + nm + '</div><div class="ds">' + ds + '</div></div></div>';
      };
      return '<section class="scr" id="cover"><div class="cv">' +
        '<div class="cvy"><span class="cvb">' + esc(C.badge || '무료특강방 참여 리워드') + '</span>' +
          '<div class="cvs"><div class="cvbox"><div class="cvg"><div class="cvg-in">' +
            '<div class="t1">인스타 수익화</div><div class="t2">스타터</div><div class="t2">키트</div>' +
          '</div></div></div><p class="cvm">질문 12개,<br>3분이면<br>충분해요.</p></div></div>' +
        '<div class="cvw">' +
          it('결과 1장', '주제 진단 결과지', '한 줄 컨셉과 「컨셉 좁히기 3단」이 한&nbsp;장에 정리돼요.') +
          it('PDF 1부', '내 분야 사례 모음', '내 분야에 관련된 참고 계정 3곳과 첫 게시물 아이디어 3개를 드려요.') +
          '<button class="btn" data-act="start">내 키트 받기</button>' +
        '</div></div></section>';
    },
    q: function () {
      var i = Math.min(S.ans.length, 4), it = QS[i];
      return '<section class="scr">' + head(STEP.fit, '핏 진단 ' + (i + 1) + ' / 5', (i + 1) * 10) +
        '<h2>' + esc(it.q) + '</h2><p class="lead">' + esc(it.h || '나와 가장 가까운 것 하나를 눌러 주세요.') + '</p>' +
        '<div class="opts">' + it.o.map(function (o, k) {
          return '<button class="opt' + (S.pend === k + 1 ? ' on' : '') + '" data-act="pick" data-v="' + (k + 1) + '"><span>' + esc(o) + '</span></button>';
        }).join('') + '</div>' +
        '<button class="back" data-act="qback">‹ 이전</button></section>';
    },
    tie: function () {
      var t = tops();
      return '<section class="scr">' + head(STEP.fit, '', 50) +
        '<h2>두 유형이<br><span class="hl">비슷하게 나왔습니다</span></h2>' +
        '<p class="lead">시작은 하나로 하는 게 좋습니다. 지금 더 끌리는 쪽을 골라 주세요.</p>' +
        t.map(function (x) {
          var ty = D.types[x];
          return '<button class="card tcard" data-act="type" data-v="' + x + '"><h4>' + esc(ty.name) + '</h4><p>' + esc(typeDesc(x)) + '</p></button>';
        }).join('') +
        '<button class="back" data-act="tieback">‹ 이전</button></section>';
    },
    intro: function () {
      var alt = S.biz && extraKey() && D.talkIntroAlt && D.talkIntroAlt[extraKey()];
      if (alt) {
        var tl = String(alt.title).split('\n');
        return '<section class="scr">' + head(STEP.diag, '', 50) +
          '<h2>' + esc(tl[0]) + (tl.length > 1 ? '<br><span class="hl">' + esc(tl.slice(1).join(' ')) + '</span>' : '') + '</h2>' +
          '<p class="lead">' + esc(alt.body) + '</p>' +
          '<button class="btn" data-act="tstart">다섯 문항 시작하기</button>' +
          '<button class="back" data-act="introback">‹ 이전</button></section>';
      }
      return '<section class="scr">' + head(STEP.diag, '', 50) +
        '<h2>할 얘기가 없다고요?<br><span class="hl">폰을 열어 보세요</span></h2>' +
        '<div class="quote"><b>「저는 너무 평범해서 할 얘기가 없어요.」</b>제가 컨설팅에서 가장 많이 듣는 말입니다. 그런데 얘기를 나눠 보면 누구에게나 할 이야기가 있습니다.<span class="by">— ' + esc(C.live.who) + '</span></div>' +
        '<p class="lead">카드 내역, 인스타 돋보기, 사진첩을 차례로 열어 보며 다섯 문항에 답해 주세요. <b>가장 많이 나온 분야</b>가 내 주제 후보가 됩니다.</p>' +
        '<button class="btn" data-act="tstart">다섯 문항 시작하기</button>' +
        '<button class="back" data-act="introback">‹ 이전</button></section>';
    },
    t: function () {
      var i = Math.min(S.tans.length, D.talk.length - 1), it = D.talk[i];
      return '<section class="scr">' + head(STEP.diag, '할 얘기 찾기 ' + (i + 1) + ' / ' + D.talk.length, 50 + (i + 1) * 50 / D.talk.length) +
        '<h2 class="tq">' + esc(it.q) + '</h2>' + (it.hint ? '<p class="lead">' + esc(it.hint) + '</p>' : '') +
        '<div class="opts tight">' + it.options.map(function (o, k) {
          return '<button class="opt' + (o.cat ? '' : ' none') + (S.pend === k + 1 ? ' on' : '') + '" data-act="tpick" data-v="' + k + '"><span>' + esc(o.label) + '</span></button>';
        }).join('') + '</div>' +
        '<button class="back" data-act="tback">‹ 이전</button></section>';
    },
    verdict: function () {
      var v = talkVerdict(), R = D.talkResult, body;
      if (S.pick || v.kind === 'none') {
        body = '<h2>' + (v.kind === 'none' && !S.pick ? '분야를<br><span class="hl">직접 골라 주세요</span>' : '다른 분야로<br><span class="hl">바꿔 볼까요?</span>') + '</h2>' +
          '<p class="lead">' + esc(v.kind === 'none' ? R.none : '가장 오래 이야기할 수 있는 분야 하나를 골라 주세요.') + '</p>' +
          '<div class="chips" role="list">' + D.categories.map(function (c) { return catBtn(c); }).join('') + '</div>';
      } else if (v.kind === 'two') {
        var a = cat(v.a), b = cat(v.b);
        body = '<h2>내 주제 후보가<br><span class="hl">두 개 나왔습니다</span></h2>' +
          '<p class="lead">' + esc(fill(R.two, { a: a.name, b: b.name })) + '</p>' +
          '<div class="chips">' + catBtn(a, true) + catBtn(b, true) + '</div>' +
          '<button class="btn line chg" data-act="change">' + esc(R.change) + '</button>';
      } else {
        var c = cat(v.a);
        body = '<h2>내 주제 후보는<br><span class="hl">' + esc(c.name) + '</span></h2>' +
          '<p class="lead">' + esc(fill(R.one, { n: v.n[v.a], cat: c.name })) + '</p>' +
          '<button class="btn" data-act="cat" data-v="' + esc(c.id) + '">이 분야로 결과지 만들기</button>' +
          '<button class="btn line chg" data-act="change">' + esc(R.change) + '</button>';
      }
      return '<section class="scr">' + head(STEP.diag, '', 100) + body +
        '<button class="back" data-act="vback">‹ 이전</button></section>';
    },
    mine: function () {
      /* 컨셉 좁히기 1 — 고른 답 가운데 가장 꽂혀 있는 것(주관식 · 필수). 막히면 아래 예시를 눌러 칸에 채운다.
         적은 글은 이 기기에만 두고 시트로 보내지 않는다(동의 받는 항목이 아님) */
      var M = D.mineQ || {}, c = cat(S.cat) || { name: '', emoji: '' }, pk = picked();
      var recs = ((D.recs[S.cat] || {})[S.type] || []).slice(0, 3);
      var ex = (recs[0] || {}).s2 || '';
      var q = pk.length >= 2 ? fill(M.q1 || '', { picks: pk.map(function (x) { return x.label; }).join(', ') }) : fill(M.q1alt || '', { cat: c.name });
      return '<section class="scr">' + head(STEP.diag, esc(M.step1 || ''), 100) +
        '<h2 class="tq">' + esc(q) + '</h2>' +
        '<p class="lead">' + esc(M.hint1 || '') + '</p>' +
        '<div class="fld"><input id="i_mine" type="text" maxlength="30" autocomplete="off" placeholder="' + esc(ex ? '예: ' + ex : '') + '" value="' + esc(S.mine || '') + '"></div>' +
        '<p class="formerr" id="merr" role="alert"></p>' +
        '<button class="btn" data-act="minego">' + esc(M.next || '다음') + '</button>' +
        fills(pk.map(function (x) { return x.label; }).concat(recs.map(function (x) { return x.s2; }))) +
        '<button class="back" data-act="mineback">‹ 이전</button></section>';
    },
    mine2: function () {
      /* 컨셉 좁히기 2 — 그 주제에 관심 있는 사람이 검색할 것(주관식 · 필수) = 올릴 내용 */
      var M = D.mineQ || {};
      var recs = ((D.recs[S.cat] || {})[S.type] || []).slice(0, 3);
      function trim(t) { return String(t || '').replace(/\(.*$/, '').replace(/^ +| +$/g, ''); }
      var ex = trim((recs[0] || {}).s3);
      return '<section class="scr">' + head(STEP.diag, esc(M.step2 || ''), 100) +
        '<h2 class="tq">' + esc(fill(M.q2 || '', { a: S.mine })) + '</h2>' +
        '<p class="lead">' + esc(M.hint2 || '') + '</p>' +
        '<div class="fld"><input id="i_mine" type="text" maxlength="40" autocomplete="off" placeholder="' + esc(ex ? '예: ' + ex : '') + '" value="' + esc(S.mine2 || '') + '"></div>' +
        '<p class="formerr" id="merr" role="alert"></p>' +
        '<button class="btn" data-act="mine2go">' + esc(M.go || '결과 보기') + '</button>' +
        fills(recs.map(function (x) { return trim(x.s3); })) +
        '<button class="back" data-act="mineback">‹ 이전</button></section>';
    },
    biz: function () {
      var B = extraQ() || D.bizQ;
      return '<section class="scr">' + head(STEP.fit, '핏 진단 2번에 이어서', 20) +
        '<h2 class="tq">' + esc(B.q) + '</h2>' + (B.hint ? '<p class="lead">' + esc(B.hint) + '</p>' : '') +
        '<div class="opts tight">' + B.options.map(function (o, k) {
          return '<button class="opt" data-act="bizpick" data-v="' + k + '"><span>' + esc(o.label) + '</span></button>';
        }).join('') + '</div>' +
        '<button class="back" data-act="bizback">‹ 이전</button></section>';
    },
    seller: function () {
      var c = cat(S.cat) || { name: '', emoji: '' }, R = sellerData(), BR = bridge();
      var topic = S.bizLabel || c.name;
      return '<section class="scr">' + head(STEP.card, '', null) +
        '<h2>결과가<br><span class="hl">나왔습니다</span></h2>' +
        sec(1, '핏 진단 결과') +
        typeBox() + showLines() +
        sec(2, '주제 진단 결과') +
        '<div class="tbox"><div class="k">내 계정 주제</div><div class="t">' + esc(topic) + '</div>' + (R.intro ? '<p>' + esc(R.intro) + '</p>' : '') + '</div>' +
        sec(3, '할 일') + '<p class="cap3">' + esc(BR ? BR.line : R.title) + '</p>' +   // 11/23 대표 「1, 2 처럼 TODO 나 뭐 이런식으로 하나 같은 위계로」 · 파는 것 ≠ 목표면 잇는 칸
        numList('how', BR && BR.tips ? BR.tips : (R.tips || [])) + todoLast() +
        (S.ans[2] === 3 && D.timeNote ? '<p class="hint">' + esc(D.timeNote) + '</p>' : '') +
        sec(0, '다음 순서') +
        liveBox() +
        ebookBox(R.ebookTitle, R.ebookDesc) +
        '<button class="again" data-act="restart">처음부터 다시 하기</button></section>';
    },
    result: function () {
      var c = cat(S.cat) || { name: '', emoji: '' };
      var list = ((D.recs[S.cat] || {})[S.type] || []).slice(0, 3);
      var k = Math.min(S.rec || 0, Math.max(list.length - 1, 0)), r = list[k] || { s1: '', s2: '', s3: '', line: '' };
      var NT = D.narrowTips || {}, pk = picked(), MQ = D.mineQ || {};   // 11/20 대표 「좁힌 분야를 정할 수 있는 팁을 준다거나 … 지금의 질문지를 좁힌 분야에 반영」
      return '<section class="scr">' + head(STEP.card, '', null) +
        '<h2>결과가<br><span class="hl">나왔습니다</span></h2>' +
        sec(1, '핏 진단 결과') +
        typeBox() + showLines() +
        sec(2, '주제 진단 결과') +
        ladderBox(c, S.mine ? { s1: c.name, s2: S.mine, s3: S.mine2, mine: true } : r, MQ) + '<div class="rest">' +
          (pk.length ? '<div class="pk"><div class="pkk">' + esc(NT.pickedLabel || '') + '</div><ul>' +
            pk.map(function (x) { return '<li><small>' + esc(x.q) + '</small>' + esc(x.label) + '</li>'; }).join('') + '</ul></div>' : '') +
'</div>' +
        (function () {   // 11/23 파는 것이 없는데 상담·매출을 바라면 할 일 앞에 두 줄(잇는 칸)
          var BR = bridge(), pre = BR && BR.pre ? BR.pre : [], base = NT.title && !S.mine ? [pk.length ? NT.firstPicked : NT.first].concat(NT.rest || []) : [];
          if (!pre.length && !base.length) return '';
          return sec(3, '할 일') + '<p class="cap3">' + esc(BR ? BR.line : NT.title) + '</p>' + numList('nt', pre.concat(base)) + todoLast();
        })() +
        (list.length > 1
          ? (S.mine
              ? '<p class="sub4">' + esc(MQ.refTitle || '참고') + '</p><div class="recs ref">' +
                list.map(function (x) { return '<div class="recbtn"><small>' + esc(x.s1) + ' › ' + esc(x.s2) + '</small><span>' + esc(x.s3) + '</span></div>'; }).join('') + '</div>'
              : '<p class="sub4">' + esc(NT.recsTitle || '추천 주제') + ' ' + list.length + '개</p><p class="lead sm">골라 누르면 위 상자가 그 주제로 바뀝니다.</p><div class="recs">' +
                list.map(function (x, i) {
                  return '<button class="recbtn' + (i === k ? ' on' : '') + '" data-act="rec" data-v="' + i + '"><small>' + esc(x.s1) + ' › ' + esc(x.s2) + '</small><span>' + esc(x.s3) + '</span></button>';
                }).join('') + '</div>')
          : '') +
        (S.mine ? '' : '<p class="hint">위 상자의 한 줄은 예시입니다. 예시에 나온 나이·성별·상황·지역·금액·경력은 내 상황에 맞게 바꿔 쓰세요. 경험이 아직 없다면 「처음 알아보는 과정」을 기록하는 것부터 해도 됩니다.</p>') +
        (S.ans[2] === 3 && D.timeNote ? '<p class="hint">' + esc(D.timeNote) + '</p>' : '') +
        sec(0, '다음 순서') +
        liveBox() +
        ebookBox(c.name + ' 분야 사례 모음', '이 분야 계정 사례와 바로 써 볼 첫 게시물 아이디어를 모았습니다.') +
        '<button class="again" data-act="restart">처음부터 다시 하기</button></section>';
    },
    ebook: function () {
      var c = cat(S.cat) || { name: '' };
      function item(k) {
        var m = C[k];
        return '<div class="item" data-k="' + k + '"><label class="ck"><input type="checkbox" id="c_' + k + '"><span>' + esc(m.label) + '</span></label>' +
          '<details><summary aria-label="자세히 보기"></summary><div class="body">' + m.rows.map(function (r) { return '<b>' + esc(r[0]) + '</b> ' + esc(r[1]); }).join('<br>') + '</div></details>' +
          (k === 'privacy' ? '<p class="err">사례 모음을 받으시려면 개인정보 수집·이용에 동의해 주세요.</p>' : '') + '</div>';
      }
      return '<section class="scr">' + head(STEP.book, '', null) +
        (PREVIEW ? '<p class="pv">미리보기 화면입니다. 눌러도 시트에 적지 않아요.</p>' : '') +
        (isSeller() ? '<h2><span class="hl">' + esc(sellerData().ebookTitle) + '</span></h2>'
                    : '<h2>' + esc(c.name) + ' 분야<br><span class="hl">사례 모음</span></h2>') +
        '<p class="lead">이름, 휴대폰 번호, 메일 주소를 적으면 바로 이 화면에서 사례 모음을 열 수 있습니다.</p>' +
        '<form id="f" novalidate>' +
        '<div class="fld" id="w_name"><label for="i_name">이름 또는 닉네임</label><input id="i_name" type="text" maxlength="30" autocomplete="name" placeholder="예: 홍길동">' +
        '<p class="err">이름이나 닉네임을 적어 주세요.</p></div>' +
        '<div class="fld" id="w_phone"><label for="i_phone">휴대폰 번호</label><span class="hint">숫자만 적어 주세요 (예: 01012345678)</span>' +
        '<input id="i_phone" type="tel" inputmode="numeric" maxlength="13" autocomplete="tel" placeholder="01012345678"><p class="confirm" id="pconf"></p>' +
        '<p class="err">휴대폰 번호를 숫자로만 적어 주세요. (예: 01012345678)</p></div>' +
        '<div class="fld" id="w_email"><label for="i_email">메일 주소</label><span class="hint">사례 모음 링크를 이 주소로도 보내 드려요.</span>' +
        '<input id="i_email" type="email" inputmode="email" maxlength="120" autocomplete="email" autocapitalize="off" spellcheck="false" placeholder="예: name@example.com">' +
        '<p class="err">메일 주소를 다시 확인해 주세요.</p></div>' +
        '<div class="agree"><label class="all"><input type="checkbox" id="c_all"> 모두 동의하기</label>' + item('privacy') + item('marketing') + '</div>' +
        '<div class="hp" aria-hidden="true"><label>웹사이트<input type="text" id="website" tabindex="-1" autocomplete="off"></label></div>' +
        '<button class="btn" type="submit" id="go">사례 모음 받기</button><p class="formerr" id="ferr" role="alert"></p>' +
        '</form>' +
        '<p class="legal">광고성 정보 수신에 동의하지 않으셔도 사례 모음은 그대로 받으실 수 있습니다. <a href="' + esc(C.privacyUrl) + '" target="_blank" rel="noopener">개인정보처리방침</a></p>' +
        '<button class="back" data-act="ebback">‹ 결과로 돌아가기</button></section>';
    },
    got: function () {
      var g = gotNow() || {}, url = g.url || ebookUrl();
      /* 메일 문장은 서버가 돌려준 결과대로만(11/20) — sent 보냈다 · queued(한도 초과 + 다음 날 다시 보내기가 도는 중) 늦게 · 그 밖(실패·한도 초과인데 다시 보내기 확인 안 됨·두 번 누름) 말 안 함 */
      var ml = g.mail === 'sent' ? '적어 주신 메일로도 링크를 보내 드렸습니다.' : g.mail === 'queued' ? '메일은 조금 늦게 도착할 수 있습니다.' : '';
      return '<section class="scr">' + head(STEP.book, '', null) +
        (g.preview ? '<p class="pv">미리보기라 시트에 적지 않았어요.' + (url ? '' : ' 이 분야 사례 모음 링크가 아직 비어 있습니다(config.js EBOOKS).') + '</p>' : '') +
        '<div class="donebox"><h2>사례 모음이 준비됐습니다</h2><p>아래 버튼을 누르면 바로 열립니다.</p>' + (ml ? '<p class="mailed">' + ml + '</p>' : '') +
        (url ? '<a class="btn yel" href="' + esc(url) + '" target="_blank" rel="noopener">사례 모음 열기</a>' +
               '<button class="btn kk" type="button" data-act="kakao">나와의 채팅에 보내 두기</button>' +
               (canShare() ? '<p class="kkh">공유 창에서 카카오톡 → 나와의 채팅을 고르세요.</p>' : '') +
               '<div id="kkmsg" role="status" aria-live="polite"></div>'
             : '<button class="btn" disabled>사례 모음 링크 준비 중</button>') + '</div>' +
        liveBox() +
        '<div class="kitdone"><div class="k">' + esc(KIT) + ' · 구성품 2가지를 모두 받으셨습니다</div>' +
          '<ul><li>주제 진단 결과지</li><li>내 분야 사례 모음</li></ul></div>' +
        '<button class="again" data-act="toresult">결과지 다시 보기</button>' +
        (g.mk ? '<p class="tail">[광고성 정보 수신동의 처리 결과]<br>귀하는 ' + esc(g.on) + ' 부트니스의 광고성 정보 수신에 동의하셨으며, 수신동의 처리가 완료되었습니다.</p>'
              : '<p class="tail">강의·이벤트 안내 받기는 동의하지 않으신 것으로 처리했습니다.</p>') +
        '</section>';
    }
  };
  /* 답과 유형이 엇갈려 보일 수 있는 자리에 붙는 한 줄(11/20 대표 「나오면 안되는 결과가 나오는 경우」 · GPT·제미나이 검토)
     ③인데 얼굴 괜찮다 → 얼굴 섞어도 됨 / ③인데 얼굴은 싫고 말하기가 편하다 → 목소리 / ①인데 가게·서비스 이름으로 → 그 이름을 앞세워도 됨 / ②인데 얼굴 싫다 → 손·과정으로 */
  /* 결과 화면의 위계(11/20 대표 「지금 위계가 없다」): 큰 제목 → 카드 → 번호 붙은 결과 두 덩이(1 핏 진단 결과 · 2 주제 진단 결과) → 상자 → 작은 안내 줄 */
  /* 할 얘기 찾기에서 지금 분야로 고른 답들 — 좁힌 분야를 정할 재료로 결과에 다시 보여 준다 */
  function picked() {
    var a = [];
    (S.tans || []).forEach(function (c, i) {
      if (!c || c !== S.cat || !D.talk[i]) return;
      (D.talk[i].options || []).forEach(function (o) { if (o.cat === c) a.push({ q: D.talk[i].short || ('문항 ' + (i + 1)), label: o.label }); });
    });
    return a;
  }
  function fills(arr) {
    var seen = {}, a = [];
    (arr || []).forEach(function (t) { t = String(t || ''); if (t && !seen[t]) { seen[t] = 1; a.push(t); } });
    if (!a.length) return '';
    return '<div class="exs"><div class="exk">' + esc((D.mineQ || {}).fillLabel || '') + '</div>' +
      a.map(function (t) { return '<button type="button" class="ex" data-act="minefill" data-v="' + esc(t) + '">' + esc(t) + '</button>'; }).join('') + '</div>';
  }
  function sec(n, title) { return '<div class="sec">' + (n ? '<span class="n">' + n + '</span>' : '') + '<h3>' + esc(title) + '</h3></div>'; }
  function typeBox() { return '<div class="tybox"><div class="k">내 계정 유형</div><div class="t">' + esc(typeName(S.type)) + '</div><p>' + esc(typeDesc(S.type)) + '</p></div>'; }
  function showLines() {   // 11/23 1번(얼굴·이름) · 4번(형식) 답으로 고른 두 줄
    var L = D.showLines || {}, f = (L.face || {})[S.ans[0]], g = (L.form || {})[S.ans[3]];
    return f || g ? '<ul class="show">' + (f ? '<li>' + esc(f) + '</li>' : '') + (g ? '<li>' + esc(g) + '</li>' : '') + '</ul>' : '';
  }
  function todoLast() { return D.todoLast ? '<p class="hint">' + esc(D.todoLast) + '</p>' : ''; }
  function numList(cls, arr) { return '<' + (cls === 'how' ? 'ul' : 'ol') + ' class="' + cls + '">' + arr.map(function (t, i) { return '<li><span class="no">' + (i + 1) + '</span>' + esc(t) + '</li>'; }).join('') + '</' + (cls === 'how' ? 'ul' : 'ol') + '>'; }
  function notes() {
    var N = D.notes || {}, a = S.ans, k = '';
    if (S.type === '3' && a[0] === 1) k = 'face';
    else if (S.type === '3' && a[0] === 3 && a[3] === 1) k = 'voice';
    else if (S.type === '1' && a[0] === 2) k = 'name';
    else if (S.type === '2' && a[0] === 3) k = 'shop';
    return k && N[k] ? '<p class="hint note">' + esc(N[k]) + '</p>' : '';
  }
  function bizNote() {                                            // 가게 분야로 정했고, 할 얘기에서 다른 분야가 나왔을 때만
    var EQ = extraQ(); if (!S.biz || !EQ || !EQ.note) return '';
    var v = talkVerdict(), t = v.kind === 'none' ? '' : v.a;
    if (!t || t === S.cat || !cat(t)) return '';
    return '<p class="mine biz">' + esc(fill(EQ.note, { cat: cat(t).name })) + '</p>';
  }
  /* ② 내 주제 상자 — 11/23 대표 「노란박스를 없애고 아래 내용에 박스나 서식 등을 이용해서 강약을 줘」. 노란 카드(같은 말 되풀이)를 빼고 2번 안에 굵은 테두리 상자 하나로 */
  function ladderBox(c, r, MQ) {
    var mine = !!r.mine;
    return '<div class="tbox"><div class="k">' + esc(mine ? (MQ.cap || '컨셉 좁히기 3단') : '컨셉 좁히기 3단 · 예시') + '</div>' +
      '<div class="lad"><div><small>큰 분야</small><span>' + esc(r.s1 || c.name) + '</span></div>' +
      '<div><small>좁힌 분야</small><span>' + esc(r.s2) + '</span></div>' +
      (r.s3 ? '<div class="l3"><small>올릴 내용</small><span><em>' + esc(r.s3) + '</em></span></div>' : '') + '</div>' +
      (!mine && r.line ? '<div class="ln"><small>내 계정 한 줄 · 예시</small><b>' + esc(r.line) + '</b></div>' : '') +
      (MQ && MQ.label ? '<button class="lnk" data-act="mineedit">' + esc(mine ? (MQ.edit || '고치기') : ((MQ.add || '직접 적기') + ' ›')) + '</button>' : '') +
      '</div>';
  }
  /* (11/19부터 안 씀 — 「사전과제 정도」로 줄이며 화면에서 뺐다. 되살리려면 result·seller 에 moneyPath() 한 줄만 다시 넣는다) 내 수익화 길 — 유형별로 돈이 들어오는 길과 먼저 갖출 것(11/17 대표 「인스타 수익화와 관련된 일반적인 노하우도 더해서」). data.js moneyPath 가 없으면 안 그린다 */
  function moneyPath() {
    var M = D.moneyPath && (D.moneyPath[isSeller() && S.type === '3' ? 's3' : S.type] || D.moneyPath[S.type]); if (!M) return '';
    return '<div class="money"><div class="k">구성품 ② · 내 수익화 길</div><h4>' + esc(M.title) + '</h4>' +
      '<ul class="ways">' + (M.ways || []).map(function (w) { return '<li><b>' + esc(w[0]) + '</b>' + esc(w[1]) + '</li>'; }).join('') + '</ul>' +
      ((M.first || []).length ? '<div class="first"><small>먼저 갖출 것</small><ul>' + M.first.map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('') + '</ul></div>' : '') +
      (M.note ? '<p class="nt">' + esc(M.note) + '</p>' : '') + '</div>';
  }
  /* ② 내 분야 사례 모음(옛 「③ 맞춤 전자책」) — 열두 편 모두 같은 짜임(사례 셋 · 첫 게시물 셋, 11/19 줄임)이라 구성을 그대로 적는다 */
  function ebookBox(titleHtml, desc, raw) {
    var eb = ebookUrl();
    return '<div class="ebk"><div class="k">키트 구성품 · PDF 1부</div><h4>' + (raw ? titleHtml : esc(titleHtml)) + '</h4>' +
      (eb || PREVIEW
        ? '<p>' + esc(desc) + '</p><ul class="inside"><li>계정 사례 3개</li><li>첫 게시물 3개</li></ul>' +
          '<button class="btn yel" data-act="ebook">사례 모음 받기</button>'
        : '<div class="soon">이 사례 모음은 준비하고 있습니다. 곧 이 화면에서 받으실 수 있습니다.</div>') + '</div>';
  }
  function liveBox() {
    /* 받는 분은 모두 이미 무료특강방에 있다 — 홍보·방 들어가기 없이 「라이브에 꼭, 끝까지 들으면 선물 한 번 더」만(11/16 대표) */
    var what = isSeller() ? '여러분 계정을 어떻게 키워 갈지' : '오늘 정한 주제로 다음에 무엇을 하면 되는지';
    return '<div class="livebox"><div class="k">다음은 무료 라이브입니다</div><div class="d">' + esc(C.live.date) + '</div><div class="t">' + esc(C.live.title) + ' · ' + esc(C.live.who) + '</div>' +
      '<p>라이브에서 ' + what + ' 제가 직접 알려 드리겠습니다.</p>' +
      '<div class="rw"><b>라이브 리워드</b><span>라이브를 끝까지 들으시면 「프로필 세팅 순서」를 선물로 한 번 더 드립니다.</span></div>' +
      '<div class="rw"><b>후기 리워드</b><span>특강 후기를 남겨 주신 분을 위해 이름과 소개 세 줄을 제가 직접 봐 드리는 피드백 라이브(1시간)를 엽니다. 날짜는 차후 공지드립니다.</span></div>' +
      '<p class="where">시청 링크는 그날 무료특강방에 올라옵니다.</p></div>';
  }

  /* ── 화면을 그린 뒤 붙일 것 ───────────────────────────── */
  function enterGo(act) { var mi = document.getElementById('i_mine'); if (mi) mi.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.keyCode === 13) { e.preventDefault(); var b = document.querySelector('[data-act=' + act + ']'); if (b) b.click(); } }); }
  var AFTER = {
    mine: function () { enterGo('minego'); },
    mine2: function () { enterGo('mine2go'); },
    ebook: function () {
      var f = document.getElementById('f'), ph = document.getElementById('i_phone'), all = document.getElementById('c_all');
      var cp = document.getElementById('c_privacy'), cm = document.getElementById('c_marketing');
      function syncAll() { all.checked = cp.checked && cm.checked; }
      all.addEventListener('change', function () { cp.checked = cm.checked = all.checked; clearBad(); });
      cp.addEventListener('change', function () { syncAll(); clearBad(); });
      cm.addEventListener('change', syncAll);
      function clearBad() { if (cp.checked) cp.closest('.item').classList.remove('bad'); }
      ph.addEventListener('input', function () {
        ph.value = ph.value.replace(/\D/g, '').slice(0, 11);
        var ok = /^01\d{8,9}$/.test(ph.value);
        document.getElementById('pconf').textContent = ok ? fmt(ph.value) + ' 맞는지 한 번 더 봐 주세요' : '';
        if (ok) document.getElementById('w_phone').classList.remove('bad');
      });
      document.getElementById('i_name').addEventListener('input', function () { if (this.value.trim()) document.getElementById('w_name').classList.remove('bad'); });
      document.getElementById('i_email').addEventListener('input', function () { if (EMAIL_RE.test(this.value.trim())) document.getElementById('w_email').classList.remove('bad'); });
      f.addEventListener('submit', function (e) { e.preventDefault(); submit(); });
    }
  };
  function fmt(v) { return String(v).replace(/^(\d{3})(\d{3,4})(\d{4})$/, '$1-$2-$3'); }

  /* ── 나와의 채팅에 보내 두기(11/20 대표) ───────────────────
     카카오 JS 키가 없어 카카오 공유(SDK)는 못 쓴다 → 폰이면 시스템 공유 창(navigator.share)에서 카카오톡 → 나와의 채팅을 고르게 하고,
     공유 창이 없거나(안드로이드 카톡 안 브라우저 · PC) 막히면 제목과 링크를 복사해 붙여 넣게 한다. 복사도 막히면 주소를 보여 주고 길게 눌러 복사하게 */
  function canShare() {
    var ua = navigator.userAgent || '';
    var phone = /Android|iPhone|iPad|iPod/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);   // PC 공유 창에는 카카오톡이 없을 때가 많다
    return phone && typeof navigator.share === 'function';
  }
  function kkSay(html) { var el = document.getElementById('kkmsg'); if (el) el.innerHTML = html; }
  function copyText(t) {
    function legacy() {
      var ta = document.createElement('textarea'), ok = false;
      ta.value = t; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.top = '0'; ta.style.left = '-9999px'; ta.style.fontSize = '16px';
      document.body.appendChild(ta); ta.select(); try { ta.setSelectionRange(0, t.length); } catch (x) {}
      try { ok = document.execCommand('copy'); } catch (x) { ok = false; }
      document.body.removeChild(ta);
      return ok;
    }
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function' && window.isSecureContext) {
      return navigator.clipboard.writeText(t).then(function () { return true; }, function () { return legacy(); });
    }
    return Promise.resolve(legacy());
  }
  function toKakao() {
    var url = (gotNow() || {}).url || ebookUrl(); if (!url) return;
    var title = bookTitle(), text = title + '\n' + url;
    function copyWay() {
      copyText(text).then(function (ok) {
        kkSay(ok ? '<p class="kkm">링크를 복사했습니다. 카카오톡 「나와의 채팅」에 붙여 넣어 두세요.</p>'
                 : '<p class="kkm">이 화면에서는 복사가 되지 않습니다. 아래 주소를 길게 눌러 복사해 주세요.</p><span class="kku">' + esc(url) + '</span>');
      });
    }
    kkSay('');
    if (!canShare()) { copyWay(); return; }
    try {
      navigator.share({ title: title, text: title, url: url }).then(function () {}, function (err) {
        if (err && err.name === 'AbortError') return;                // 공유 창을 그냥 닫은 것 — 아무 말 안 한다
        copyWay();                                                   // 막혔으면(카톡 안 브라우저 등) 복사로
      });
    } catch (x) { copyWay(); }
  }

  /* ── 보내기 ────────────────────────────────────────────── */
  var sending = false;
  function submit() {
    if (sending) return;
    var name = document.getElementById('i_name').value.trim();
    var phone = document.getElementById('i_phone').value.replace(/\D/g, '');
    var cp = document.getElementById('c_privacy').checked, cm = document.getElementById('c_marketing').checked;
    var bad = [];
    document.getElementById('w_name').classList.toggle('bad', !name); if (!name) bad.push('w_name');
    var pOk = /^01\d{8,9}$/.test(phone);
    document.getElementById('w_phone').classList.toggle('bad', !pOk); if (!pOk) bad.push('w_phone');
    var email = document.getElementById('i_email').value.trim();
    var eOk = email.length <= 120 && EMAIL_RE.test(email);
    document.getElementById('w_email').classList.toggle('bad', !eOk); if (!eOk) bad.push('w_email');
    var pi = document.querySelector('.item[data-k="privacy"]');
    pi.classList.toggle('bad', !cp); if (!cp) bad.push('privacy');
    var fe = document.getElementById('ferr');
    if (bad.length) {
      fe.textContent = '빨간 글씨로 표시된 칸을 확인해 주세요.';
      var el = bad[0] === 'privacy' ? pi : document.getElementById(bad[0]);
      if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    fe.textContent = '';
    var c = cat(S.cat);
    var answers = { ptype: NO[S.type - 1] + ' ' + typeName(S.type), cat: c ? c.name : S.cat, name: name, phone: phone, email: email, book: ebookKey(),
                    picks: S.ans.join('·') + (isSeller() ? ' | ' + extraKey() + ':' + S.biz : ' | ' + S.tans.map(function (c) { return c || '-'; }).join('·') + ' | 주제' + ((S.rec || 0) + 1)), src: SRC };
    if (REF) answers.ref = REF;
    var items = ['privacy', 'marketing'].map(function (k) {
      return { key: k, agreed: k === 'privacy' ? cp : cm, label: C[k].label, notice: C[k].rows.map(function (r) { return r[0] + ': ' + r[1]; }).join(' / ') };
    });
    var body = { form: C.formId, answers: answers, consentPrivacy: cp, consentMarketing: cm,
                 website: document.getElementById('website').value, consent: { version: C.CONSENT_VERSION, items: items } };
    var today = new Date(), on = today.getFullYear() + '년 ' + (today.getMonth() + 1) + '월 ' + today.getDate() + '일';
    if (PREVIEW) {
      window.__MYTOPIC_LAST = body;                                  // 미리보기 — 보낼 내용만 남긴다(시험용)
      S.got = { preview: true, url: ebookUrl(), sig: sig(), mk: cm, on: on, mail: PVMAIL };
      show('got'); return;
    }
    var go = document.getElementById('go');
    sending = true; go.disabled = true; go.textContent = '보내는 중… 잠시만 기다려 주세요';
    var payload = JSON.stringify(body), snap = sig(), url0 = ebookUrl();   // 보낸 때의 결과를 잡아 둔다 — 답이 늦게 와도 다른 결과에 붙지 않게
    function post() {
      return fetch(C.endpoint, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: payload })
        .then(function (r) { return r.json(); });
    }
    function doubtful(j) { return !!(j && j.ok && (j.ping || !j.id)); }
    post()
      .then(function (j) { return doubtful(j) ? post() : j; })
      .then(function (j) {
        if (j && j.ok && j.id) {
          var m = String(j.at || '').match(/^(\d{4})-(\d{2})-(\d{2})/);
          if (sig() !== snap || cur !== 'ebook') return;                 // 기다리는 사이 다른 결과로 갔으면 지금 화면을 건드리지 않는다
          S.got = { id: j.id, url: url0, sig: snap, mk: j.marketing === true, on: m ? (m[1] + '년 ' + (+m[2]) + '월 ' + (+m[3]) + '일') : on, mail: String(j.mail || '') };
          show('got'); return;
        }
        if (j && j.error === 'closed') { fe.textContent = '사례 모음 신청 기간이 끝났습니다.'; return; }
        if (j && j.error === 'invalid') { fe.textContent = '적으신 내용을 한 번 더 확인해 주세요. 이름, 휴대폰 번호, 메일 주소를 적고 필수 항목에 동의해 주세요.'; return; }
        throw new Error((j && j.error) || 'fail');
      })
      .catch(function () { if (cur === 'ebook') fe.textContent = '연결이 불안정해서 보내지 못했습니다. 다시 눌러 주세요.'; })
      .then(function () { sending = false; go.disabled = false; go.textContent = '사례 모음 받기'; });
  }

  /* ── 누르기 ────────────────────────────────────────────── */
  app.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('[data-act]') : null;
    if (!b || b.disabled) return;
    var act = b.getAttribute('data-act'), v = b.getAttribute('data-v');
    if (act === 'start') { S = { ans: [], type: '', tans: [], biz: '', bizLabel: '', cat: '', mine: '', mine2: '', pick: false, rec: 0, got: null }; S.pend = 0; show('q'); }   // 처음부터면 앞서 받은 사례 모음 기록(got)까지 지운다 — 다른 분야 링크가 남지 않게(11/20)
    else if (act === 'pick') {
      if (S.pend) return;                                          // 연달아 두 번 누름 막기
      var pv = +v, n0 = S.ans.length; S.pend = pv; b.classList.add('on');
      setTimeout(function () {
        if (cur !== 'q' || S.pend !== pv || S.ans.length !== n0) return;   // 그사이 「이전」을 눌렀으면 넣지 않는다(0이 답으로 들어가던 문제)
        S.ans.push(pv); S.pend = 0;
        if (S.ans.length === 2) { S.biz = ''; S.bizLabel = ''; S.cat = ''; if (extraKey()) { show('biz'); return; } }   // 2번 답이 바뀌면 앞서 고른 가게·지식 답은 지운다
        if (S.ans.length < 5) { show('q'); return; }
        var t = tops();
        if (t.length > 1) { show('tie'); return; }
        S.type = t[0]; resetCat(); show(isSeller() ? 'seller' : 'intro');
      }, 220);
    }
    else if (act === 'qback' || act === 'tieback') goBack(function () { if (S.ans.length) { S.ans.pop(); S.type = ''; show('q', false); } else show('cover', false); });
    else if (act === 'type') { S.type = v; resetCat(); show(isSeller() ? 'seller' : 'intro'); }
    else if (act === 'introback') goBack(function () { S.ans.pop(); S.type = ''; show('q', false); });
    else if (act === 'tstart') { S.tans = []; S.pick = false; S.pend = 0; if (S.biz) S.cat = S.biz; show('t'); }
    else if (act === 'tpick') {
      if (S.pend) return;
      var it = D.talk[Math.min(S.tans.length, D.talk.length - 1)];
      var tv = +v + 1, t0 = S.tans.length; S.pend = tv; b.classList.add('on');
      setTimeout(function () {
        if (cur !== 't' || S.pend !== tv || S.tans.length !== t0) return;
        var o = it.options[tv - 1]; S.pend = 0;
        S.tans.push(o && o.cat ? o.cat : '');
        if (S.tans.length < D.talk.length) { show('t'); return; }
        S.pick = false;
        if (extraQ() && S.biz) { S.cat = S.biz; S.rec = 0; show('result'); } else show('verdict');
      }, 220);
    }
    else if (act === 'tback') goBack(function () { if (S.tans.length) { S.tans.pop(); show('t', false); } else show('intro', false); });
    else if (act === 'bizpick') { var EQ = extraQ(), bo = EQ && EQ.options[+v]; if (bo && cat(bo.cat)) { S.biz = bo.cat; S.bizLabel = bo.label; S.cat = bo.cat; show('q'); } }
    else if (act === 'bizback') goBack(function () { S.ans.pop(); S.biz = ''; S.bizLabel = ''; S.cat = ''; show('q', false); });
    else if (act === 'change') { S.pick = true; show('verdict', false); }
    else if (act === 'vback') { if (S.pick && talkVerdict().kind !== 'none') { S.pick = false; show('verdict', false); } else goBack(function () { S.tans.pop(); resetCat(); show('t', false); }); }
    else if (act === 'cat') { if (cat(v)) { if (S.cat !== v) { S.got = null; S.mine = ''; S.mine2 = ''; } S.cat = v; S.biz = ''; S.rec = 0; show(D.mineQ ? 'mine' : 'result'); } }
    else if (act === 'minefill') {
      var fi = document.getElementById('i_mine'), fe2 = document.getElementById('merr');
      if (fi) { fi.value = String(v || '').slice(0, +fi.getAttribute('maxlength') || 40); try { fi.focus(); } catch (x) {} }
      if (fe2) fe2.textContent = '';
    }
    else if (act === 'minego' || act === 'mine2go') {
      var mi = document.getElementById('i_mine'), me = document.getElementById('merr');
      var val = mi ? String(mi.value || '').replace(/\s+/g, ' ').replace(/^ | $/g, '') : '';
      if (!val) { if (me) me.textContent = (D.mineQ || {}).err || ''; if (mi) { try { mi.focus(); } catch (x) {} } return; }   // 필수 — 빈칸이면 넘어가지 않는다
      if (act === 'minego') { var was = S.mine; S.mine = val.slice(0, 30); if (S.mine !== was) S.mine2 = ''; show('mine2'); }
      else { S.mine2 = val.slice(0, 40); show('result'); }
    }
    else if (act === 'mineedit') show('mine');
    else if (act === 'mineback') goBack(function () { show('result', false); });
    else if (act === 'rec') { S.rec = +v || 0; show('result', false); }
    else if (act === 'ebook') show('ebook');
    else if (act === 'ebback') goBack(function () { show(resultView(), false); });
    else if (act === 'toresult') show(resultView());
    else if (act === 'kakao') toKakao();
    else if (act === 'restart') { S = { ans: [], type: '', tans: [], biz: '', bizLabel: '', cat: '', mine: '', mine2: '', pick: false, rec: 0, got: null }; show('cover'); }
  });

  /* 첫 화면 — 새로고침이면 있던 자리로(답이 모자라면 표지) */
  var start = 'cover';
  if (done() && gotNow()) start = 'got';
  else if (done()) start = resultView();
  S.pend = 0;
  try { hi = (history.state && history.state.i) || 0; history.replaceState({ s: start, i: hi }, '', location.href); } catch (e) {}
  show(start, false);
})();
