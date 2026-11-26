/* موتور مشترک افکت Liquid Glass برای هر دو صفحه */
function initLiquidGlass(root = document) {
  root.querySelectorAll(".liquid-glass").forEach(btn => {
    if (btn.dataset.lgInit) return;
    btn.dataset.lgInit = "1";

    btn.addEventListener("pointermove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      btn.style.setProperty("--gx", `${x}px`);
      btn.style.setProperty("--gy", `${y}px`);

      const nx = (x / rect.width - 0.5) * 2;
      const ny = (y / rect.height - 0.5) * 2;
      const pullX = nx * 4.2;
      const pullY = ny * 3.2 - 1.8;
      const scaleX = 1 + Math.abs(nx) * 0.012;
      const scaleY = 1 - Math.abs(nx) * 0.008;

      btn.style.transition = "transform 0.08s ease-out, border-color 0.25s ease, box-shadow 0.25s ease";
      btn.style.transform = `translate3d(${pullX.toFixed(2)}px, ${pullY.toFixed(2)}px, 0) scale(${scaleX.toFixed(4)}, ${scaleY.toFixed(4)})`;
    });

    btn.addEventListener("pointerdown", () => {
      btn.style.transform = "scale(0.975)";
    });

    btn.addEventListener("pointerleave", () => {
      btn.style.transition = "transform 0.5s cubic-bezier(0.22, 1.4, 0.36, 1), border-color 0.25s ease, box-shadow 0.25s ease";
      btn.style.transform = "translate3d(0, 0, 0) scale(1, 1)";
    });
  });
}

/* =========================================================
   منطق صفحه اصلی (index.html)
   ========================================================= */
let currentLang = "fa";
let toastTimer = null;

function showToast(message) {
  const toast = document.getElementById("toast");
  const toastText = document.getElementById("toastText");
  if (!toast || !toastText) return;

  toastText.textContent = message;
  toast.classList.add("show");

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2800);
}

function downloadVCard() {
  const vcardLines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    "N:Amirkabiri;Mohammad Taqi;;;",
    "FN:Mohammad Taqi Amirkabiri",
    "TITLE:PharmD Student",
    "EMAIL;TYPE=INTERNET:amiirkabiirii@gmail.com",
    "URL:https://dramirkabiri.ir/",
    "END:VCARD"
  ];
  const blob = new Blob([vcardLines.join("\r\n")], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "Mohammad_Taqi_Amirkabiri.vcf";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast(currentLang === "fa" ? "فایل مخاطب دانلود شد!" : "Contact vCard downloaded!");
}

function handleEmailClick() {
  const email = "amiirkabiirii@gmail.com";
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(email).catch(() => {});
  } else {
    const tempInput = document.createElement("input");
    tempInput.value = email;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
  }
  showToast(currentLang === "fa" ? "ایمیل کپی شد! (amiirkabiirii@gmail.com)" : "Email copied! (amiirkabiirii@gmail.com)");
}

function toggleLanguage() {
  currentLang = currentLang === "fa" ? "en" : "fa";
  const htmlEl = document.documentElement;
  htmlEl.setAttribute("lang", currentLang);
  htmlEl.setAttribute("dir", currentLang === "fa" ? "rtl" : "ltr");

  const langLabel = document.getElementById("langLabel");
  if (langLabel) langLabel.textContent = currentLang === "fa" ? "EN" : "FA";

  const mainName = document.getElementById("mainName");
  if (mainName) {
    if (currentLang === "en") {
      mainName.textContent = "Mohammad Taqi Amirkabiri";
      mainName.style.direction = "ltr";
    } else {
      mainName.textContent = "سید محمدتقی امیرکبیری";
      mainName.style.direction = "rtl";
    }
  }

  document.querySelectorAll("[data-fa][data-en]").forEach(el => {
    el.textContent = el.getAttribute(currentLang === "fa" ? "data-fa" : "data-en");
  });
}

function openPhoto() {
  const modal = document.getElementById("photoModal");
  if (!modal) return;
  modal.classList.add("show");
  document.body.style.overflow = "hidden";
}

function forceClosePhoto() {
  const modal = document.getElementById("photoModal");
  if (!modal) return;
  modal.classList.remove("show");
  document.body.style.overflow = "";
}

