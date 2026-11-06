/* ═══════════════════════════════════════════════════════════════════
   THE DEV ORACLE — script.js
   ─────────────────────────────────────────────────────────────────
   Author: Arkman · شاه کدر — محمد ادیب محمدی
   License: MIT
   ─────────────────────────────────────────────────────────────────
   این فایل دو بخش دارد:
     ۱) کد اصلی تمرین — بایت به بایت دست‌نخورده
     ۲) لایه‌ی افزوده — انیمیشن، صدا، خواندن فارسی، حافظه، تعاملات

   ویژگی‌های کلیدی:
     • خواندن متن به فارسی با Web Speech API
     • انتخاب خودکار بهترین صدای فارسی موجود
     • ذخیره‌ی نقل‌قول‌های دیده‌شده در localStorage
     • کپی و اشتراک‌گذاری نقل‌قول
     • انیمیشن‌های GSAP با احتیاط کامل
     • احترام کامل به prefers-reduced-motion
     • بدون هیچ وابستگی اضافه غیر از GSAP
   ═══════════════════════════════════════════════════════════════════ */


/* ═══════════════════════════════════════════════════════════════════
   🔒 کد اصلی تمرین — دست نزنید
   ═══════════════════════════════════════════════════════════════════ */

const display = document.getElementById('quoteBox');
const giveText_btn = document.getElementById('generateBtn');

const texts = [
    "کدت مثل قهوه‌ی صبحگاهی باشه، تلخ ولی بیدارت می‌کنه! ☕",
    "امروز روز خوبیه برای اینکه یه باگ رو پیدا کنی و بگی: 'اینو خودم ننوشتم!' 😂",
    "زندگی مثل یه حلقه‌ی بی‌نهایته، فقط وقتی می‌فهمی کجا باید break بزنی. 🚀",
    "سخت‌ترین بخش برنامه‌نویسی اینه که اسم متغیرها رو درست انتخاب کنی، بقیه‌ش با گوگل حله! 🌐",
    "یه روزایی باید فقط console.log('I am alive') رو اجرا کنی و شکرگزار باشی. ❤️",
    "از باگ‌ها نترس، اون‌ها بهترین معلم‌های تو هستن (البته اگه تا صبح بیدار بمونی)! 🦉",
    "کدت رو تمیز بنویس، انگار که قراره یه گربه‌ی بازیگوش بره داخلش! 🐈",
    "امروز روز توئه! حتی اگه کامپایلرت خطا داد، تو خطا نمی‌دی. 💪",
    "بهترین ددلاین، ددلاینیه که دیروز بوده! (پس همین الان شروع کن) ⏰",
    "برای اینکه یه برنامه‌نویس خوب بشی، اول باید یاد بگیری چطور با گوگل دوست باشی. 🔍"
];

giveText_btn.addEventListener('click',()=>{
    const RandomText =  Math.floor(Math.random() * texts.length);
    display.textContent=texts[RandomText];
})


/* ═══════════════════════════════════════════════════════════════════
   ✨ افزوده‌ها — انیمیشن، صدا، خواندن فارسی، و تعاملات تکمیلی
   این بخش هیچ تغییری در منطق اصلی بالا ایجاد نمی‌کند. تنها
   شنونده‌های اضافه به همان دکمه اضافه می‌شوند که پس از شنونده‌ی
   اصلی اجرا می‌شوند (JS به ترتیب ثبت اجرا می‌کند).
   ═══════════════════════════════════════════════════════════════════ */

