"use strict";

/* =====================================
   1. بيانات الفرح - عدّلها هنا
===================================== */

const WEDDING = {
    groom: "إسلام",
    bride: "دينا",

    // التاريخ: السنة-الشهر-اليوم T الساعة:الدقيقة
    date: "2026-12-25T20:00:00",

    dateText: "الجمعة، 25 ديسمبر 2026",
    timeText: "الثامنه مساءً",

    venue: "قاعة كرستال",
    address: "خلف بنك مصر، كفر الشيخ، مصر",

    // رابط موقع القاعة
    mapUrl: "https://www.google.com/maps/place/%D9%82%D8%A7%D8%B9%D8%A9+%D9%85%D8%A7%D8%B1%D8%A7%D8%AF%D9%88%D9%86%D8%A7+%D8%B3%D8%AA%D8%A7%D8%B1%E2%80%AD/@31.1283683,30.6421805,18.1z/data=!4m6!3m5!1s0x14f65b6b6f187219:0xefd121f418f0982f!8m2!3d31.1281676!4d30.6410813!16s%2Fg%2F11c43q5rrd?entry=ttu",

    mapSearch: "31.1281676,30.6410813",

    // رقم واتساب استقبال التهاني
    whatsappNumber: "201090972300",

    music: "assets/music.mp3"
};

/* =====================================
   2. عناصر الصفحة
===================================== */

const $ = id => document.getElementById(id);

const intro = $("introScreen");
const invitation = $("invitation");
const envelope = $("envelope");
const openButton = $("openInvitation");
const music = $("weddingMusic");
const musicButton = $("musicButton");
const musicStatus = $("musicStatus");

let opened = false;
let musicPlaying = false;
let countdownTimer = null;

/* =====================================
   3. تحديث بيانات العروسين
===================================== */

function updateWeddingDetails() {
    document.querySelectorAll("[data-groom]").forEach(element => {
        element.textContent = WEDDING.groom;
    });

    document.querySelectorAll("[data-bride]").forEach(element => {
        element.textContent = WEDDING.bride;
    });

    $("heroDateText").textContent = WEDDING.dateText;
    $("detailDate").textContent = WEDDING.dateText;
    $("detailTime").textContent = WEDDING.timeText;
    $("detailVenue").textContent = WEDDING.venue;
    $("detailAddress").textContent = WEDDING.address;

    $("mapVenueName").textContent = WEDDING.venue;
    $("mapVenueAddress").textContent = WEDDING.address;

    $("weddingMap").src =
        "https://maps.google.com/maps?q=" +
        encodeURIComponent(WEDDING.mapSearch) +
        "&z=17&output=embed";

    $("openMapDirections").href = WEDDING.mapUrl;

    document.title =
        `دعوة فرح ${WEDDING.groom} و${WEDDING.bride}`;
}

/* =====================================
   4. فتح الظرف وتشغيل الموسيقى
===================================== */

async function openInvitation() {
    if (opened) return;

    openButton.disabled = true;
    openButton.textContent = "جاري فتح الدعوة...";

    try {
        await music.play();

        musicPlaying = true;
        updateMusicButton();

        if (musicStatus) {
            musicStatus.textContent = "الموسيقى تعمل ♡";
        }
    } catch (error) {
        console.warn("تعذر تشغيل الموسيقى:", error);

        musicPlaying = false;
        updateMusicButton();

        if (musicStatus) {
            musicStatus.textContent =
                "يمكنك متابعة فتح الدعوة بدون موسيقى.";
        }
    }

    opened = true;

    envelope.classList.add("opened");

    setTimeout(() => {
        invitation.classList.remove("hidden");
        intro.classList.add("leaving");

        document.body.style.overflow = "auto";

        setTimeout(() => {
            intro.style.display = "none";
        }, 850);

        updateCountdown();
        startCountdown();
        observeSections();

    }, 650);
}

openButton.addEventListener("click", openInvitation);

/* =====================================
   5. التحكم في الموسيقى
===================================== */

