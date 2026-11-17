
(function () {
  'use strict';
  var CONFIG = window.UML_CONFIG || {};

  function DCLogic(props) { this.props = props || {}; this.state = {}; }
  DCLogic.prototype.setState = function (patch) {
    var p = typeof patch === 'function' ? patch(this.state) : patch;
    this.state = Object.assign({}, this.state, p);
    if (this.__render) this.__render();
  };
  window.DCLogic = DCLogic;
})();

class Component extends DCLogic {
  constructor(props) {
    super(props);
    this.state = { loadPct: 0, loaderOut: false, loaderGone: false, stage: 0, started: false, panel: 0, mathStep: 0, copied: false, left: 420, running: false, done: false };
    this.SRC = '/assets/uml-film.mp4';
    this.SRC2 = '/assets/uml-note.mp4';
    this.rf = {};
    this.cur = 0;
    this.reduce = false;
    const self = this;

    this.onPM = function (e) {
      self.mx = e.clientX; self.my = e.clientY;
      self.ptrMouse = e.pointerType === 'mouse';
      const t = e.target;
      self.hoverLink = !!(t && t.closest && t.closest('a,button'));
    };
    this.onCertMove = function (e) {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      const c = self.rf.cert, w = self.rf.certWrap;
      if (!c || !w) return;
      const r = w.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      c.style.transform = 'rotateY(' + ((x - 0.5) * 14).toFixed(2) + 'deg) rotateX(' + ((0.5 - y) * 10).toFixed(2) + 'deg)';
      c.style.setProperty('--gx', (x * 100).toFixed(1) + '%');
      c.style.setProperty('--gy', (y * 100).toFixed(1) + '%');
    };
    this.onCertLeave = function () {
      const c = self.rf.cert;
      if (c) c.style.transform = 'rotateY(0deg) rotateX(0deg)';
    };
    this.onFinMove = function (e) {
      const m = self.rf.finMoney;
      if (!m) return;
      const r = m.getBoundingClientRect();
      if (!r.width || !r.height) return;
      m.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
      m.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
    };

    const mk = function (key, on, off) {
      return function (el) {
        const prev = self.rf[key];
        if (prev === el) return;
        if (prev && off) off(prev);
        self.rf[key] = el;
        if (el && on) on(el);
      };
    };
    this.rRoot = mk('root');
    this.rHdrBar = mk('hdrbar');
    this.rFilm = mk('film');
    this.rVwrap = mk('vwrap');
    this.rBar = mk('bar');
    this.rTapes = mk('tapes');
    this.rTrackA = mk('trackA');
    this.rTrackB = mk('trackB');
    this.rStory = mk('story');
    this.rStrack = mk('strack');
    this.rSbar = mk('sbar');
    this.rCert = mk('cert');
    this.rMath = mk('math');
    this.rMbar = mk('mbar');
    this.rOdo = mk('odo');
    this.rQuote = mk('quote');
    this.rFinMoney = mk('finMoney');
    this.rCur = mk('cur');
    this.rVid = mk('vid', function (el) {
      try {
        el.muted = true; el.defaultMuted = true;
        el.setAttribute('muted', ''); el.setAttribute('playsinline', ''); el.setAttribute('webkit-playsinline', '');
      } catch (e) {}
      if (self.blobUrl) el.src = self.blobUrl;
    });
    this.rVid2 = mk('vid2', function (el) {
      try {
        el.muted = true; el.defaultMuted = true;
        el.setAttribute('muted', ''); el.setAttribute('playsinline', ''); el.setAttribute('webkit-playsinline', '');
      } catch (e) {}
      if (self.blobUrl2) el.src = self.blobUrl2;
    });
    this.rCertWrap = mk('certWrap', function (el) {
      el.addEventListener('pointermove', self.onCertMove);
      el.addEventListener('pointerleave', self.onCertLeave);
    }, function (el) {
      el.removeEventListener('pointermove', self.onCertMove);
      el.removeEventListener('pointerleave', self.onCertLeave);
    });
    this.rFin = mk('fin', function (el) {
      el.addEventListener('pointermove', self.onFinMove);
    }, function (el) {
      el.removeEventListener('pointermove', self.onFinMove);
    });

    this.copy = function () {
      const ca = self.props.contractAddress ?? '[CONTRACT ADDRESS — COMING SOON]';
      try { navigator.clipboard.writeText(ca); } catch (e) {}
      self.setState({ copied: true });
      clearTimeout(self.ct);
      self.ct = setTimeout(function () { if (self.alive) self.setState({ copied: false }); }, 1600);
    };
    this.toggleTimer = function () {
      if (self.state.running) {
        clearInterval(self.iv); self.iv = null;
        self.setState({ running: false, done: true });
      } else {
        if (self.iv) clearInterval(self.iv);
        self.setState({ left: 420, running: true, done: false });
        self.iv = setInterval(function () { self.tick(); }, 1000);
      }
    };

    let seed = 7;
    const rnd = function () { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    this.notes = [];
    for (let i = 0; i < 26; i++) {
      this.notes.push({ l: (rnd() * 94).toFixed(1), w: Math.round(62 + rnd() * 52), d: (5.5 + rnd() * 5).toFixed(2), dl: (rnd() * 10).toFixed(2), f: (1.4 + rnd() * 1.8).toFixed(2) });
    }
    const ta = ['Unlimited Money Limited', '£500,000,000,000', '1 share sold', 'Macaroni · Noodles · Couscous', 'Richest for 7 minutes'];
    const tb = ['$UML on Solana', 'Hope was right', '10,000,000,000 shares', 'Pasta not included', 'Not financial advice'];
    this.tapeA = ta.concat(ta);
    this.tapeB = tb.concat(tb);
    this.odo = [];
    for (let i = 0; i < 12; i++) {
      if (i > 0 && i % 3 === 0) this.odo.push({ dig: false, comma: true });
      this.odo.push({ dig: true, comma: false });
    }
    this.quoteWords = "Unfortunately, the world's shortest billionaire career didn't come with a billionaire's bank account.".split(' ');
  }

  componentDidMount() {
    const self = this;
    this.alive = true;
    this.t0 = Date.now();
    try { this.reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); } catch (e) {}
    try { window.addEventListener('pointermove', this.onPM, { passive: true }); } catch (e) {}
    this.loadVideo();
    this.hardStop = setTimeout(function () { self.finishLoad(); }, 6500);
    this.loop = function () {
      if (!self.alive) return;
      self.raf = requestAnimationFrame(self.loop);
      try { self.frame(); } catch (e) {}
    };
    this.raf = requestAnimationFrame(this.loop);
  }