function closePhoto(event) {
  if (event.target && event.target.id === "photoModal") {
    forceClosePhoto();
  }
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    forceClosePhoto();
  }
});

/* =========================================================
   منطق صفحه شجره‌نامه (lineage.html)
   ========================================================= */
function initLineagePage() {
  const container = document.getElementById("timelineContainer");
  if (!container) return;

  const lineageData = [
    {
      gen: 1, era: "qajar_modern", notable: true,
      name: { fa: "سید محمدتقی امیرکبیری", en: "Seyed Mohammad Taghi Amirkabiri" },
      title: { fa: "نسل حاضر", en: "Present Generation" },
      note: null, spouse: null
    },
    {
      gen: 2, era: "qajar_modern", notable: false,
      name: { fa: "سید غلامرضا امیرکبیری", en: "Seyed Gholamreza Amirkabiri" },
      title: { fa: "", en: "" },
      note: null, spouse: null
    },
    {
      gen: 3, era: "qajar_modern", notable: true,
      name: { fa: "سید حسن امیرکبیری رازیان", en: "Seyed Hassan Amirkabiri Razian" },
      title: { fa: "", en: "" },
      note: null,
      spouse: {
        fa: "بانو رفیعه قاضی طباطبایی (مهدوی فرخزاد)",
        en: "Lady Rafieh Ghazi Tabatabaei (Mahdavi Farrokhzad)"
      }
    },
    {
      gen: 4, era: "qajar_modern", notable: true,
      name: {
        fa: "سید رضاقلی امیرکبیری (رضاقلی مؤتمنی طباطبایی)",
        en: "Seyed Reza Gholi Amirkabiri (Reza Gholi Motameni Tabatabaei)"
      },
      title: { fa: "تمجیدالملک — سفیر ایران در آلمان", en: "Tamjid-ol-Molk — Ambassador of Iran to Germany" },
      note: {
        fa: "نام خانوادگی ایشان ابتدا «مؤتمنی طباطبایی» بود و بعدها به «امیرکبیری» تغییر یافت.",
        en: "Originally bore the surname Motameni Tabatabaei, later changed to Amirkabiri."
      },
      spouse: null
    },
    {
      gen: 5, era: "qajar_modern", notable: true,
      name: { fa: "میرزا یوسف خان سرتیپ (مؤتمن نظام)", en: "Mirza Yousef Khan Sartip (Motamen Nezam)" },
      title: { fa: "سرتیپ و مؤتمن نظام", en: "Brigadier General (Sartip)" },
      note: null,
      spouse: {
        fa: "کوکب الحاجیه خانم، دختر میرزا مهدی قاضی طباطبایی (ترابی)",
        en: "Kowkab-ol-Hajieh Khanom, daughter of Mirza Mehdi Ghazi Tabatabaei (Torabi)"
      }
    },
    {
      gen: 6, era: "qajar_modern", notable: true,
      name: { fa: "میرزا رفیع (مؤتمن دیوان)", en: "Mirza Rafi (Motamen Divan)" },
      title: { fa: "وکیل آذربایجان", en: "Representative (Vakil) of Azerbaijan" },
      note: null,
      spouse: {
        fa: "منورالدوله (امیرزاده خانم)، دختر میرزا تقی‌خان امیرکبیر",
        en: "Monavvar-od-Dowleh (Amirzadeh Khanom), daughter of Mirza Taghi Khan Amir Kabir"
      }
    },
    {
      gen: 7, era: "qajar_modern", notable: true,
      name: { fa: "میرزا کاظم امین‌الرعایا", en: "Mirza Kazem Amin-or-Roaya" },
      title: { fa: "مستوفی دفتر (به سال ۱۲۸۰ هـ.ق)", en: "State Accountant (Mostowfi-ye Daftar, 1280 AH)" },
      note: null, spouse: null
    },
    {
      gen: 8, era: "safavid_zand", notable: true,
      name: { fa: "میرزا ابراهیم", en: "Mirza Ebrahim" },
      title: { fa: "وکیل‌الرعایای آذربایجان", en: "Vakil-or-Roaya of Azerbaijan" },
      note: null, spouse: null
    },
    {
      gen: 9, era: "safavid_zand", notable: true,
      name: { fa: "میرزا صدرا", en: "Mirza Sadra" },
      title: { fa: "وکیل آذربایجان", en: "Vakil of Azerbaijan" },
      note: null, spouse: null
    },
    {
      gen: 10, era: "safavid_zand", notable: false,
      name: { fa: "میرزا محمدعلی", en: "Mirza Mohammad Ali" },
      title: { fa: "", en: "" },
      note: null, spouse: null
    },
    {
      gen: 11, era: "safavid_zand", notable: false,
      name: { fa: "میرزا صدرالدین محمد", en: "Mirza Sadr-od-Din Mohammad" },
      title: { fa: "", en: "" },
      note: null, spouse: null
    },
    {
      gen: 12, era: "safavid_zand", notable: true,
      name: { fa: "میرزا یوسف نقیب‌الاشراف", en: "Mirza Yousef Naghib-ol-Ashraf" },
      title: { fa: "نقیب‌الاشراف", en: "Chief Marshal of the Nobility (Naghib-ol-Ashraf)" },
      note: null, spouse: null
    },
    {
      gen: 13, era: "safavid_zand", notable: false,
      name: { fa: "میرزا صدرالدین محمد", en: "Mirza Sadr-od-Din Mohammad" },
      title: { fa: "", en: "" },
      note: null, spouse: null
    },
    {
      gen: 14, era: "safavid_zand", notable: false,
      name: { fa: "مجدالدین", en: "Majd-od-Din" },
      title: { fa: "", en: "" },
      note: null, spouse: null
    },
    {
      gen: 15, era: "safavid_zand", notable: false,
      name: { fa: "سید اسماعیل", en: "Seyed Esmaeil" },
      title: { fa: "", en: "" },
      note: null, spouse: null
    },
    {
      gen: 16, era: "safavid_zand", notable: true,
      name: { fa: "امیر علی‌اکبر (معروف به میرشاه‌میر)", en: "Amir Ali Akbar (Mir Shah Mir)" },
      title: { fa: "معروف به میرشاه‌میر", en: "Known as Mir Shah Mir" },
      note: null, spouse: null
    },
    {
      gen: 17, era: "safavid_zand", notable: false,
      name: { fa: "امیر عبدالوهاب", en: "Amir Abdolvahhab" },
      title: { fa: "", en: "" },
      note: null, spouse: null
    },
    {
      gen: 18, era: "safavid_zand", notable: false,
      name: { fa: "امیر عبدالغفار", en: "Amir Abdolghaffar" },
      title: { fa: "", en: "" },
      note: null, spouse: null
    },
    {
      gen: 19, era: "medieval", notable: true,
      name: { fa: "السید عمادالدین امیرالحاج", en: "Al-Seyed Emad-od-Din Amir-ol-Hajj" },
      title: { fa: "امیرالحاج", en: "Commander of the Hajj Pilgrimage" },
      note: null, spouse: null
    },
    {
      gen: 20, era: "medieval", notable: false,
      name: { fa: "فخرالدین حسن", en: "Fakhr-od-Din Hassan" },
      title: { fa: "", en: "" },
      note: null, spouse: null
    },
    {
      gen: 21, era: "medieval", notable: false,
      name: { fa: "کمال‌الدین محمد", en: "Kamal-od-Din Mohammad" },
      title: { fa: "", en: "" },
      note: null, spouse: null
    },
    {
      gen: 22, era: "medieval", notable: false,
      name: { fa: "السید حسن", en: "Al-Seyed Hassan" },
      title: { fa: "", en: "" },
      note: null, spouse: null
    },
    {
      gen: 23, era: "medieval", notable: false,
      name: { fa: "شهاب‌الدین علی", en: "Shahab-od-Din Ali" },
      title: { fa: "", en: "" },
      note: null, spouse: null
    },
    {
      gen: 24, era: "medieval", notable: false,
      name: { fa: "عمادالدین علی", en: "Emad-od-Din Ali" },
      title: { fa: "", en: "" },
      note: null, spouse: null
    },
    {
      gen: 25, era: "medieval", notable: false,
      name: { fa: "السید احمد", en: "Al-Seyed Ahmad" },
      title: { fa: "", en: "" },
      note: null, spouse: null
    },
    {
      gen: 26, era: "medieval", notable: false,
      name: { fa: "السید عماد", en: "Al-Seyed Emad" },
      title: { fa: "", en: "" },
      note: null, spouse: null
    },
    {
      gen: 27, era: "medieval", notable: true,
      name: { fa: "ابوالحسن علی الشاعر", en: "Abul-Hassan Ali al-Sha'er" },
      title: { fa: "الشاعر", en: "The Poet" },
      note: null, spouse: null
    },
    {
      gen: 28, era: "medieval", notable: true,
      name: { fa: "ابوالحسن محمد الشاعر", en: "Abul-Hassan Mohammad al-Sha'er" },
      title: { fa: "الشاعر", en: "The Poet" },
      note: null, spouse: null
    },
    {
      gen: 29, era: "medieval", notable: true,
      name: { fa: "ابوعبدالله احمد الشاعر", en: "Abu-Abdullah Ahmad al-Sha'er" },
      title: { fa: "الشاعر", en: "The Poet" },
      note: null, spouse: null
    },
    {
      gen: 30, era: "early_islamic", notable: false,
      name: { fa: "ابوجعفر محمد الاصغر", en: "Abu-Ja'far Mohammad al-Asghar" },
      title: { fa: "", en: "" },
      note: null, spouse: null
    },
    {
      gen: 31, era: "early_islamic", notable: false,
      name: { fa: "ابوعبدالله احمد", en: "Abu-Abdullah Ahmad" },
      title: { fa: "", en: "" },
      note: null, spouse: null
    },
    {
      gen: 32, era: "early_islamic", notable: true,
      name: { fa: "ابراهیم الطباطبا", en: "Ebrahim al-Tabataba" },
      title: { fa: "نیای بزرگ سادات طباطبایی", en: "Patriarch of the Tabatabaei Sayyids" },
      note: null, spouse: null
    },
    {
      gen: 33, era: "early_islamic", notable: true,
      name: { fa: "اسماعیل الدیباج", en: "Esmaeil al-Dibaj" },
      title: { fa: "", en: "" },
      note: null, spouse: null
    },
    {
      gen: 34, era: "early_islamic", notable: false,
      name: { fa: "ابراهیم الغمر", en: "Ebrahim al-Ghamr" },
      title: { fa: "", en: "" },
      note: null, spouse: null
    },
    {
      gen: 35, era: "early_islamic", notable: true,
      name: { fa: "حسن المثنی", en: "Hassan al-Muthanna" },
      title: { fa: "", en: "" },
      note: null, spouse: null
    },
    {
      gen: 36, era: "early_islamic", notable: true,
      name: { fa: "امام حسن مجتبی (علیه‌السلام)", en: "Imam Hassan al-Mujtaba (AS)" },
      title: { fa: "سبط اکبر پیامبر (ص)", en: "Second Shia Imam" },
      note: null, spouse: null
    },
    {
      gen: 37, era: "early_islamic", notable: true,
      name: { fa: "امیرالمؤمنین علی بن ابی‌طالب (علیه‌السلام)", en: "Imam Ali ibn Abi Talib (AS)" },
      title: { fa: "امیرالمؤمنین", en: "First Shia Imam" },
      note: null, spouse: null
    }
  ];

  const eras = {
    qajar_modern: { fa: "دوره قاجار و معاصر", en: "Qajar & Modern Era" },
    safavid_zand: { fa: "دوره صفویه، افشاریه و زندیه", en: "Safavid, Afsharid & Zand Eras" },
    medieval: { fa: "سده‌های میانی و شاعران آل طباطبا", en: "Medieval Era & Al-Tabataba Poets" },
    early_islamic: { fa: "صدر اسلام و خاندان عصمت و طهارت", en: "Early Islamic Era & Ahl al-Bayt" }
  };

  let lang = "fa";
  let onlyNotable = false;

  const searchInput = document.getElementById("searchInput");
  const filterBtn = document.getElementById("filterNotableBtn");
  const langBtn = document.getElementById("langToggleBtn");

  function render() {
    const query = searchInput.value.trim().toLowerCase();
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "fa" ? "rtl" : "ltr";

    document.getElementById("backLink").textContent =
      lang === "fa" ? "← بازگشت به صفحه اصلی" : "← Back to Home";
    document.getElementById("headerBadge").textContent =
      lang === "fa"
        ? "🏛 نسل ۶ام امیرکبیر • 🕋 نسل ۳۵ام امام حسن (ع)"
        : "🏛 6th Gen of Amir Kabir • 🕋 35th Gen of Imam Hasan (AS)";
    document.getElementById("pageTitle").textContent =
      lang === "fa" ? "شجره‌نامه و تبارنامه" : "Genealogy & Ancestral Lineage";
    document.getElementById("pageSubtitle").textContent =
      lang === "fa"
        ? "۳۷ نسل پیوسته از سادات طباطبایی تبریز و خاندان امیرکبیری تا امیرالمؤمنین (ع)"
        : "37 Continuous Generations of the Tabatabaei Sayyids of Tabriz & Amirkabiri Family";
    searchInput.placeholder =
      lang === "fa" ? "جستجوی نام، لقب یا خاندان..." : "Search name, title, or family...";
    filterBtn.textContent =
      lang === "fa" ? "شخصیت‌های دارای عنوان و پیوند تاریخی" : "Notable Figures & Alliances";
    document.getElementById("langLabel").textContent =
      lang === "fa" ? "EN" : "FA";

    container.innerHTML = "";
    let currentEra = "";
    let timelineDiv = null;
    let count = 0;

    lineageData.forEach((person) => {
      if (onlyNotable && !person.notable) return;

      const searchable = [
        person.name.fa, person.name.en,
        person.title.fa, person.title.en,
        person.note ? person.note.fa : "",
        person.note ? person.note.en : "",
        person.spouse ? person.spouse.fa : "",
        person.spouse ? person.spouse.en : ""
      ].join(" ").toLowerCase();

      if (query && !searchable.includes(query)) return;
      count++;

      if (person.era !== currentEra) {
        currentEra = person.era;
        const eraEl = document.createElement("div");
        eraEl.className = "era-header";
        eraEl.textContent = eras[currentEra][lang];
        container.appendChild(eraEl);

        timelineDiv = document.createElement("div");
        timelineDiv.className = "timeline";
        container.appendChild(timelineDiv);
      }

      const card = document.createElement("div");
      card.className = `node ${person.notable ? "notable" : ""}`;

      const genLabel = lang === "fa" ? `نسل ${person.gen}` : `Gen ${person.gen}`;
      const spouseLabel = lang === "fa" ? "همسر / پیوند نسبی:" : "Spouse / Lineage Link:";

      card.innerHTML = `
        <div class="node-top">
          <span class="name">${person.name[lang]}</span>
          <span class="gen-badge">${genLabel}</span>
        </div>
        ${person.title[lang] ? `<div class="title-tag">${person.title[lang]}</div>` : ""}
        ${person.note && person.note[lang] ? `<div class="note-text">${person.note[lang]}</div>` : ""}
        ${person.spouse ? `<div class="spouse"><strong>${spouseLabel}</strong> ${person.spouse[lang]}</div>` : ""}
      `;

      timelineDiv.appendChild(card);
    });

    if (count === 0) {
      const emptyEl = document.createElement("div");
      emptyEl.className = "empty-state";
      emptyEl.textContent = lang === "fa"
        ? "موردی مطابق با جستجوی شما یافت نشد."
        : "No matching ancestors found.";
      container.appendChild(emptyEl);
    }

    initLiquidGlass(container);
  }

  searchInput.addEventListener("input", render);
  filterBtn.addEventListener("click", () => {
    onlyNotable = !onlyNotable;
    filterBtn.classList.toggle("active", onlyNotable);
    render();
  });
  langBtn.addEventListener("click", () => {
    lang = lang === "fa" ? "en" : "fa";
    render();
  });

  render();
}

/* اجرای خودکار پس از بارگذاری صفحه */
document.addEventListener("DOMContentLoaded", () => {
  initLiquidGlass(document);
  initLineagePage();
});