(() => {
  'use strict';

  /* ───────────────────────────────────────────────────────────────
     یادداشت درباره‌ی ترتیب اجرا:
     شنونده‌ی اصلی بالا قبل از هر چیز ثبت شده، پس در هر کلیک
     اول اجرا می‌شود و متن را در #quoteBox می‌نویسد. شنونده‌های
     این لایه دوم اجرا می‌شوند و متن نوشته‌شده را می‌خوانند.
     ما هرگز خودمان به #quoteBox نمی‌نویسیم.
     ─────────────────────────────────────────────────────────────── */


  // ═══════════════════════════════════════════════════════════════
  // 00 — فهرست بخش‌ها
  // ───────────────────────────────────────────────────────────────
  //   01  تشخیص قابلیت‌ها
  //   02  پیکربندی
  //   03  کش DOM
  //   04  وضعیت
  //   05  ابزارهای عمومی
  //   06  ابزارهای فارسی
  //   07  حافظه (localStorage)
  //   08  موتور خواندن (Web Speech)
  //   09  موتور صدا (Web Audio)
  //   10  توست
  //   11  ریپل
  //   12  بازخورد فشار دکمه
  //   13  شمارنده
  //   14  ارکستراتور نمایش نقل‌قول
  //   15  ورود سه‌بعدی کارت
  //   16  ورود صفحه
  //   17  شیب موس
  //   18  حرکت محیطی
  //   19  کپی نقل‌قول
  //   20  اشتراک‌گذاری
  //   21  دکمه‌ی خواندن
  //   22  کلیدهای میانبر
  //   23  مدیریت پنهان‌شدن تب
  //   24  مرز خطا
  //   25  API اشکال‌زدایی
  //   26  راه‌اندازی
  //   27  به‌روزرسانی زنده‌ی ترجیحات
  //   28  بوت
  // ═══════════════════════════════════════════════════════════════


  // ═══════════════════════════════════════════════════════════════
  // 01 — تشخیص قابلیت‌ها
  // ───────────────────────────────────────────────────────────────
  // یک بار در ابتدا بررسی می‌کنیم. هر ماژول بعدی فقط به این
  // بولین‌ها تکیه می‌کند و دیگر خودش تست نمی‌کند.
  // ═══════════════════════════════════════════════════════════════

  /** آیا GSAP و کارخانه‌ی timeline در دسترس است؟ */
  const HAS_GSAP = (
    typeof window.gsap !== 'undefined' &&
    typeof window.gsap.timeline === 'function'
  );

  /** آیا Clipboard API مدرن در دسترس است؟ */
  const HAS_CLIPBOARD = (
    typeof navigator !== 'undefined' &&
    navigator.clipboard &&
    typeof navigator.clipboard.writeText === 'function'
  );

  /** آیا Web Share API در دسترس است؟ */
  const HAS_SHARE = (
    typeof navigator !== 'undefined' &&
    typeof navigator.share === 'function'
  );

  /** آیا دستگاه لمسی است؟ */
  const IS_TOUCH = (
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || (navigator.maxTouchPoints || 0) > 0)
  );

  /** آیا Web Audio در دسترس است؟ */
  const HAS_WEB_AUDIO = (
    typeof window !== 'undefined' &&
    (window.AudioContext || window.webkitAudioContext)
  );

  /** آیا Web Speech API در دسترس است؟ */
  const HAS_SPEECH = (
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    typeof window.SpeechSynthesisUtterance === 'function'
  );

  /** آیا localStorage در دسترس است؟ (در حالت private ممکن است نباشد) */
  let HAS_STORAGE = false;
  try {
    const testKey = '__oracle_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    HAS_STORAGE = true;
  } catch (_) {
    HAS_STORAGE = false;
  }

  /** آیا requestAnimationFrame در دسترس است؟ */
  const HAS_RAF = (
    typeof window !== 'undefined' &&
    typeof window.requestAnimationFrame === 'function'
  );

  /** آیا PerformanceObserver در دسترس است؟ */
  const HAS_PERF_OBSERVER = (
    typeof window !== 'undefined' &&
    typeof window.PerformanceObserver === 'function'
  );

  /** ترجیح کاربر برای کاهش حرکت */
  let prefersReducedMotion = false;
  try {
    prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
  } catch (_) {
    prefersReducedMotion = false;
  }

  /** ترجیح کاربر برای کنتراست بالاتر */
  let prefersContrast = false;
  try {
    prefersContrast = window.matchMedia(
      '(prefers-contrast: more)'
    ).matches;
  } catch (_) {
    prefersContrast = false;
  }


  // ═══════════════════════════════════════════════════════════════
  // 02 — پیکربندی
  // ───────────────────────────────────────────────────────────────
  // همه‌ی اعداد جادویی در یک شیء. تغییر هر مقدار فقط یک خط.
  // ═══════════════════════════════════════════════════════════════

  const CONFIG = Object.freeze({

    /* ── زمان‌بندی‌های حرکت ── */
    motion: Object.freeze({

      entrance: Object.freeze({
        deviceDuration: 0.9,
        deviceEase: 'power3.out',
        cardDelay: 0.2,
        cardDuration: 0.7,
        buttonPulseDelay: 0.9,
        captionDelay: 1.2,
        captionDuration: 0.5,
      }),

      press: Object.freeze({
        pressScale: 0.96,
        pressDuration: 0.09,
        releaseDuration: 0.12,
        releaseEase: 'power2.out',
        rippleDuration: 0.6,
        rippleMaxSize: 240,
        rippleMinSize: 40,
      }),

      reveal: Object.freeze({
        leavingDuration: 0.18,
        arrivingDuration: 0.32,
        cardLiftDuration: 0.5,
        glowDuration: 0.4,
        clipPathFrom: 'inset(0 0 100% 0)',
        clipPathTo: 'inset(0 0 0 0)',
      }),

      emerge: Object.freeze({
        fromTranslateY: -12,
        fromRotateX: -6,
        fromScale: 0.96,
        fromOpacity: 0.3,
        duration: 0.4,
        ease: 'elastic.out(1, 0.6)',
      }),

      counter: Object.freeze({
        flipDuration: 0.28,
        flipEase: 'power2.out',
      }),

      ambient: Object.freeze({
        glowDuration: 10,
        glowScale: 1.04,
        glowOpacity: [0.6, 0.8],
        shimmerDuration: 8,
        dotPulseDuration: 3.2,
        ledDuration: 5,
      }),

      tilt: Object.freeze({
        maxRotate: 3,
        lerpFactor: 0.08,
        perspective: 1600,
      }),

      sound: Object.freeze({
        baseFrequency: 523.25,
        intervals: [1, 1.25, 1.5, 2],
        attack: 0.008,
        decay: 0.35,
        gain: 0.06,
      }),

      toast: Object.freeze({
        visibleDuration: 1800,
        enterDuration: 0.2,
        exitDuration: 0.25,
      }),
    }),

    /* ── تنظیمات صدا و خواندن ── */
    speech: Object.freeze({
      rate: 0.95,
      pitch: 1.0,
      volume: 1.0,
      lang: 'fa-IR',
      preferredLangs: ['fa-IR', 'fa', 'fa_IR', 'fa_GB'],
      minRate: 0.5,
      maxRate: 1.5,
      minPitch: 0.8,
      maxPitch: 1.4,
      restartDelay: 120,
    }),

    /* ── انتخابگرها ── */
    selectors: Object.freeze({
      quoteBox: '#quoteBox',
      generateBtn: '#generateBtn',
      quoteCard: '.quote-card',
      quoteText: '.quote-card__text',
      quoteCounter: '#quoteCounter',
      soundBtn: '#soundBtn',
      deviceBody: '.device__body',
      deviceCaption: '.device__caption',
      creatorModal: '#creator',
      siteBarHint: '.site-bar__hint',
      stage: '#stage',
    }),

    /* ── کلیدهای localStorage ── */
    storageKeys: Object.freeze({
      soundEnabled: 'oracle:soundEnabled',
      seenQuotes: 'oracle:seenQuotes',
      lastQuote: 'oracle:lastQuote',
      voiceRate: 'oracle:voiceRate',
      voicePitch: 'oracle:voicePitch',
      hasSeenHint: 'oracle:hasSeenHint',
      totalVisits: 'oracle:totalVisits',
    }),

    /* ── فرمت‌کننده‌ی اعداد فارسی ── */
    persianFormatter: (() => {
      try {
        return new Intl.NumberFormat('fa-IR', { useGrouping: false });
      } catch (_) {
        return {
          format: (n) => String(n).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]),
        };
      }
    })(),

    /* ── کلید فعال/غیرفعال اشکال‌زدایی ── */
    debug: false,
  });


  // ═══════════════════════════════════════════════════════════════
  // 03 — کش DOM
  // ───────────────────────────────────────────────────────────────
  // یک پیمایش، همیشه استفاده. اگر عنصر حیاتی نبود، ما خارج می‌شویم.
  // ═══════════════════════════════════════════════════════════════

  const DOM = (() => {
    const q = (sel) => {
      try { return document.querySelector(sel); } catch (_) { return null; }
    };
    const qa = (sel) => {
      try { return document.querySelectorAll(sel); }
      catch (_) { return []; }
    };

    const cache = {
      quoteBox: q(CONFIG.selectors.quoteBox),
      generateBtn: q(CONFIG.selectors.generateBtn),
      quoteCard: q(CONFIG.selectors.quoteCard),
      quoteText: q(CONFIG.selectors.quoteText),
      quoteCounter: q(CONFIG.selectors.quoteCounter),
      soundBtn: q(CONFIG.selectors.soundBtn),
      deviceBody: q(CONFIG.selectors.deviceBody),
      deviceCaption: q(CONFIG.selectors.deviceCaption),
      creatorModal: q(CONFIG.selectors.creatorModal),
      siteBarHint: q(CONFIG.selectors.siteBarHint),
      stage: q(CONFIG.selectors.stage),
      deviceCrown: q('.device__crown'),
      deviceSlot: q('.device__slot'),
      deviceLed: q('.device__led'),
      deviceLedCore: q('.device__led-core'),
      quoteDot: q('.quote-card__dot'),
      devicePlaque: q('.device__plaque'),
      allButtons: qa('button'),
      initialGreeting: null,
    };

    if (cache.quoteBox) {
      cache.initialGreeting = cache.quoteBox.textContent;
    }

    return cache;
  })();

  /* اگر دو عنصر حیاتی نیستند، بدون ادامه خارج شو. */
  if (!DOM.quoteBox || !DOM.generateBtn) {
    if (CONFIG.debug) {
      // eslint-disable-next-line no-console
      console.error('[DevOracle] عناصر حیاتی یافت نشد: #quoteBox و #generateBtn');
    }
    return;
  }


  // ═══════════════════════════════════════════════════════════════
  // 04 — وضعیت
  // ───────────────────────────────────────────────────────────────
  // تمام حالت‌های قابل‌تغییر. هیچ متغیر سرگردانی وجود ندارد.
  // ═══════════════════════════════════════════════════════════════

  const State = {
    /* صدا */
    soundEnabled: false,
    audioContext: null,
    audioMasterGain: null,

    /* خواندن */
    isSpeaking: false,
    currentUtterance: null,
    speechVoices: [],
    speechVoicesReady: false,
    speechInitialized: false,
    selectedVoice: null,
    lastSpokenText: '',
    pendingSpeechTimeout: null,

    /* نقل‌قول */
    seenIndices: new Set(),
    lastIndex: -1,
    lastQuote: '',
    totalSeen: 0,
    firstQuoteRevealed: false,

    /* حرکت */
    isRevealing: false,
    revealTimeline: null,
    entranceTimeline: null,

    /* شیب موس */
    tiltEnabled: false,
    tiltRafId: null,
    pointer: { x: 0, y: 0, targetX: 0, targetY: 0 },

    /* توست */
    activeToast: null,
    toastTimeoutId: null,

    /* چرخه */
    initialized: false,
    destroyed: false,
    visibilityPaused: false,

    /* کارایی */
    frameCount: 0,
    lastFpsSample: 0,
    currentFps: 60,

    /* خطاها */
    errorCount: 0,
    lastError: null,
    warnings: [],

    /* ترجیحات ذخیره‌شده */
    savedRate: CONFIG.speech.rate,
    savedPitch: CONFIG.speech.pitch,
  };


  // ═══════════════════════════════════════════════════════════════
  // 05 — ابزارهای عمومی
  // ───────────────────────────────────────────────────────────────
  // توابع خالص و کوچک. بدون دسترسی به DOM، بدون اثر جانبی.
  // ═══════════════════════════════════════════════════════════════

  function lerp(a, b, t) {
    const clamped = Math.min(1, Math.max(0, t));
    return a + (b - a) * clamped;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function rafThrottle(fn) {
    if (!HAS_RAF) {
      return function throttled(...args) {
        return fn.apply(this, args);
      };
    }
    let queued = false;
    let lastArgs = null;
    let lastThis = null;
    return function throttled(...args) {
      lastArgs = args;
      lastThis = this;
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(() => {
        queued = false;
        fn.apply(lastThis, lastArgs);
      });
    };
  }

  function debounce(fn, wait) {
    let timeoutId = null;
    return function debounced(...args) {
      if (timeoutId) window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        timeoutId = null;
        fn.apply(this, args);
      }, wait);
    };
  }

  const uid = (() => {
    let counter = 0;
    return (prefix = 'oracle') => {
      counter += 1;
      return `${prefix}-${counter.toString(36)}`;
    };
  })();

  function toPersianNumber(n) {
    try {
      return CONFIG.persianFormatter.format(n);
    } catch (_) {
      return String(n);
    }
  }

  function pickDifferentIndex(length, lastIndex) {
    if (length <= 1) return 0;
    if (lastIndex < 0) return Math.floor(Math.random() * length);
    let candidate = Math.floor(Math.random() * length);
    if (candidate === lastIndex) {
      candidate = (candidate + 1) % length;
    }
    return candidate;
  }

  function qs(selector, root = document) {
    try { return root.querySelector(selector); }
    catch (_) { return null; }
  }

  function qsa(selector, root = document) {
    try { return root.querySelectorAll(selector); }
    catch (_) { return []; }
  }

  function isInViewport(el) {
    if (!el || typeof el.getBoundingClientRect !== 'function') return false;
    const rect = el.getBoundingClientRect();
    return (
      rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
      rect.bottom > 0 &&
      rect.left < (window.innerWidth || document.documentElement.clientWidth) &&
      rect.right > 0
    );
  }

  function setCssVar(el, name, value) {
    if (!el || !el.style) return;
    el.style.setProperty(name, String(value));
  }

  function forceReflow(el) {
    if (!el) return;
    // eslint-disable-next-line no-unused-expressions
    el.offsetHeight;
  }

  function log(...args) {
    if (!CONFIG.debug) return;
    // eslint-disable-next-line no-console
    console.log('%c[DevOracle]', 'color:#E5A870;font-weight:700', ...args);
  }

  function warn(message, data) {
    State.warnings.push({ message, data, at: Date.now() });
    if (State.warnings.length > 50) State.warnings.shift();
    if (!CONFIG.debug) return;
    // eslint-disable-next-line no-console
    console.warn('%c[DevOracle]', 'color:#D96A5B;font-weight:700', message, data || '');
  }

  function safe(fn) {
    return function safeWrapper(...args) {
      try {
        return fn.apply(this, args);
      } catch (err) {
        State.errorCount += 1;
        State.lastError = err;
        warn('خطا در callback محافظت‌شده', err);
        return undefined;
      }
    };
  }

  function isPlainObject(value) {
    if (value === null || typeof value !== 'object') return false;
    if (Array.isArray(value)) return false;
    if (value.nodeType) return false;
    return true;
  }

  function merge(base, patch) {
    if (!isPlainObject(base) || !isPlainObject(patch)) return base;
    const out = Object.assign({}, base);
    for (const key of Object.keys(patch)) {
      out[key] = patch[key];
    }
    return out;
  }


  // ═══════════════════════════════════════════════════════════════
  // 06 — ابزارهای فارسی
  // ───────────────────────────────────────────────────────────────
  // تبدیل اعداد، نرمال‌سازی متن (حذف فاصله‌های اضافه، یکسان‌سازی
  // ی/ک عربی به فارسی) برای مقایسه و ذخیره‌سازی پایدار.
  // ═══════════════════════════════════════════════════════════════

  function persianToLatinDigit(char) {
    const persian = '۰۱۲۳۴۵۶۷۸۹';
    const arabic = '٠١٢٣٤٥٦٧٨٩';
    let idx = persian.indexOf(char);
    if (idx >= 0) return String(idx);
    idx = arabic.indexOf(char);
    if (idx >= 0) return String(idx);
    return char;
  }

  function parsePersianNumber(str) {
    if (typeof str !== 'string') return NaN;
    const latin = str
      .split('')
      .map(persianToLatinDigit)
      .join('')
      .replace(/[^\d]/g, '');
    if (!latin) return NaN;
    return parseInt(latin, 10);
  }

  function formatCounter(seen, total) {
    return `${toPersianNumber(seen)} از ${toPersianNumber(total)}`;
  }

  /**
   * نرمال‌سازی متن فارسی:
   *  • ي عربی → ی فارسی
   *  • ك عربی → ک فارسی
   *  •  ة → ه
   *  • حذف فاصله‌های اضافه
   *  • حذف نیم‌فاصله‌های تکراری
   *  • trim
   */
  function normalizePersian(text) {
    if (typeof text !== 'string') return '';
    return text
      .replace(/\u064A/g, '\u06CC')   /* ي → ی */
      .replace(/\u0643/g, '\u06A9')   /* ك → ک */
      .replace(/\u0629/g, '\u0647')   /* ة → ه */
      .replace(/[\u064B-\u065F]/g, '') /* حذف اعراب */
      .replace(/\s+/g, ' ')
      .replace(/\u200C\u200C+/g, '\u200C')
      .trim();
  }

  /**
   * تبدیل متن فارسی به شکل قابل‌مقایسه — برای Set از نقل‌قول‌ها.
   */
  function canonicalQuoteKey(text) {
    return normalizePersian(text).toLowerCase();
  }

  /**
   * حذف ایموجی‌ها از متن برای خواندن صوتی.
   * خواندن ایموجی توسط TTS معمولاً با نام لاتین یا سکوت می‌آید
   * که تجربه را خراب می‌کند.
   */
  function stripEmojisForSpeech(text) {
    if (typeof text !== 'string') return '';
    /* حذف بازه‌های استاندارد ایموجی */
    return text
      .replace(/[\u{1F300}-\u{1F5FF}]/gu, '')
      .replace(/[\u{1F600}-\u{1F64F}]/gu, '')
      .replace(/[\u{1F680}-\u{1F6FF}]/gu, '')
      .replace(/[\u{1F700}-\u{1F77F}]/gu, '')
      .replace(/[\u{1F780}-\u{1F7FF}]/gu, '')
      .replace(/[\u{1F800}-\u{1F8FF}]/gu, '')
      .replace(/[\u{1F900}-\u{1F9FF}]/gu, '')
      .replace(/[\u{1FA00}-\u{1FA6F}]/gu, '')
      .replace(/[\u{1FA70}-\u{1FAFF}]/gu, '')
      .replace(/[\u{2600}-\u{27BF}]/gu, '')
      .replace(/[\u{FE00}-\u{FE0F}]/gu, '')
      .replace(/[\u{1F000}-\u{1F02F}]/gu, '')
      .replace(/\u200D/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * حذف کدهای برنامه‌نویسی از متن برای خواندن روان‌تر.
   * مثلاً console.log('I am alive') را حذف نمی‌کنیم چون بخشی
   * از پیام است — اما کدهای تکی مثل break را فارسی‌سازی می‌کنیم.
   */
  function humanizeForSpeech(text) {
    if (typeof text !== 'string') return '';
    let out = text;
    /* break → بریک */
    out = out.replace(/\bbreak\b/gi, 'بریک');
    /* console.log → کنسول لاگ */
    out = out.replace(/console\.log/gi, 'کنسول لاگ');
    /* I am alive → آی ام الایو */
    out = out.replace(/['"]?I am alive['"]?/gi, 'آی ام اَلایو');
    /* false/true/null */
    out = out.replace(/\btrue\b/gi, 'ترو');
    out = out.replace(/\bfalse\b/gi, 'فالس');
    out = out.replace(/\bnull\b/gi, 'نال');
    return out;
  }

  /**
   * آماده‌سازی متن نهایی برای TTS:
   *  ۱. حذف ایموجی
   *  ۲. انسانی‌سازی کدها
   *  ۳. نرمال‌سازی
   */
  function prepareForSpeech(text) {
    if (!text) return '';
    let out = stripEmojisForSpeech(text);
    out = humanizeForSpeech(out);
    out = normalizePersian(out);
    return out;
  }


  // ═══════════════════════════════════════════════════════════════
  // 07 — حافظه
  // ───────────────────────────────────────────────────────────────
  // لایه‌ی نازک روی localStorage. همه‌جا try/catch، چون در حالت
  // private ممکن است دسترسی رد شود.
  // ═══════════════════════════════════════════════════════════════

  const Storage = (() => {

    function getRaw(key) {
      if (!HAS_STORAGE) return null;
      try {
        return window.localStorage.getItem(key);
      } catch (err) {
        warn('خطا در خواندن از localStorage', err);
        return null;
      }
    }

    function setRaw(key, value) {
      if (!HAS_STORAGE) return false;
      try {
        window.localStorage.setItem(key, value);
        return true;
      } catch (err) {
        warn('خطا در نوشتن در localStorage', err);
        return false;
      }
    }

    function removeRaw(key) {
      if (!HAS_STORAGE) return;
      try {
        window.localStorage.removeItem(key);
      } catch (_) { /* ignore */ }
    }

    /* ── خواندن/نوشتن JSON ── */

    function getJSON(key, fallback) {
      const raw = getRaw(key);
      if (raw === null) return fallback;
      try {
        return JSON.parse(raw);
      } catch (_) {
        return fallback;
      }
    }

    function setJSON(key, value) {
      try {
        return setRaw(key, JSON.stringify(value));
      } catch (err) {
        warn('خطا در JSON.stringify', err);
        return false;
      }
    }

    /* ── خواندن/نوشتن رشته ── */

    function getString(key, fallback) {
      const raw = getRaw(key);
      return raw === null ? fallback : raw;
    }

    function setString(key, value) {
      return setRaw(key, String(value));
    }

    /* ── خواندن/نوشتن عدد ── */

    function getNumber(key, fallback) {
      const raw = getRaw(key);
      if (raw === null) return fallback;
      const n = parseFloat(raw);
      return Number.isFinite(n) ? n : fallback;
    }

    function setNumber(key, value) {
      return setRaw(key, String(value));
    }

    /* ── خواندن/نوشتن بولین ── */

    function getBool(key, fallback) {
      const raw = getRaw(key);
      if (raw === null) return fallback;
      return raw === 'true' || raw === '1';
    }

    function setBool(key, value) {
      return setRaw(key, value ? 'true' : 'false');
    }

    /* ── نقل‌قول‌های دیده‌شده ── */

    function loadSeenQuotes() {
      const arr = getJSON(CONFIG.storageKeys.seenQuotes, []);
      if (!Array.isArray(arr)) return new Set();
      return new Set(arr.filter((x) => typeof x === 'string'));
    }

    function saveSeenQuotes(set) {
      if (!(set instanceof Set)) return false;
      return setJSON(CONFIG.storageKeys.seenQuotes, Array.from(set));
    }

    /* ── پیگیری بازدید ── */

    function bumpVisits() {
      const count = getNumber(CONFIG.storageKeys.totalVisits, 0) + 1;
      setNumber(CONFIG.storageKeys.totalVisits, count);
      return count;
    }

    function getVisits() {
      return getNumber(CONFIG.storageKeys.totalVisits, 0);
    }

    function hasSeenHint() {
      return getBool(CONFIG.storageKeys.hasSeenHint, false);
    }

    function markHintSeen() {
      return setBool(CONFIG.storageKeys.hasSeenHint, true);
    }

    /* ── ترجیحات صدا ── */

    function loadRate() {
      return clamp(
        getNumber(CONFIG.storageKeys.voiceRate, CONFIG.speech.rate),
        CONFIG.speech.minRate,
        CONFIG.speech.maxRate
      );
    }

    function saveRate(n) {
      return setNumber(CONFIG.storageKeys.voiceRate, n);
    }

    function loadPitch() {
      return clamp(
        getNumber(CONFIG.storageKeys.voicePitch, CONFIG.speech.pitch),
        CONFIG.speech.minPitch,
        CONFIG.speech.maxPitch
      );
    }

    function savePitch(n) {
      return setNumber(CONFIG.storageKeys.voicePitch, n);
    }

    /* ── ترجیح صدا ── */

    function loadSoundPref() {
      return getBool(CONFIG.storageKeys.soundEnabled, false);
    }

    function saveSoundPref(on) {
      return setBool(CONFIG.storageKeys.soundEnabled, on);
    }

    /* ── پاک‌سازی کامل ── */

    function clearAll() {
      if (!HAS_STORAGE) return;
      try {
        Object.values(CONFIG.storageKeys).forEach((key) => {
          window.localStorage.removeItem(key);
        });
      } catch (_) { /* ignore */ }
    }

    return {
      getRaw, setRaw, removeRaw,
      getJSON, setJSON,
      getString, setString,
      getNumber, setNumber,
      getBool, setBool,
      loadSeenQuotes, saveSeenQuotes,
      bumpVisits, getVisits,
      hasSeenHint, markHintSeen,
      loadRate, saveRate,
      loadPitch, savePitch,
      loadSoundPref, saveSoundPref,
      clearAll,
    };
  })();


  // ═══════════════════════════════════════════════════════════════
  // 08 — موتور خواندن (Web Speech API)
  // ───────────────────────────────────────────────────────────────
  // قلب این به‌روزرسانی. متن فعلی #quoteBox را به فارسی می‌خواند.
  // ویژگی‌ها:
  //   • کش صداهای سیستم با انتظار برای voiceschanged
  //   • انتخاب بهترین صدای فارسی موجود
  //   • مدیریت کامل start/end/error
  //   • لغو هوشمند با شروع نقل‌قول جدید
  //   • ذخیره‌ی rate/pitch
  //   • پشتیبانی از pause/resume
  //   • حالت "هیچ صدای فارسی موجود نیست" با پیام واضح
  // ═══════════════════════════════════════════════════════════════

  const Speech = (() => {

    let voicesChangedHandler = null;
    let pendingVoicesRetry = null;

    /**
     * بارگذاری صداهای موجود از سیستم‌عامل. در Chrome و Safari
     * ممکن است در ابتدا خالی باشند و با تأخیر پر شوند.
     */
    function loadVoices() {
      if (!HAS_SPEECH) return;
      try {
        const voices = window.speechSynthesis.getVoices();
        if (voices && voices.length > 0) {
          State.speechVoices = Array.from(voices);
          State.speechVoicesReady = true;
          State.selectedVoice = pickPersianVoice();
          log('صداهای سیستم بارگذاری شد:', voices.length,
              'صدای فارسی:', State.selectedVoice ? State.selectedVoice.name : 'هیچ');
        } else {
          State.speechVoicesReady = false;
        }
      } catch (err) {
        warn('خطا در بارگذاری صداها', err);
      }
    }

    /**
     * انتخاب بهترین صدای فارسی. ترتیب اولویت:
     *  ۱. fa-IR دقیق
     *  ۲. fa
     *  ۳. هر زبانی که با fa شروع شود
     *  ۴. هر صدایی که کلمه‌ی "persian"/"farsi" در نامش دارد
     *  ۵. null
     */
    function pickPersianVoice() {
      const voices = State.speechVoices;
      if (!voices.length) return null;

      /* ۱. fa-IR */
      let found = voices.find(
        (v) => v.lang && v.lang.toLowerCase().replace('_', '-') === 'fa-ir'
      );
      if (found) return found;

      /* ۲. fa */
      found = voices.find(
        (v) => v.lang && v.lang.toLowerCase().replace('_', '-') === 'fa'
      );
      if (found) return found;

      /* ۳. هر چیزی که با fa شروع شود */
      found = voices.find(
        (v) => v.lang && v.lang.toLowerCase().startsWith('fa')
      );
      if (found) return found;

      /* ۴. نام شامل persian/farsi */
      found = voices.find((v) => {
        if (!v.name) return false;
        const n = v.name.toLowerCase();
        return n.includes('persian') || n.includes('farsi') || n.includes('ایران');
      });
      if (found) return found;

      return null;
    }

    /**
     * راه‌اندازی اولیه. کش صداها و گوش‌دادن به voiceschanged.
     */
    function init() {
      if (State.speechInitialized) return;
      State.speechInitialized = true;

      if (!HAS_SPEECH) {
        log('Web Speech API در دسترس نیست.');
        return;
      }

      /* بازیابی ترجیحات */
      State.savedRate = Storage.loadRate();
      State.savedPitch = Storage.loadPitch();

      /* تلاش اولیه */
      loadVoices();

      /* Chrome/Edge گاهی صداها را با تأخیر می‌دهند */
      if (!State.speechVoicesReady) {
        /* تلاش مجدد بعد از ۲۰۰ms و ۸۰۰ms */
        window.setTimeout(loadVoices, 200);
        window.setTimeout(loadVoices, 800);
      }

      /* گوش‌دادن به voiceschanged */
      voicesChangedHandler = safe(() => {
        log('رویداد voiceschanged');
        loadVoices();
      });

      try {
        if (typeof window.speechSynthesis.addEventListener === 'function') {
          window.speechSynthesis.addEventListener('voiceschanged', voicesChangedHandler);
        } else {
          window.speechSynthesis.onvoiceschanged = voicesChangedHandler;
        }
      } catch (err) {
        warn('نمی‌توان به voiceschanged گوش داد', err);
      }

      /* اگر بعد از ۲ ثانیه هنوز صدایی نبود، یک بار دیگر تلاش کن */
      pendingVoicesRetry = window.setTimeout(safe(() => {
        if (!State.speechVoicesReady) {
          log('تلاش نهایی برای بارگذاری صداها');
          loadVoices();
        }
      }), 2000);

      log('موتور خواندن راه‌اندازی شد.');
    }

    /**
     * خواندن متن. اگر در حال خواندن چیز دیگری هستیم، اول لغو.
     * متن ورودی از #quoteBox فعلی یا هر متنی که پاس بدهیم.
     */
    function speak(text, options = {}) {
      if (!HAS_SPEECH) {
        Toast.show('مرورگر شما از خواندن متن پشتیبانی نمی‌کند.');
        return false;
      }

      /* اگر voices آماده نیست، یک بار دیگر تلاش کن */
      if (!State.speechVoicesReady) {
        loadVoices();
      }

      /* آماده‌سازی متن */
      const raw = text || (DOM.quoteBox ? DOM.quoteBox.textContent : '');
      const cleaned = prepareForSpeech(raw);
      if (!cleaned) {
        Toast.show('متنی برای خواندن وجود ندارد.');
        return false;
      }

      /* اگر همین متن در حال خواندن است، لغو کن (toggle) */
      if (State.isSpeaking && State.lastSpokenText === cleaned) {
        cancel();
        return false;
      }

      /* لغو هر خواندن قبلی */
      cancel();

      /* اگر هیچ صدای فارسی نیست، هشدار بده و با صدای پیش‌فرض ادامه بده */
      if (!State.selectedVoice) {
        /* یک بار دیگر تلاش کن */
        State.selectedVoice = pickPersianVoice();
        if (!State.selectedVoice && !State.speechVoicesReady) {
          Toast.show('صداهای سیستم هنوز آماده نیستند. لطفاً دوباره تلاش کنید.');
          return false;
        }
        if (!State.selectedVoice) {
          /* هیچ صدای فارسی موجود نیست — با صدای پیش‌فرض تلاش کن */
          log('هیچ صدای فارسی یافت نشد — استفاده از صدای پیش‌فرض');
        }
      }

      try {
        const utterance = new window.SpeechSynthesisUtterance(cleaned);

        /* زبان — همیشه fa-IR، حتی اگر voice انتخاب‌شده زبان دیگری داشته باشد */
        utterance.lang = CONFIG.speech.lang;

        if (State.selectedVoice) {
          utterance.voice = State.selectedVoice;
        }

        /* تنظیمات */
        utterance.rate = options.rate !== undefined ? options.rate : State.savedRate;
        utterance.pitch = options.pitch !== undefined ? options.pitch : State.savedPitch;
        utterance.volume = options.volume !== undefined ? options.volume : CONFIG.speech.volume;

        /* رویدادها */
        utterance.onstart = safe(() => {
          State.isSpeaking = true;
          State.lastSpokenText = cleaned;
          updateButtonState(true);
          log('خواندن شروع شد:', cleaned.slice(0, 40) + '...');
        });

        utterance.onend = safe(() => {
          State.isSpeaking = false;
          State.currentUtterance = null;
          updateButtonState(false);
          log('خواندن پایان یافت');
        });

        utterance.onerror = safe((event) => {
          State.isSpeaking = false;
          State.currentUtterance = null;
          updateButtonState(false);
          const errCode = event.error || 'unknown';
          /* interrupted و canceled خطای واقعی نیستند */
          if (errCode !== 'interrupted' && errCode !== 'canceled') {
            warn('خطای خواندن', errCode);
            if (errCode === 'not-allowed') {
              Toast.show('خواندن نیاز به اجازه دارد. یک بار دیگر امتحان کنید.');
            } else {
              Toast.show('خواندن متن ممکن نشد.');
            }
          }
        });

        utterance.onboundary = safe((event) => {
          log('مرز کلمه در:', event.charIndex);
        });

        State.currentUtterance = utterance;
        window.speechSynthesis.speak(utterance);

        /* اگر speechSynthesis در حالت paused بود، آن را باز کن */
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }

        return true;
      } catch (err) {
        warn('خطا در speak()', err);
        Toast.show('خواندن متن ممکن نشد.');
        return false;
      }
    }

    /**
     * لغو کامل خواندن و پاک کردن صف.
     */
    function cancel() {
      if (!HAS_SPEECH) return;
      try {
        window.speechSynthesis.cancel();
      } catch (_) { /* ignore */ }
      State.isSpeaking = false;
      State.currentUtterance = null;
      State.lastSpokenText = '';
      updateButtonState(false);
    }

    /**
     * توقف موقت (نگه‌داشتن متن برای ادامه).
     */
    function pause() {
      if (!HAS_SPEECH) return;
      try {
        window.speechSynthesis.pause();
      } catch (err) {
        warn('خطا در pause()', err);
      }
    }

    /**
     * ادامه‌ی خواندن پس از pause.
     */
    function resume() {
      if (!HAS_SPEECH) return;
      try {
        window.speechSynthesis.resume();
      } catch (err) {
        warn('خطا در resume()', err);
      }
    }

    /**
     * آیا همین الان در حال خواندن هستیم؟
     */
    function speaking() {
      if (!HAS_SPEECH) return false;
      try {
        return window.speechSynthesis.speaking || State.isSpeaking;
      } catch (_) {
        return State.isSpeaking;
      }
    }

    /**
     * آیا صدای فارسی داریم؟
     */
    function hasPersianVoice() {
      return !!State.selectedVoice;
    }

    /**
     * فهرست صداهای موجود برای نمایش/انتخاب.
     */
    function availableVoices() {
      return State.speechVoices.slice();
    }

    /**
     * تنظیم rate. مقادیر بیرون از محدوده بریده می‌شوند.
     */
    function setRate(n) {
      State.savedRate = clamp(
        n,
        CONFIG.speech.minRate,
        CONFIG.speech.maxRate
      );
      Storage.saveRate(State.savedRate);
      log('rate:', State.savedRate);
    }

    /**
     * تنظیم pitch.
     */
    function setPitch(n) {
      State.savedPitch = clamp(
        n,
        CONFIG.speech.minPitch,
        CONFIG.speech.maxPitch
      );
      Storage.savePitch(State.savedPitch);
      log('pitch:', State.savedPitch);
    }

    /**
     * به‌روزرسانی وضعیت بصری دکمه‌ی صدا.
     */
    function updateButtonState(speaking) {
      if (!DOM.soundBtn) return;
      if (speaking) {
        DOM.soundBtn.setAttribute('data-speaking', 'true');
        DOM.soundBtn.setAttribute('aria-pressed', 'true');
        DOM.soundBtn.setAttribute('aria-label', 'توقف خواندن');
      } else {
        DOM.soundBtn.removeAttribute('data-speaking');
        DOM.soundBtn.setAttribute('aria-pressed', 'false');
        DOM.soundBtn.setAttribute('aria-label', 'خواندن با صدا');
      }
    }

    /**
     * پاک‌سازی منابع.
     */
    function destroy() {
      cancel();
      if (!HAS_SPEECH) return;
      try {
        if (typeof window.speechSynthesis.removeEventListener === 'function' &&
            voicesChangedHandler) {
          window.speechSynthesis.removeEventListener(
            'voiceschanged', voicesChangedHandler
          );
        } else {
          window.speechSynthesis.onvoiceschanged = null;
        }
      } catch (_) { /* ignore */ }
      if (pendingVoicesRetry) {
        window.clearTimeout(pendingVoicesRetry);
        pendingVoicesRetry = null;
      }
    }

    return {
      init, speak, cancel, pause, resume,
      speaking, hasPersianVoice, availableVoices,
      setRate, setPitch, destroy,
    };
  })();


  // ═══════════════════════════════════════════════════════════════
  // 09 — موتور صدا (Web Audio)
  // ───────────────────────────────────────────────────────────────
  // یک سینت‌سایزر کوچک برای زنگ‌های کوتاه. بدون فایل خارجی.
  // ═══════════════════════════════════════════════════════════════

  const Sound = (() => {

    function ensureContext() {
      if (!HAS_WEB_AUDIO) return null;
      if (State.audioContext) return State.audioContext;
      try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        State.audioContext = new Ctx();
        State.audioMasterGain = State.audioContext.createGain();
        State.audioMasterGain.gain.value = 0.6;
        State.audioMasterGain.connect(State.audioContext.destination);
        log('AudioContext ایجاد شد');
        return State.audioContext;
      } catch (err) {
        warn('نمی‌توان AudioContext ساخت', err);
        return null;
      }
    }

    function playTone(frequency, when, duration, gainScale = 1) {
      const ctx = ensureContext();
      if (!ctx || !State.audioMasterGain) return;
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = frequency;
        const start = ctx.currentTime + when;
        const end = start + duration;
        const peak = CONFIG.motion.sound.gain * gainScale;
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(peak, start + CONFIG.motion.sound.attack);
        gain.gain.exponentialRampToValueAtTime(0.0001, end);
        osc.connect(gain);
        gain.connect(State.audioMasterGain);
        osc.start(start);
        osc.stop(end + 0.02);
      } catch (err) {
        warn('پخش صدا ناموفق', err);
      }
    }

    function chime() {
      if (!State.soundEnabled) return;
      const base = CONFIG.motion.sound.baseFrequency;
      const intervals = CONFIG.motion.sound.intervals;
      playTone(base, 0, 0.45, 1);
      playTone(base * intervals[1], 0.02, 0.4, 0.7);
      playTone(base * intervals[2], 0.04, 0.35, 0.5);
    }

    function tick() {
      if (!State.soundEnabled) return;
      const base = CONFIG.motion.sound.baseFrequency * 2;
      playTone(base, 0, 0.06, 0.35);
    }

    function settle() {
      if (!State.soundEnabled) return;
      const base = CONFIG.motion.sound.baseFrequency * 0.5;
      playTone(base, 0, 0.3, 0.45);
    }

    function toggleConfirm(enabled) {
      const base = CONFIG.motion.sound.baseFrequency;
      if (enabled) {
        playTone(base, 0, 0.12, 0.5);
        playTone(base * 1.5, 0.08, 0.14, 0.5);
      } else {
        playTone(base * 1.5, 0, 0.12, 0.5);
        playTone(base, 0.08, 0.14, 0.5);
      }
    }

    function resumeIfSuspended() {
      const ctx = State.audioContext;
      if (!ctx) return;
      if (ctx.state === 'suspended') {
        ctx.resume().catch((err) => warn('resume AudioContext ناموفق', err));
      }
    }

    function destroy() {
      if (State.audioContext) {
        try { State.audioContext.close(); } catch (_) { /* ignore */ }
      }
      State.audioContext = null;
      State.audioMasterGain = null;
    }

    return { ensureContext, chime, tick, settle, toggleConfirm, resumeIfSuspended, destroy };
  })();


  // ═══════════════════════════════════════════════════════════════
  // 10 — توست
  // ───────────────────────────────────────────────────────────────
  // یک توست واحد و قابل استفاده‌ی مجدد. ~۱۰۰ خط متمرکز.
  // ═══════════════════════════════════════════════════════════════

  const Toast = (() => {

    function ensureElement() {
      if (State.activeToast && document.body.contains(State.activeToast)) {
        return State.activeToast;
      }
      const el = document.createElement('div');
      el.className = 'toast';
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      el.setAttribute('aria-atomic', 'true');
      document.body.appendChild(el);
      State.activeToast = el;
      return el;
    }

    function show(message, options = {}) {
      const duration = options.duration || CONFIG.motion.toast.visibleDuration;
      const el = ensureElement();
      el.textContent = message;

      if (State.toastTimeoutId) {
        window.clearTimeout(State.toastTimeoutId);
        State.toastTimeoutId = null;
      }

      if (HAS_GSAP) {
        window.gsap.killTweensOf(el);
        window.gsap.set(el, { opacity: 0, y: 12 });
        window.gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: CONFIG.motion.toast.enterDuration,
          ease: 'power2.out',
          onStart: () => el.classList.add('is-visible'),
        });
      } else {
        forceReflow(el);
        el.classList.add('is-visible');
      }

      State.toastTimeoutId = window.setTimeout(() => hide(), duration);
    }

    function hide() {
      const el = State.activeToast;
      if (!el) return;
      if (State.toastTimeoutId) {
        window.clearTimeout(State.toastTimeoutId);
        State.toastTimeoutId = null;
      }
      if (HAS_GSAP) {
        window.gsap.to(el, {
          opacity: 0,
          y: 8,
          duration: CONFIG.motion.toast.exitDuration,
          ease: 'power2.in',
          onComplete: () => el.classList.remove('is-visible'),
        });
      } else {
        el.classList.remove('is-visible');
      }
    }

    return { show, hide };
  })();


  // ═══════════════════════════════════════════════════════════════
  // 11 — ریپل
  // ───────────────────────────────────────────────────────────────
  // روی هر کلیک، یک ریپل گرم از محل کلیک ساطع می‌شود.
  // ═══════════════════════════════════════════════════════════════

  const Ripple = (() => {

    function resolveOrigin(el, event) {
      const rect = el.getBoundingClientRect();
      const hasPointer = (
        event &&
        typeof event.clientX === 'number' &&
        typeof event.clientY === 'number' &&
        (event.clientX !== 0 || event.clientY !== 0)
      );
      if (hasPointer) {
        return {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        };
      }
      return { x: rect.width / 2, y: rect.height / 2 };
    }

    function resolveSize(el, origin) {
      const rect = el.getBoundingClientRect();
      const dx = Math.max(origin.x, rect.width - origin.x);
      const dy = Math.max(origin.y, rect.height - origin.y);
      const radius = Math.sqrt(dx * dx + dy * dy);
      return clamp(
        radius * 2,
        CONFIG.motion.press.rippleMinSize,
        CONFIG.motion.press.rippleMaxSize
      );
    }

    function spawn(el, event) {
      if (!el) return;
      try {
        const origin = resolveOrigin(el, event);
        const size = resolveSize(el, origin);
        const node = document.createElement('span');
        node.className = 'ripple';
        node.style.width = `${size}px`;
        node.style.height = `${size}px`;
        node.style.left = `${origin.x}px`;
        node.style.top = `${origin.y}px`;
        node.setAttribute('aria-hidden', 'true');
        el.appendChild(node);

        const cleanup = () => {
          if (node.parentNode) node.parentNode.removeChild(node);
        };
        node.addEventListener('animationend', cleanup, { once: true });
        window.setTimeout(cleanup, 900);
      } catch (err) {
        warn('ساخت ریپل ناموفق', err);
      }
    }

    return { spawn };
  })();


  // ═══════════════════════════════════════════════════════════════
  // 12 — بازخورد فشار دکمه
  // ───────────────────────────────────────────────────────────────
  // فشار فیزیکی دکمه: مقیاس کوچک، سایه‌ی inset، سپس رهاسازی.
  // ═══════════════════════════════════════════════════════════════

  const Press = (() => {

    let activeTween = null;

    function trigger(el, event) {
      if (!el) return;

      Ripple.spawn(el, event);
      Sound.tick();

      if (HAS_GSAP && !prefersReducedMotion) {
        if (activeTween) activeTween.kill();
        el.classList.add('is-pressed');
        activeTween = window.gsap.to(el, {
          scale: CONFIG.motion.press.pressScale,
          duration: CONFIG.motion.press.pressDuration,
          ease: 'power2.in',
          onComplete: safe(() => {
            activeTween = window.gsap.to(el, {
              scale: 1,
              duration: CONFIG.motion.press.releaseDuration,
              ease: CONFIG.motion.press.releaseEase,
              onComplete: safe(() => {
                el.classList.remove('is-pressed');
                activeTween = null;
              }),
            });
          }),
        });
      } else {
        el.classList.add('is-pressed');
        window.setTimeout(() => el.classList.remove('is-pressed'), 120);
      }
    }

    return { trigger };
  })();


  // ═══════════════════════════════════════════════════════════════
  // 13 — شمارنده
  // ───────────────────────────────────────────────────────────────
  // شمارش نقل‌قول‌های یکتا با Set. پایدارسازی در localStorage.
  // ═══════════════════════════════════════════════════════════════

  const Counter = (() => {

    const total = texts.length;

    function sync() {
      if (!DOM.quoteCounter) return;
      const seen = State.seenIndices.size;
      DOM.quoteCounter.textContent = formatCounter(seen, total);
    }

    function register(quote) {
      if (typeof quote !== 'string') return;
      const key = canonicalQuoteKey(quote);
      if (!key) return;
      if (State.seenIndices.has(key)) return;
      State.seenIndices.add(key);
      State.totalSeen = State.seenIndices.size;
      Storage.saveSeenQuotes(State.seenIndices);
      sync();
      animateFlip();
    }

    function animateFlip() {
      if (!DOM.quoteCounter) return;
      if (HAS_GSAP && !prefersReducedMotion) {
        window.gsap.killTweensOf(DOM.quoteCounter);
        window.gsap.fromTo(
          DOM.quoteCounter,
          { scale: 1, color: 'var(--ink-muted)' },
          {
            scale: 1.08,
            color: 'var(--accent-deep)',
            duration: CONFIG.motion.counter.flipDuration / 2,
            yoyo: true,
            repeat: 1,
            ease: CONFIG.motion.counter.flipEase,
            onComplete: safe(() => {
              window.gsap.set(DOM.quoteCounter, { scale: 1, clearProps: 'color' });
            }),
          }
        );
      } else {
        DOM.quoteCounter.classList.add('is-flipping');
        window.setTimeout(() => {
          DOM.quoteCounter.classList.remove('is-flipping');
        }, 300);
      }
    }

    function reset() {
      State.seenIndices.clear();
      State.totalSeen = 0;
      Storage.saveSeenQuotes(State.seenIndices);
      sync();
    }

    function load() {
      State.seenIndices = Storage.loadSeenQuotes();
      State.totalSeen = State.seenIndices.size;
      sync();
    }

    return { sync, register, reset, load };
  })();


  // ═══════════════════════════════════════════════════════════════
  // 14 — ارکستراتور نمایش نقل‌قول
  // ───────────────────────────────────────────────────────────────
  // خواندن از DOM پس از اجرای شنونده‌ی اصلی و اجرای انیمیشن.
  // ═══════════════════════════════════════════════════════════════

  const Reveal = (() => {

    function run() {
      if (!DOM.quoteText) {
        const current = DOM.quoteBox.textContent;
        Counter.register(current);
        return;
      }

      if (State.isRevealing) {
        cancel();
      }

      const newText = DOM.quoteBox.textContent || '';

      /* اگر خواندن در جریان بود، لغو کن */
      if (Speech.speaking()) {
        Speech.cancel();
      }

      Counter.register(newText);
      State.lastQuote = newText;
      State.isRevealing = true;

      if (!HAS_GSAP || prefersReducedMotion) {
        runReducedMotionReveal();
        return;
      }

      runFullReveal();
    }

    function runFullReveal() {
      const card = DOM.quoteCard;
      const text = DOM.quoteText;

      const tl = window.gsap.timeline({
        onComplete: safe(() => {
          State.isRevealing = false;
          State.revealTimeline = null;
          text.classList.remove('is-arriving');
          card.classList.remove('is-speaking');
        }),
      });
      State.revealTimeline = tl;

      tl.fromTo(
        text,
        { opacity: 1, y: 0, clipPath: CONFIG.motion.reveal.clipPathTo },
        {
          opacity: 0,
          y: -6,
          duration: CONFIG.motion.reveal.leavingDuration,
          ease: 'power2.in',
        }
      );

      tl.fromTo(
        text,
        {
          opacity: 0,
          y: -4,
          clipPath: CONFIG.motion.reveal.clipPathFrom,
        },
        {
          opacity: 1,
          y: 0,
          clipPath: CONFIG.motion.reveal.clipPathTo,
          duration: CONFIG.motion.reveal.arrivingDuration,
          ease: 'power3.out',
        },
        '>-0.02'
      );

      tl.to(
        card,
        {
          y: -3,
          duration: CONFIG.motion.reveal.cardLiftDuration / 2,
          ease: 'power2.out',
          yoyo: true,
          repeat: 1,
        },
        '<0.05'
      );

      tl.add(safe(() => {
        card.classList.add('is-speaking');
        if (State.soundEnabled) Sound.chime();
      }), '<0.1');

      tl.to(card, {
        duration: CONFIG.motion.reveal.glowDuration,
        ease: 'power2.inOut',
        onComplete: safe(() => card.classList.remove('is-speaking')),
      });

      const shine = card.querySelector('.quote-card__shine');
      if (shine) {
        tl.fromTo(
          shine,
          { opacity: 0, x: '-30%' },
          {
            opacity: 0.8,
            x: '130%',
            duration: 0.6,
            ease: 'power2.inOut',
            onComplete: safe(() => {
              window.gsap.set(shine, { opacity: 0 });
            }),
          },
          '<0.05'
        );
      }
    }

    function runReducedMotionReveal() {
      const card = DOM.quoteCard;
      const text = DOM.quoteText;

      if (HAS_GSAP) {
        const tl = window.gsap.timeline({
          onComplete: safe(() => {
            State.isRevealing = false;
            State.revealTimeline = null;
          }),
        });
        State.revealTimeline = tl;
        tl.fromTo(text, { opacity: 0 }, {
          opacity: 1,
          duration: 0.32,
          ease: 'power1.out',
        });
      } else {
        text.classList.add('is-arriving');
        State.isRevealing = true;
        window.setTimeout(() => {
          State.isRevealing = false;
          text.classList.remove('is-arriving');
        }, 340);
      }

      if (State.soundEnabled) Sound.chime();
    }

    function cancel() {
      if (State.revealTimeline) {
        try { State.revealTimeline.kill(); } catch (_) { /* ignore */ }
        State.revealTimeline = null;
      }
      State.isRevealing = false;
      if (DOM.quoteText) {
        DOM.quoteText.classList.remove('is-arriving');
        if (HAS_GSAP) {
          window.gsap.set(DOM.quoteText, {
            opacity: 1, y: 0,
            clipPath: CONFIG.motion.reveal.clipPathTo,
          });
        }
      }
      if (DOM.quoteCard) {
        DOM.quoteCard.classList.remove('is-speaking');
        if (HAS_GSAP) window.gsap.set(DOM.quoteCard, { y: 0 });
      }
    }

    return { run, cancel };
  })();


  // ═══════════════════════════════════════════════════════════════
  // 15 — ورود سه‌بعدی کارت
  // ───────────────────────────────────────────────────────────────
  // کارت مثل چیزی که از شکاف دستگاه بیرون می‌آید، با شیب ملایم.
  // ═══════════════════════════════════════════════════════════════

  const CardEntrance = (() => {

    let hasRunOnce = false;

    function run(force = false) {
      if (!DOM.quoteCard) return;
      if (hasRunOnce && !force) return;
      hasRunOnce = true;

      if (!HAS_GSAP || prefersReducedMotion) {
        DOM.quoteCard.style.opacity = '0';
        forceReflow(DOM.quoteCard);
        DOM.quoteCard.style.transition = 'opacity 320ms ease';
        DOM.quoteCard.style.opacity = '1';
        return;
      }

      const m = CONFIG.motion.emerge;
      window.gsap.fromTo(
        DOM.quoteCard,
        {
          y: m.fromTranslateY,
          rotateX: m.fromRotateX,
          scale: m.fromScale,
          opacity: m.fromOpacity,
          transformPerspective: 900,
          transformOrigin: '50% 0%',
        },
        {
          y: 0, rotateX: 0, scale: 1, opacity: 1,
          duration: m.duration,
          ease: m.ease,
          onComplete: safe(() => {
            window.gsap.set(DOM.quoteCard, { clearProps: 'transform' });
          }),
        }
      );
    }

    function reset() { hasRunOnce = false; }

    return { run, reset };
  })();


  // ═══════════════════════════════════════════════════════════════
  // 16 — ورود صفحه
  // ───────────────────────────────────────────────────────────────
  // افتتاح آرام: دستگاه، کارت، دکمه، کپشن.
  // ═══════════════════════════════════════════════════════════════

  const PageEntrance = (() => {

    let hasRun = false;

    function run() {
      if (hasRun) return;
      hasRun = true;

      if (!HAS_GSAP || prefersReducedMotion) {
        log('ورود صفحه ساده (بدون GSAP یا با کاهش حرکت).');
        return;
      }

      const m = CONFIG.motion.entrance;
      const tl = window.gsap.timeline({
        delay: 0.05,
        onComplete: safe(() => {
          State.entranceTimeline = null;
          if (DOM.deviceBody) {
            window.gsap.set(DOM.deviceBody, { clearProps: 'transform,opacity' });
          }
        }),
      });
      State.entranceTimeline = tl;

      if (DOM.deviceBody) {
        tl.fromTo(
          DOM.deviceBody,
          { scale: 0.94, opacity: 0 },
          { scale: 1, opacity: 1, duration: m.deviceDuration, ease: m.deviceEase }
        );
      }

      if (DOM.quoteCard) {
        tl.fromTo(
          DOM.quoteCard,
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: m.cardDuration, ease: 'power2.out' },
          `-=${m.deviceDuration - m.cardDelay}`
        );
      }

      if (DOM.generateBtn) {
        tl.to(
          DOM.generateBtn,
          {
            scale: 1.03, duration: 0.25, ease: 'power2.inOut',
            yoyo: true, repeat: 1,
          },
          `+=${m.buttonPulseDelay - m.cardDelay}`
        );
      }

      if (DOM.deviceCaption) {
        tl.fromTo(
          DOM.deviceCaption,
          { opacity: 0, y: 6 },
          { opacity: 1, y: 0, duration: m.captionDuration, ease: 'power2.out' },
          `-=${m.captionDelay}`
        );
      }

      if (DOM.quoteCounter) {
        tl.fromTo(
          DOM.quoteCounter,
          { opacity: 0 },
          { opacity: 1, duration: 0.4, ease: 'power1.out' },
          '-=0.6'
        );
      }
    }

    function reset() { hasRun = false; }

    return { run, reset };
  })();


  // ═══════════════════════════════════════════════════════════════
  // 17 — شیب موس
  // ───────────────────────────────────────────────────────────────
  // روی دسکتاپ، دستگاه با حرکت موس خیلی ملایم می‌چرخد (حداکثر ۳°).
  // روی لمسی و کاهش حرکت غیرفعال.
  // ═══════════════════════════════════════════════════════════════

  const MouseTilt = (() => {

    const MAX_ROTATE = CONFIG.motion.tilt.maxRotate;
    const LERP = CONFIG.motion.tilt.lerpFactor;

    let currentRotateX = 0;
    let currentRotateY = 0;
    let targetRotateX = 0;
    let targetRotateY = 0;
    let bounds = { left: 0, top: 0, width: 0, height: 0, centerX: 0, centerY: 0 };
    let listening = false;

    function refreshBounds() {
      if (!DOM.deviceBody) return;
      const rect = DOM.deviceBody.getBoundingClientRect();
      bounds = {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        centerX: rect.left + rect.width / 2,
        centerY: rect.top + rect.height / 2,
      };
    }

    function onPointerMove(event) {
      if (!bounds.width || !bounds.height) {
        refreshBounds();
        if (!bounds.width) return;
      }
      const dx = (event.clientX - bounds.centerX) / (bounds.width / 2);
      const dy = (event.clientY - bounds.centerY) / (bounds.height / 2);
      const nx = clamp(dx, -1, 1);
      const ny = clamp(dy, -1, 1);
      targetRotateX = -ny * MAX_ROTATE;
      targetRotateY = nx * MAX_ROTATE;
    }

    function onPointerLeave() {
      targetRotateX = 0;
      targetRotateY = 0;
    }

    function loop() {
      const dx = targetRotateX - currentRotateX;
      const dy = targetRotateY - currentRotateY;
      if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) {
        if (Math.abs(currentRotateX - targetRotateX) > 0.001 ||
            Math.abs(currentRotateY - targetRotateY) > 0.001) {
          currentRotateX = targetRotateX;
          currentRotateY = targetRotateY;
          apply();
        }
        State.tiltRafId = null;
        return;
      }
      currentRotateX = lerp(currentRotateX, targetRotateX, LERP);
      currentRotateY = lerp(currentRotateY, targetRotateY, LERP);
      apply();
      State.tiltRafId = window.requestAnimationFrame(loop);
    }

    function apply() {
      if (!DOM.deviceBody) return;
      if (HAS_GSAP) {
        window.gsap.set(DOM.deviceBody, {
          rotateX: currentRotateX,
          rotateY: currentRotateY,
          transformPerspective: CONFIG.motion.tilt.perspective,
          transformOrigin: '50% 50%',
        });
      } else {
        DOM.deviceBody.style.transform =
          `perspective(${CONFIG.motion.tilt.perspective}px) ` +
          `rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg)`;
      }
    }

    function kick() {
      if (State.tiltRafId !== null) return;
      if (!HAS_RAF) return;
      State.tiltRafId = window.requestAnimationFrame(loop);
    }

    function enable() {
      if (!DOM.deviceBody || listening) return;
      if (IS_TOUCH) { log('لمسی — شیب موس غیرفعال'); return; }
      if (prefersReducedMotion) { log('کاهش حرکت — شیب موس غیرفعال'); return; }
      State.tiltEnabled = true;
      refreshBounds();
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      DOM.deviceBody.addEventListener('pointerleave', onPointerLeave, { passive: true });
      window.addEventListener('resize', onResize, { passive: true });
      window.addEventListener('scroll', onResize, { passive: true });
      listening = true;
      kick();
      log('شیب موس فعال شد');
    }

    function disable() {
      if (!listening) return;
      window.removeEventListener('pointermove', onPointerMove);
      if (DOM.deviceBody) {
        DOM.deviceBody.removeEventListener('pointerleave', onPointerLeave);
      }
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onResize);
      listening = false;
      State.tiltEnabled = false;
      if (State.tiltRafId !== null && HAS_RAF) {
        window.cancelAnimationFrame(State.tiltRafId);
        State.tiltRafId = null;
      }
      if (DOM.deviceBody) {
        if (HAS_GSAP) {
          window.gsap.set(DOM.deviceBody, { rotateX: 0, rotateY: 0 });
        } else {
          DOM.deviceBody.style.transform = '';
        }
      }
      currentRotateX = 0; currentRotateY = 0;
      targetRotateX = 0; targetRotateY = 0;
      log('شیب موس غیرفعال شد');
    }

    const onResize = debounce(refreshBounds, 120);

    return { enable, disable, kick, refreshBounds };
  })();


  // ═══════════════════════════════════════════════════════════════
  // 18 — حرکت محیطی
  // ───────────────────────────────────────────────────────────────
  // چرخه‌های بی‌پایان: درخشش، shimmer تاج، ضربان نقطه، LED.
  // ═══════════════════════════════════════════════════════════════

  const Ambient = (() => {

    let paused = false;
    let gsapGlowTween = null;
    let gsapDotTween = null;

    function start() {
      if (prefersReducedMotion) {
        log('کاهش حرکت — حلقه‌های محیطی GSAP رد شدند.');
        return;
      }
      if (!HAS_GSAP) {
        log('بدون GSAP — حلقه‌ها به CSS محدود می‌شوند.');
        return;
      }

      const glow = qs('.ambient__glow');
      if (glow) {
        gsapGlowTween = window.gsap.to(glow, {
          scale: CONFIG.motion.ambient.glowScale,
          opacity: CONFIG.motion.ambient.glowOpacity[1],
          duration: CONFIG.motion.ambient.glowDuration / 2,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });
      }

      if (DOM.quoteDot) {
        gsapDotTween = window.gsap.to(DOM.quoteDot, {
          scale: 1.35,
          duration: 0.16,
          ease: 'power2.out',
          yoyo: true,
          repeat: -1,
          repeatDelay: CONFIG.motion.ambient.dotPulseDuration - 0.32,
        });
      }
    }

    function pause() {
      if (paused) return;
      paused = true;
      document.body.classList.add('animations-paused');
      if (HAS_GSAP) {
        if (gsapGlowTween) gsapGlowTween.pause();
        if (gsapDotTween) gsapDotTween.pause();
      }
      log('حرکت محیطی متوقف شد');
    }

    function resume() {
      if (!paused) return;
      paused = false;
      document.body.classList.remove('animations-paused');
      if (HAS_GSAP) {
        if (gsapGlowTween) gsapGlowTween.resume();
        if (gsapDotTween) gsapDotTween.resume();
      }
      log('حرکت محیطی از سر گرفته شد');
    }

    return { start, pause, resume };
  })();


  // ═══════════════════════════════════════════════════════════════
  // 19 — کپی نقل‌قول
  // ───────────────────────────────────────────────────────────────
  // دکمه‌ای کوچک در گوشه‌ی کارت. با Clipboard API یا فالبک.
  // ═══════════════════════════════════════════════════════════════

  const CopyQuote = (() => {

    let buttonEl = null;

    function ensureButton() {
      if (buttonEl && document.body.contains(buttonEl)) return buttonEl;
      if (!DOM.quoteCard) return null;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'quote-card__copy';
      btn.setAttribute('aria-label', 'کپی نقل‌قول');
      btn.setAttribute('title', 'کپی نقل‌قول');
      btn.innerHTML = '<svg aria-hidden="true" width="14" height="14"><use href="#icon-copy"></use></svg>';
      btn.addEventListener('click', onCopyClick);
      DOM.quoteCard.appendChild(btn);
      buttonEl = btn;
      return btn;
    }

    function reveal() {
      const btn = ensureButton();
      if (!btn) return;
      DOM.quoteCard.classList.add('has-quote');
    }

    function onCopyClick(event) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      const text = DOM.quoteBox ? DOM.quoteBox.textContent : '';
      if (!text) {
        Toast.show('چیزی برای کپی نیست.');
        return;
      }
      if (HAS_CLIPBOARD) {
        navigator.clipboard.writeText(text).then(
          () => onCopySuccess(),
          () => onCopyFallback(text)
        );
      } else {
        onCopyFallback(text);
      }
    }

    function onCopyFallback(text) {
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.top = '-1000px';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(ta);
        if (ok) onCopySuccess();
        else Toast.show('کپی نشد — دستی امتحان کن.');
      } catch (err) {
        warn('کپی فالبک ناموفق', err);
        Toast.show('کپی نشد — دستی امتحان کن.');
      }
    }

    function onCopySuccess() {
      Toast.show('کپی شد ✓');
      if (!buttonEl) return;
      buttonEl.classList.add('is-copied');
      buttonEl.innerHTML = '<svg aria-hidden="true" width="14" height="14"><use href="#icon-check"></use></svg>';
      window.setTimeout(() => {
        if (!buttonEl) return;
        buttonEl.classList.remove('is-copied');
        buttonEl.innerHTML = '<svg aria-hidden="true" width="14" height="14"><use href="#icon-copy"></use></svg>';
      }, 1600);
    }

    function destroy() {
      if (buttonEl && buttonEl.parentNode) {
        buttonEl.removeEventListener('click', onCopyClick);
        buttonEl.parentNode.removeChild(buttonEl);
        buttonEl = null;
      }
      if (DOM.quoteCard) DOM.quoteCard.classList.remove('has-quote');
    }

    return { reveal, destroy };
  })();


  // ═══════════════════════════════════════════════════════════════
  // 20 — اشتراک‌گذاری
  // ───────────────────────────────────────────────────────────────
  // از Web Share API اگر موجود بود؛ در غیر این صورت به کپی برمی‌گردد.
  // ═══════════════════════════════════════════════════════════════

  const Share = (() => {

    function shareCurrentQuote() {
      const text = DOM.quoteBox ? DOM.quoteBox.textContent : '';
      if (!text) {
        Toast.show('چیزی برای اشتراک نیست.');
        return;
      }
      if (HAS_SHARE) {
        navigator.share({
          title: 'اوراکل برنامه‌نویس',
          text: text,
          url: window.location.href,
        }).catch((err) => {
          if (err && err.name !== 'AbortError') {
            warn('خطای اشتراک', err);
            fallbackCopy(text);
          }
        });
      } else {
        fallbackCopy(text);
      }
    }

    function fallbackCopy(text) {
      if (HAS_CLIPBOARD) {
        navigator.clipboard.writeText(text).then(
          () => Toast.show('کپی شد ✓ — آماده‌ی اشتراک'),
          () => Toast.show('اشتراک ممکن نشد.')
        );
      } else {
        Toast.show('اشتراک در این مرورگر پشتیبانی نمی‌شود.');
      }
    }

    return { shareCurrentQuote };
  })();


  // ═══════════════════════════════════════════════════════════════
  // 21 — دکمه‌ی خواندن
  // ───────────────────────────────────────────────────────────────
  // رفتار دکمه‌ی #soundBtn:
  //   • اگر در حال خواندن است → لغو
  //   • اگر صدا خاموش است → روشن + خواندن
  //   • اگر صدا روشن است → خواندن
  // ═══════════════════════════════════════════════════════════════

  const SpeakToggle = (() => {

    function onClick(event) {
      if (event) event.preventDefault();

      /* لغو اگر در حال خواندن */
      if (Speech.speaking()) {
        Speech.cancel();
        log('خواندن لغو شد');
        return;
      }

      /* روشن‌کردن صدا در اولین استفاده */
      if (!State.soundEnabled) {
        setSoundEnabled(true);
        Sound.ensureContext();
        Sound.resumeIfSuspended();
        Sound.toggleConfirm(true);
      }

      /* خواندن متن فعلی */
      const text = DOM.quoteBox ? DOM.quoteBox.textContent : '';
      Speech.speak(text);
    }

    function setSoundEnabled(enabled) {
      State.soundEnabled = !!enabled;
      Storage.saveSoundPref(State.soundEnabled);
      if (DOM.soundBtn) {
        if (!Speech.speaking()) {
          DOM.soundBtn.setAttribute('aria-pressed', 'false');
        }
      }
      log('صدا:', State.soundEnabled);
    }

    function bind() {
      if (!DOM.soundBtn) return;
      DOM.soundBtn.addEventListener('click', onClick);
    }

    function unbind() {
      if (!DOM.soundBtn) return;
      DOM.soundBtn.removeEventListener('click', onClick);
    }

    return { bind, unbind, setSoundEnabled };
  })();


  // ═══════════════════════════════════════════════════════════════
  // 22 — کلیدهای میانبر
  // ───────────────────────────────────────────────────────────────
  // Space → نقل‌قول جدید، Esc → بستن مودال، V → خواندن متن،
  // C → کپی، S → اشتراک.
  // ═══════════════════════════════════════════════════════════════

  const Keyboard = (() => {

    function isTypingContext() {
      const el = document.activeElement;
      if (!el) return false;
      const tag = el.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
      if (el.isContentEditable) return true;
      return false;
    }

    function onKeyDown(event) {
      if (isTypingContext()) return;

      /* Esc */
      if (event.key === 'Escape' || event.key === 'Esc') {
        if (window.location.hash === '#creator') {
          event.preventDefault();
          window.location.hash = '';
        }
        return;
      }

      /* Space → نقل‌قول جدید */
      if (event.code === 'Space' || event.key === ' ') {
        if (document.activeElement === DOM.generateBtn) return;
        event.preventDefault();
        DOM.generateBtn.click();
        return;
      }

      /* V → خواندن */
      if (event.key === 'v' || event.key === 'V') {
        event.preventDefault();
        DOM.soundBtn.click();
        return;
      }

      /* C → کپی */
      if (event.key === 'c' || event.key === 'C') {
        if (event.ctrlKey || event.metaKey) return;
        const copyBtn = DOM.quoteCard && DOM.quoteCard.querySelector('.quote-card__copy');
        if (copyBtn) {
          event.preventDefault();
          copyBtn.click();
        }
        return;
      }

      /* S → اشتراک */
      if (event.key === 's' || event.key === 'S') {
        if (event.ctrlKey || event.metaKey) return;
        if (!State.firstQuoteRevealed) return;
        event.preventDefault();
        Share.shareCurrentQuote();
      }
    }

    function bind() {
      window.addEventListener('keydown', onKeyDown);
    }

    function unbind() {
      window.removeEventListener('keydown', onKeyDown);
    }

    return { bind, unbind };
  })();


  // ═══════════════════════════════════════════════════════════════
  // 23 — مدیریت پنهان‌شدن تب
  // ───────────────────────────────────────────────────────────────
  // وقتی تب مخفی می‌شود: حرکت محیطی متوقف، صدا معلق، خواندن لغو.
  // ═══════════════════════════════════════════════════════════════

  const Visibility = (() => {

    function onChange() {
      if (document.hidden) {
        State.visibilityPaused = true;
        Ambient.pause();
        if (Speech.speaking()) Speech.cancel();
        try {
          if (State.audioContext && State.audioContext.state === 'running') {
            State.audioContext.suspend();
          }
        } catch (_) { /* ignore */ }
      } else {
        if (State.visibilityPaused) {
          State.visibilityPaused = false;
          Ambient.resume();
          try {
            if (State.audioContext && State.audioContext.state === 'suspended') {
              State.audioContext.resume();
            }
          } catch (_) { /* ignore */ }
        }
      }
    }

    function bind() {
      document.addEventListener('visibilitychange', onChange);
    }

    function unbind() {
      document.removeEventListener('visibilitychange', onChange);
    }

    return { bind, unbind };
  })();


  // ═══════════════════════════════════════════════════════════════
  // 24 — مرز خطا
  // ───────────────────────────────────────────────────────────────
  // هر خطای غیرمنتظره در لایه‌ی افزوده را می‌گیرد. شنونده‌ی
  // اصلی دست‌نخورده، همیشه کار می‌کند.
  // ═══════════════════════════════════════════════════════════════

  const ErrorBoundary = (() => {

    function onError(event) {
      State.errorCount += 1;
      State.lastError = event.error || new Error(event.message || 'خطای نامشخص');
      warn('خطای گرفته‌شده', event.error || event.message);
    }

    function onRejection(event) {
      State.errorCount += 1;
      State.lastError = event.reason || new Error('Promise ردشده');
      warn('Promise ردشده', event.reason);
    }

    function bind() {
      window.addEventListener('error', onError);
      window.addEventListener('unhandledrejection', onRejection);
    }

    function unbind() {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onRejection);
    }

    return { bind, unbind };
  })();


  // ═══════════════════════════════════════════════════════════════
  // 25 — API اشکال‌زدایی
  // ───────────────────────────────────────────────────────────────
  // سطح کوچک روی window.__oracle برای دیباگ.
  // ═══════════════════════════════════════════════════════════════

  const Debug = (() => {

    function snapshot() {
      return {
        initialized: State.initialized,
        destroyed: State.destroyed,
        soundEnabled: State.soundEnabled,
        isSpeaking: State.isSpeaking,
        hasPersianVoice: Speech.hasPersianVoice(),
        selectedVoice: State.selectedVoice ? {
          name: State.selectedVoice.name,
          lang: State.selectedVoice.lang,
        } : null,
        voiceCount: State.speechVoices.length,
        totalSeen: State.totalSeen,
        uniqueSeen: State.seenIndices.size,
        totalQuotes: texts.length,
        lastQuote: State.lastQuote,
        prefersReducedMotion,
        prefersContrast,
        isTouch: IS_TOUCH,
        hasGsap: HAS_GSAP,
        hasClipboard: HAS_CLIPBOARD,
        hasShare: HAS_SHARE,
        hasWebAudio: HAS_WEB_AUDIO,
        hasSpeech: HAS_SPEECH,
        hasStorage: HAS_STORAGE,
        errorCount: State.errorCount,
        lastError: State.lastError ? String(State.lastError) : null,
        warnings: State.warnings.slice(-10),
        rate: State.savedRate,
        pitch: State.savedPitch,
        fps: State.currentFps,
      };
    }

    function expose() {
      window.__oracle = {
        snapshot,
        resetCounter: () => Counter.reset(),
        setSound: (on) => SpeakToggle.setSoundEnabled(on),
        showToast: (msg) => Toast.show(msg),
        forceEntrance: () => PageEntrance.run(),
        forceEmerge: () => CardEntrance.run(true),
        forceReveal: () => Reveal.run(),
        speak: (text) => Speech.speak(text),
        cancelSpeech: () => Speech.cancel(),
        setRate: (n) => Speech.setRate(n),
        setPitch: (n) => Speech.setPitch(n),
        share: () => Share.shareCurrentQuote(),
        clearStorage: () => Storage.clearAll(),
        setDebug: (on) => { CONFIG.debug = !!on; },
        voices: () => Speech.availableVoices(),
      };
    }

    return { expose, snapshot };
  })();


  // ═══════════════════════════════════════════════════════════════
  // 26 — راه‌اندازی
  // ───────────────────────────────────────────────────────────────
  // سیم‌کشی همه چیز. یک بار، پس از آماده شدن DOM.
  // ═══════════════════════════════════════════════════════════════

  const Init = (() => {

    function onGenerateClick(event) {
      Press.trigger(DOM.generateBtn, event);
      Reveal.run();
      CopyQuote.reveal();

      if (!State.firstQuoteRevealed) {
        State.firstQuoteRevealed = true;
        CardEntrance.run();
      }
    }

    function bindAll() {
      DOM.generateBtn.addEventListener('click', onGenerateClick);
      SpeakToggle.bind();
      Keyboard.bind();
      Visibility.bind();
      ErrorBoundary.bind();
      MouseTilt.enable();
      log('همه‌ی شنونده‌ها متصل شدند');
    }

    function unbindAll() {
      DOM.generateBtn.removeEventListener('click', onGenerateClick);
      SpeakToggle.unbind();
      Keyboard.unbind();
      Visibility.unbind();
      ErrorBoundary.unbind();
      MouseTilt.disable();
      log('همه‌ی شنونده‌ها جدا شدند');
    }

    function boot() {
      if (State.initialized || State.destroyed) return;
      State.initialized = true;

      log('راه‌اندازی Dev Oracle');
      log('محیط:', {
        gsap: HAS_GSAP,
        clipboard: HAS_CLIPBOARD,
        share: HAS_SHARE,
        touch: IS_TOUCH,
        reducedMotion: prefersReducedMotion,
        webAudio: HAS_WEB_AUDIO,
        speech: HAS_SPEECH,
        storage: HAS_STORAGE,
      });

      /* بازیابی وضعیت از localStorage */
      State.soundEnabled = Storage.loadSoundPref();
      Counter.load();
      Storage.bumpVisits();

      /* راه‌اندازی موتور خواندن */
      Speech.init();

      /* اتصال شنونده‌ها */
      bindAll();

      /* انیمیشن ورود */
      PageEntrance.run();

      /* حلقه‌های محیطی */
      Ambient.start();

      /* وضعیت اولیه‌ی کارت */
      if (DOM.quoteCard && HAS_GSAP && !prefersReducedMotion) {
        window.gsap.set(DOM.quoteCard, { opacity: 1 });
      }

      /* هینت اولین بازدید */
      if (!Storage.hasSeenHint()) {
        window.setTimeout(() => {
          Toast.show('برای شنیدن نقل‌قول، روی دکمه‌ی ♪ بزنید.', {
            duration: 4200,
          });
          Storage.markHintSeen();
        }, 3200);
      }

      /* نمایش API اشکال‌زدایی */
      Debug.expose();

      log('Dev Oracle آماده است');
    }

    function destroy() {
      if (State.destroyed) return;
      State.destroyed = true;
      unbindAll();
      Reveal.cancel();
      CopyQuote.destroy();
      Speech.destroy();
      Sound.destroy();
      Toast.hide();
      if (State.entranceTimeline) {
        try { State.entranceTimeline.kill(); } catch (_) { /* ignore */ }
      }
      log('Dev Oracle از کار افتاد');
    }

    return { boot, destroy };
  })();


  // ═══════════════════════════════════════════════════════════════
  // 27 — به‌روزرسانی زنده‌ی ترجیحات
  // ───────────────────────────────────────────────────────────────
  // اگر کاربر تنظیمات کاهش حرکت را وسط کار عوض کند، ما واکنش
  // می‌دهیم.
  // ═══════════════════════════════════════════════════════════════

  try {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotionChange = (event) => {
      prefersReducedMotion = event.matches;
      log('تغییر ترجیح کاهش حرکت:', prefersReducedMotion);
      if (prefersReducedMotion) {
        Reveal.cancel();
        MouseTilt.disable();
      } else {
        MouseTilt.enable();
      }
    };
    if (typeof motionQuery.addEventListener === 'function') {
      motionQuery.addEventListener('change', onMotionChange);
    } else if (typeof motionQuery.addListener === 'function') {
      motionQuery.addListener(onMotionChange);
    }
  } catch (_) { /* ignore */ }

  try {
    const contrastQuery = window.matchMedia('(prefers-contrast: more)');
    const onContrastChange = (event) => {
      prefersContrast = event.matches;
      log('تغییر ترجیح کنتراست:', prefersContrast);
    };
    if (typeof contrastQuery.addEventListener === 'function') {
      contrastQuery.addEventListener('change', onContrastChange);
    } else if (typeof contrastQuery.addListener === 'function') {
      contrastQuery.addListener(onContrastChange);
    }
  } catch (_) { /* ignore */ }


  // ═══════════════════════════════════════════════════════════════
  // 28 — بوت
  // ───────────────────────────────────────────────────────────────
  // منتظر DOM می‌مانیم، سپس راه‌اندازی.
  // ═══════════════════════════════════════════════════════════════

  function whenReady(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback, { once: true });
    } else {
      callback();
    }
  }

  whenReady(() => {
    try {
      Init.boot();
    } catch (err) {
      warn('بوت شکست خورد', err);
      if (CONFIG.debug) {
        // eslint-disable-next-line no-console
        console.error('[DevOracle] بوت شکست خورد:', err);
      }
    }
  });


  // ═══════════════════════════════════════════════════════════════
  // پایان فایل
  // ───────────────────────────────────────────────────────────────
  // همه چیز در یک IIFE. هیچ متغیر سرگردانی غیر از:
  //  • دو const اصلی و آرایه‌ی texts (که کد اصلی لازم دارد)
  //  • window.__oracle (سطح دیباگ، اختیاری)
  // ═══════════════════════════════════════════════════════════════

})();