  componentWillUnmount() {
    this.alive = false;
    if (this.raf) cancelAnimationFrame(this.raf);
    if (this.iv) clearInterval(this.iv);
    clearTimeout(this.hardStop); clearTimeout(this.t1); clearTimeout(this.t2); clearTimeout(this.ct);
    try { window.removeEventListener('pointermove', this.onPM); } catch (e) {}
    if (this.blobUrl) { try { URL.revokeObjectURL(this.blobUrl); } catch (e) {} }
    if (this.blobUrl2) { try { URL.revokeObjectURL(this.blobUrl2); } catch (e) {} }
  }

  loadVideo() {
    const self = this;
    const useUrl = function (url) {
      if (!self.alive) { try { URL.revokeObjectURL(url); } catch (e) {} return; }
      self.blobUrl = url;
      const v = self.rf.vid;
      if (v) { v.src = url; try { v.load(); } catch (e) {} }
      self.setLoad(1);
      self.finishLoad();
      self.loadSecond();
    };
    const fallback = function () {
      if (!self.alive) return;
      const v = self.rf.vid;
      if (v && !self.blobUrl) { v.src = self.SRC; try { v.load(); } catch (e) {} }
      self.finishLoad();
      self.loadSecond();
    };
    if (typeof fetch !== 'function') { fallback(); return; }
    fetch(this.SRC).then(function (res) {
      if (!res.ok) throw new Error('status ' + res.status);
      const total = Number(res.headers.get('content-length')) || 3139046;
      if (!res.body || !res.body.getReader) {
        return res.blob().then(function (b) { useUrl(URL.createObjectURL(b)); });
      }
      const reader = res.body.getReader();
      const chunks = [];
      let got = 0;
      const pump = function () {
        return reader.read().then(function (r) {
          if (r.done) { useUrl(URL.createObjectURL(new Blob(chunks, { type: 'video/mp4' }))); return null; }
          chunks.push(r.value);
          got += r.value.length;
          self.setLoad(Math.min(0.99, got / total));
          return pump();
        });
      };
      return pump();
    }).catch(fallback);
  }