function updateMusicButton() {
    musicButton.textContent = musicPlaying ?
        "إيقاف الموسيقى ♫" :
        "تشغيل الموسيقى ♫";
}

musicButton.addEventListener("click", async() => {
    if (musicPlaying) {
        music.pause();
        musicPlaying = false;
        updateMusicButton();
        return;
    }

    try {
        await music.play();
        musicPlaying = true;
        updateMusicButton();

        if (musicStatus) {
            musicStatus.textContent = "الموسيقى تعمل ♡";
        }
    } catch (error) {
        musicPlaying = false;
        updateMusicButton();

        if (musicStatus) {
            musicStatus.textContent =
                "تعذر تشغيل الموسيقى. تأكد من ملف assets/music.mp3";
        }
    }
});

music.addEventListener("play", () => {
    musicPlaying = true;
    updateMusicButton();
});

music.addEventListener("pause", () => {
    musicPlaying = false;
    updateMusicButton();
});

music.addEventListener("error", () => {
    console.error("ملف الموسيقى غير موجود أو لا يمكن تشغيله.");
});

/* =====================================
   6. العد التنازلي
===================================== */

function updateCountdown() {
    const target = new Date(WEDDING.date).getTime();
    const now = Date.now();
    const difference = target - now;

    if (!Number.isFinite(target)) {
        $("countdownMessage").textContent =
            "يرجى التأكد من تاريخ الفرح.";
        return;
    }

    if (difference <= 0) {
        $("days").textContent = "00";
        $("hours").textContent = "00";
        $("minutes").textContent = "00";
        $("seconds").textContent = "00";

        $("countdownMessage").textContent =
            "أجمل يوم وصل، نتمنى لكم فرحة لا تُنسى ♡";

        if (countdownTimer) {
            clearInterval(countdownTimer);
            countdownTimer = null;
        }

        return;
    }

    const days = Math.floor(
        difference / (1000 * 60 * 60 * 24)
    );

    const hours = Math.floor(
        (difference / (1000 * 60 * 60)) % 24
    );

    const minutes = Math.floor(
        (difference / (1000 * 60)) % 60
    );

    const seconds = Math.floor(
        (difference / 1000) % 60
    );

    $("days").textContent = String(days).padStart(2, "0");
    $("hours").textContent = String(hours).padStart(2, "0");
    $("minutes").textContent = String(minutes).padStart(2, "0");
    $("seconds").textContent = String(seconds).padStart(2, "0");

    $("countdownMessage").textContent =
        "الفرحة قربت، مستنيينكم تشاركونا أجمل يوم ♡";
}

function startCountdown() {
    if (countdownTimer) {
        clearInterval(countdownTimer);
    }

    updateCountdown();
    countdownTimer = setInterval(updateCountdown, 1000);
}

/* =====================================
   7. ظهور الأقسام عند التمرير
===================================== */

let sectionObserver;

function observeSections() {
    const sections = document.querySelectorAll(".reveal");

    if (!("IntersectionObserver" in window)) {
        sections.forEach(section => {
            section.classList.add("visible");
        });

        return;
    }

    if (sectionObserver) {
        sectionObserver.disconnect();
    }

    sectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                sectionObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12
    });

    sections.forEach(section => {
        sectionObserver.observe(section);
    });
}

/* =====================================
   8. معرض الصور وتكبيرها
===================================== */

const lightbox = $("lightbox");
const lightboxImage = $("lightboxImage");
const lightboxClose = $("lightboxClose");

function closeLightbox() {
    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "auto";
}

document.querySelectorAll(".gallery-item").forEach(button => {
    button.addEventListener("click", () => {
        const image = button.querySelector("img");

        if (!image || !image.src) return;

        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt;

        lightbox.classList.add("active");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    });
});

lightboxClose.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", event => {
    if (event.target === lightbox) {
        closeLightbox();
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeLightbox();
    }
});

/* =====================================
   9. إضافة الفرح إلى التقويم
===================================== */

function calendarDate(date) {
    return date.toISOString()
        .replace(/[-:]/g, "")
        .replace(/\.\d{3}/, "");
}

function escapeCalendarText(value) {
    return String(value)
        .replace(/\\/g, "\\\\")
        .replace(/\n/g, "\\n")
        .replace(/,/g, "\\,")
        .replace(/;/g, "\\;");
}

$("calendarButton").addEventListener("click", () => {
            const start = new Date(WEDDING.date);

            if (Number.isNaN(start.getTime())) {
                alert("تأكد من كتابة تاريخ الفرح بطريقة صحيحة.");
                return;
            }

            const end = new Date(
                start.getTime() + 3 * 60 * 60 * 1000
            );

            const content = [
                    "BEGIN:VCALENDAR",
                    "VERSION:2.0",
                    "PRODID:-//Wedding Invitation//AR",
                    "CALSCALE:GREGORIAN",
                    "BEGIN:VEVENT",
                    `UID:wedding-${start.getTime()}@invitation.local`,
                    `DTSTAMP:${calendarDate(new Date())}`,
                    `DTSTART:${calendarDate(start)}`,
                    `DTEND:${calendarDate(end)}`,
                    `SUMMARY:${escapeCalendarText(
            `فرح ${WEDDING.groom} و${WEDDING.bride}`
        )}`,
        `LOCATION:${escapeCalendarText(
            WEDDING.venue + " - " + WEDDING.address
        )}`,
        "END:VEVENT",
        "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob(
        [content],
        { type: "text/calendar;charset=utf-8" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "wedding-invitation.ics";

    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
});

/* =====================================
   10. مشاركة الدعوة ونسخ الرابط
===================================== */

async function copyInvitationLink() {
    const link = window.location.href;

    try {
        await navigator.clipboard.writeText(link);
    } catch (error) {
        const input = document.createElement("textarea");

        input.value = link;
        input.style.position = "fixed";
        input.style.opacity = "0";

        document.body.appendChild(input);
        input.select();

        const copied = document.execCommand("copy");
        input.remove();

        if (!copied) {
            alert("انسخ رابط الدعوة من شريط العنوان.");
            return;
        }
    }

    const oldText = $("copyButton").textContent;
    $("copyButton").textContent = "تم نسخ الرابط ✓";

    setTimeout(() => {
        $("copyButton").textContent = oldText;
    }, 2000);
}

$("copyButton").addEventListener("click", copyInvitationLink);

$("shareButton").addEventListener("click", async () => {
    const data = {
        title: document.title,
        text: `يسعدنا دعوتكم لحضور فرح ${WEDDING.groom} و${WEDDING.bride}`,
        url: window.location.href
    };

    if (navigator.share) {
        try {
            await navigator.share(data);
        } catch (error) {
            if (error.name !== "AbortError") {
                console.error("تعذرت مشاركة الدعوة:", error);
            }
        }
    } else {
        await copyInvitationLink();
        alert("تم نسخ رابط الدعوة. يمكنك إرساله لأصدقائك.");
    }
});

/* =====================================
   11. نموذج التهنئة عبر واتساب
===================================== */

$("wishesForm").addEventListener("submit", event => {
    event.preventDefault();

    const name = $("wishesName").value.trim();
    const message = $("wishesMessage").value.trim();

    if (!name || !message) {
        $("wishesStatus").textContent =
            "اكتب اسمك ورسالة التهنئة أولًا.";
        return;
    }

    const whatsappMessage =
        `تهنئة بمناسبة فرح ${WEDDING.groom} و${WEDDING.bride}\n\n` +
        `الاسم: ${name}\n\n` +
        `رسالة التهنئة:\n${message}`;

    const whatsappUrl =
        `https://wa.me/${WEDDING.whatsappNumber}?text=` +
        encodeURIComponent(whatsappMessage);

    $("wishesStatus").textContent =
        "جاري فتح واتساب لإرسال التهنئة ♡";

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
});

/* =====================================
   12. تجهيز الصفحة
===================================== */

document.addEventListener("DOMContentLoaded", () => {
    updateWeddingDetails();

    invitation.classList.add("hidden");
    document.body.style.overflow = "hidden";

    console.log("Wedding invitation loaded successfully.");
});