  loadSecond() {
    if (this.second) return;
    this.second = true;
    const self = this;
    const direct = function () {
      if (!self.alive) return;
      const v = self.rf.vid2;
      if (v && !self.blobUrl2) { v.src = self.SRC2; try { v.load(); } catch (e) {} }
    };
    if (typeof fetch !== 'function') { direct(); return; }
    fetch(this.SRC2).then(function (res) {
      if (!res.ok) throw new Error('status ' + res.status);
      return res.blob();
    }).then(function (b) {
      if (!self.alive) return;
      const url = URL.createObjectURL(b);
      self.blobUrl2 = url;
      const v = self.rf.vid2;
      if (v) { v.src = url; try { v.load(); } catch (e) {} }
    }).catch(direct);
  }

  setLoad(f) {
    if (!this.alive) return;
    const pct = Math.max(0, Math.min(100, Math.round(f * 100)));
    if (pct === 100 || pct - this.state.loadPct >= 2) this.setState({ loadPct: pct });
  }

  finishLoad() {
    if (this.finishing || !this.alive) return;
    this.finishing = true;
    const self = this;
    const wait = Math.max(0, 1500 - (Date.now() - this.t0));
    this.t1 = setTimeout(function () {
      if (!self.alive) return;
      self.setState({ loadPct: 100, loaderOut: true });
      self.t2 = setTimeout(function () { if (self.alive) self.setState({ loaderGone: true }); }, 1150);
    }, wait);
  }

  tick() {
    const left = this.state.left - 1;
    if (left <= 0) {
      clearInterval(this.iv); this.iv = null;
      this.setState({ left: 0, running: false, done: true });
    } else {
      this.setState({ left: left });
    }
  }

  clamp(x) { return x < 0 ? 0 : (x > 1 ? 1 : x); }
  sm(a, b, x) { const t = this.clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); }
  norm(o, w) { if (!w) return o; o = o % w; if (o > 0) o -= w; return o; }

  setOdo(v) {
    if (this.lastV === v && this.strips && this.strips.length && this.strips[0].isConnected) return;
    this.lastV = v;
    const R = this.rf;
    if (!R.odo) return;
    if (!this.strips || !this.strips.length || !this.strips[0].isConnected) {
      this.strips = Array.prototype.slice.call(R.odo.querySelectorAll('.odo-strip'));
    }
    const n = this.strips.length;
    for (let k = 0; k < n; k++) {
      const i = n - 1 - k;
      const p10 = Math.pow(10, i);
      let d;
      if (i === 0) {
        d = v % 10;
      } else {
        const base = Math.floor(v / p10) % 10;
        const lower = (v / Math.pow(10, i - 1)) % 10;
        d = base + (lower > 9 ? lower - 9 : 0);
      }
      const el = this.strips[k];
      el.style.transform = 'translate3d(0,' + (-d * 1.1).toFixed(3) + 'em,0)';
      el.style.opacity = (i === 0 || v >= p10) ? '1' : '0.25';
    }
  }

  frame() {
    const R = this.rf;
    const s = this.state;
    const vh = window.innerHeight || 800;
    const vw = window.innerWidth || 1200;
    const st = {};
    this.fc = (this.fc || 0) + 1;

    const rr = R.root ? R.root.getBoundingClientRect() : null;
    const fr = R.film ? R.film.getBoundingClientRect() : null;
    const sr = R.story ? R.story.getBoundingClientRect() : null;
    const mr = R.math ? R.math.getBoundingClientRect() : null;
    const tr = R.tapes ? R.tapes.getBoundingClientRect() : null;
    const qr = R.quote ? R.quote.getBoundingClientRect() : null;
    if (this.fc % 30 === 1) {
      if (R.trackA) this.wA = R.trackA.scrollWidth / 2;
      if (R.trackB) this.wB = R.trackB.scrollWidth / 2;
      if (R.strack) {
        this.sw = R.strack.scrollWidth;
        const kids = R.strack.children;
        this.pl = [];
        for (let i = 0; i < kids.length; i++) this.pl.push(kids[i].offsetLeft);
      }
    }
    let dv = 0;
    if (rr) { if (this.lastTop != null) dv = this.lastTop - rr.top; this.lastTop = rr.top; }
    this.vel = (this.vel || 0) * 0.86 + dv * 0.14;

    if (rr && R.hdrbar) {
      const p = this.clamp(-rr.top / Math.max(1, rr.height - vh));
      R.hdrbar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
    }

    if (fr) {
      const p = this.clamp(-fr.top / Math.max(1, fr.height - vh));
      if (R.bar) R.bar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
      const v = R.vid;
      if (v && v.readyState >= 1 && v.duration && isFinite(v.duration)) {
        const target = p * Math.max(0, v.duration - 0.06);
        this.cur += (target - this.cur) * (this.reduce ? 1 : 0.2);
        if (Math.abs(v.currentTime - this.cur) > 0.008 && !v.seeking) {
          try { v.currentTime = this.cur; } catch (e) {}
        }
      }
      if (R.vwrap) {
        const k = 0.55 * this.sm(0.40, 0.50, p) + 0.45 * this.sm(0.66, 0.80, p);
        R.vwrap.style.transform = 'translate3d(0,' + (-10 * k).toFixed(3) + 'vh,0) scale(' + (1 - 0.2 * k).toFixed(4) + ')';
      }
      const stage = p < 0.11 ? 0 : p < 0.31 ? 1 : p < 0.47 ? 2 : p < 0.71 ? 3 : 4;
      if (stage !== s.stage) st.stage = stage;
      const started = p > 0.012;
      if (started !== s.started) st.started = started;
    }

    if (tr && R.trackA && R.trackB && !this.reduce && tr.bottom > -50 && tr.top < vh + 50) {
      const speed = 0.7 + Math.min(14, Math.abs(this.vel)) * 0.42;
      const dir = this.vel < -0.3 ? -1 : 1;
      this.oA = this.norm((this.oA || 0) - speed * dir, this.wA);
      this.oB = this.norm((this.oB || 0) + speed * dir, this.wB);
      R.trackA.style.transform = 'translate3d(' + this.oA.toFixed(1) + 'px,0,0)';
      R.trackB.style.transform = 'translate3d(' + this.oB.toFixed(1) + 'px,0,0)';
    }

    if (sr && R.strack) {
      const p = this.clamp(-sr.top / Math.max(1, sr.height - vh));
      const travel = Math.max(0, (this.sw || 0) - vw);
      const tx = -p * travel;
      this.sx = (this.sx == null || this.reduce) ? tx : this.sx + (tx - this.sx) * 0.14;
      R.strack.style.transform = 'translate3d(' + this.sx.toFixed(1) + 'px,0,0)';
      if (R.sbar) R.sbar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
      let panel = 0;
      if (this.pl) {
        for (let i = 0; i < this.pl.length; i++) {
          if (this.pl[i] + this.sx < vw * 0.58) panel = i;
        }
      }
      if (panel !== s.panel) st.panel = panel;
    }

    if (mr) {
      const p = this.clamp(-mr.top / Math.max(1, mr.height - vh));
      if (mr.top < vh && mr.bottom > 0) {
        const v2 = R.vid2;
        if (v2 && v2.readyState >= 1 && v2.duration && isFinite(v2.duration)) {
          const target = this.clamp(p / 0.86) * Math.max(0, v2.duration - 0.04);
          this.cur2 = (this.cur2 == null || this.reduce) ? target : this.cur2 + (target - this.cur2) * 0.2;
          if (Math.abs(v2.currentTime - this.cur2) > 0.008 && !v2.seeking) {
            try { v2.currentTime = this.cur2; } catch (e) {}
          }
        }
        if (R.mbar) R.mbar.style.transform = 'scaleY(' + p.toFixed(4) + ')';
        let val = 0;
        if (p >= 0.3) {
          const t = this.clamp((p - 0.34) / 0.46);
          val = t >= 1 ? 5e11 : 50 * Math.pow(10, 10 * t);
        }
        this.setOdo(val);
      }
      let step = 0;
      if (mr.top < vh * 0.3) step = p < 0.17 ? 1 : p < 0.31 ? 2 : p < 0.86 ? 3 : 4;
      if (step !== s.mathStep) st.mathStep = step;
    }

    if (qr && R.quote) {
      const p = this.clamp((vh * 0.9 - qr.top) / (qr.height + vh * 0.4));
      if (this.lastQ == null || Math.abs(p - this.lastQ) > 0.002 || !this.qw || !this.qw.length || !this.qw[0].isConnected) {
        this.lastQ = p;
        if (!this.qw || !this.qw.length || !this.qw[0].isConnected) this.qw = Array.prototype.slice.call(R.quote.querySelectorAll('.qw'));
        const n = this.qw.length;
        for (let i = 0; i < n; i++) {
          const a = this.clamp(p * (n + 2) - i);
          this.qw[i].style.opacity = (0.14 + 0.86 * a).toFixed(3);
        }
      }
    }

    if (R.cur && this.mx != null) {
      this.cx = this.cx == null ? this.mx : this.cx + (this.mx - this.cx) * 0.22;
      this.cy = this.cy == null ? this.my : this.cy + (this.my - this.cy) * 0.22;
      const target = this.hoverLink ? 1.9 : 1;
      this.cs = (this.cs || 1) + (target - (this.cs || 1)) * 0.2;
      R.cur.style.transform = 'translate3d(' + this.cx.toFixed(1) + 'px,' + this.cy.toFixed(1) + 'px,0) scale(' + this.cs.toFixed(3) + ')';
      R.cur.style.opacity = this.ptrMouse ? '1' : '0';
    }

    let changed = false;
    for (const key in st) { changed = true; break; }
    if (changed) this.setState(st);
  }

  renderVals() {
    const s = this.state;
    const ca = this.props.contractAddress ?? '[CONTRACT ADDRESS — COMING SOON]';
    const cls = function (base, on) { return on ? base + ' on' : base; };
    const scenes = ['Intro', 'The investor', 'The company', 'The valuation', 'The ending'];
    const huds = [
      ['Shares issued', '10,000,000,000', 'Shares sold', '0'],
      ['Shares sold', '1 of 10,000,000,000', 'Raised', '£50.00'],
      ['Registered activity', 'SIC 10730 · Pasta', 'Revenue', '£0.00'],
      ['Implied valuation', '£500,000,000,000', 'Revenue', '£0.00'],
      ['Status', 'Richest man alive', 'Time left', '≈ 7:00']
    ];
    const hud = huds[s.stage] || huds[0];
    const mm = Math.floor(s.left / 60);
    const ss = String(s.left % 60).padStart(2, '0');
    const C = 578.05;
    let twKick = 'Net worth on paper';
    let twVal = '£500,000,000,000';
    let timerMsg = 'The clock starts when you press the button.';
    if (s.running) { twKick = 'You are the richest person alive'; timerMsg = 'Enjoy it. It will not last.'; }
    if (s.done) { twKick = 'Company dissolved'; twVal = '£0.00'; timerMsg = 'Net worth: one very good story.'; }
    const shares = Math.floor(s.loadPct / 100 * 1e10);
    return {
      rRoot: this.rRoot, rHdrBar: this.rHdrBar, rFilm: this.rFilm, rVwrap: this.rVwrap, rVid: this.rVid, rBar: this.rBar,
      rTapes: this.rTapes, rTrackA: this.rTrackA, rTrackB: this.rTrackB, rStory: this.rStory, rStrack: this.rStrack, rSbar: this.rSbar,
      rCertWrap: this.rCertWrap, rCert: this.rCert, rMath: this.rMath, rVid2: this.rVid2, rMbar: this.rMbar, rOdo: this.rOdo, rQuote: this.rQuote,
      rFin: this.rFin, rFinMoney: this.rFinMoney, rCur: this.rCur,
      showLoader: !s.loaderGone,
      loaderCls: s.loaderOut ? 'loader out' : 'loader',
      loadPct: s.loadPct,
      loadShares: shares.toLocaleString('en-GB'),
      cap0: cls('capb', s.stage === 0), cap1: cls('capb', s.stage === 1), cap2: cls('capb', s.stage === 2), cap3: cls('capb', s.stage === 3), cap4: cls('capb', s.stage === 4),
      ah0: s.stage === 0 ? 'false' : 'true', ah1: s.stage === 1 ? 'false' : 'true', ah2: s.stage === 2 ? 'false' : 'true', ah3: s.stage === 3 ? 'false' : 'true', ah4: s.stage === 4 ? 'false' : 'true',
      dot0: cls('dot', s.stage === 0), dot1: cls('dot', s.stage === 1), dot2: cls('dot', s.stage === 2), dot3: cls('dot', s.stage === 3), dot4: cls('dot', s.stage === 4),
      sceneNo: '0' + (s.stage + 1), sceneName: scenes[s.stage] || scenes[0],
      hudAL: hud[0], hudAV: hud[1], hudBL: hud[2], hudBV: hud[3],
      hint: s.stage === 4 ? 'Keep scrolling' : (s.started ? 'Scroll' : 'Scroll to play'),
      ca: ca, copy: this.copy, copied: s.copied, notCopied: !s.copied,
      tapeA: this.tapeA, tapeB: this.tapeB,
      pc0: cls('panel intro', true), pc1: cls('panel', s.panel >= 1), pc2: cls('panel', s.panel >= 2), pc3: cls('panel', s.panel >= 3), pc4: cls('panel', s.panel >= 4), pc5: cls('panel', s.panel >= 5),
      chap: String(s.panel).padStart(2, '0'),
      ml1: cls('mline', s.mathStep >= 1), ml2: cls('mline', s.mathStep >= 2), ml3: cls('mline', s.mathStep >= 3), ml4: cls('mline', s.mathStep >= 4),
      odo: this.odo,
      running: s.running, notes: this.notes,
      timer: mm + ':' + ss,
      ringOff: (C * (1 - s.left / 420)).toFixed(2),
      timerCls: s.done ? 'done' : '',
      twKick: twKick, twVal: twVal, timerMsg: timerMsg,
      timerBtn: s.running ? 'Dissolve the company' : (s.done ? 'Go again' : 'Become a billionaire'),
      toggleTimer: this.toggleTimer,
      quoteWords: this.quoteWords
    };
  }
}

(function () {
  var props = { contractAddress: (window.UML_CONFIG && window.UML_CONFIG.contractAddress) || '[CONTRACT ADDRESS — COMING SOON]' };
  var c = new Component(props);
  var root = document;
  var vals = c.renderVals();
  // refs
  Array.prototype.forEach.call(root.querySelectorAll('[data-ref]'), function (el) {
    var fn = vals[el.getAttribute('data-ref')];
    if (typeof fn === 'function') fn(el);
  });
  // events
  Array.prototype.forEach.call(root.querySelectorAll('[data-on]'), function (el) {
    var name = el.getAttribute('data-on');
    el.addEventListener('click', function (e) { var v = c.renderVals(); if (typeof v[name] === 'function') v[name](e); });
  });
  var cEls = root.querySelectorAll('[data-c]');
  var tEls = root.querySelectorAll('[data-t]');
  var ifEls = root.querySelectorAll('[data-if]');
  var aEls = root.querySelectorAll('*');
  var attrEls = [];
  Array.prototype.forEach.call(aEls, function (el) {
    for (var i = 0; i < el.attributes.length; i++) {
      var n = el.attributes[i].name;
      if (n.indexOf('data-a-') === 0) attrEls.push([el, n.slice(7), el.attributes[i].value]);
    }
  });
  var wEls = root.querySelectorAll('[data-w]');
  c.__render = function () {
    var v = c.renderVals();
    Array.prototype.forEach.call(cEls, function (el) { var x = v[el.getAttribute('data-c')]; if (el.getAttribute('class') !== x) el.setAttribute('class', x || ''); });
    Array.prototype.forEach.call(tEls, function (el) { var x = v[el.getAttribute('data-t')]; x = x == null ? '' : String(x); if (el.textContent !== x) el.textContent = x; });
    Array.prototype.forEach.call(ifEls, function (el) { var on = !!v[el.getAttribute('data-if')]; if (el.hidden === on) el.hidden = !on; });
    attrEls.forEach(function (t) { var x = String(v[t[2]]); if (t[0].getAttribute(t[1]) !== x) t[0].setAttribute(t[1], x); });
    Array.prototype.forEach.call(wEls, function (el) { el.style.width = v[el.getAttribute('data-w')] + '%'; });
  };
  c.__render();
  if (c.componentDidMount) c.componentDidMount();
})();
