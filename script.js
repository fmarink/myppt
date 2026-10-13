/* ==========================================================================
   Mi PPT · comportamiento
   ========================================================================== */

/* ---------- 1. Datos de contacto (REEMPLAZAR) ----------
   whatsapp: solo dígitos, con código de país y sin "+" (ej. 56912345678).
   email:    la casilla que recibirá los mensajes.
   mensaje:  texto con el que se abre el chat de WhatsApp. */
const CONTACTO = {
  whatsapp: "56900000000",
  email: "hola@ejemplo.com",
  mensaje: "Hola, quiero conversar sobre una presentación.",
};

(function wireContact() {
  const wa = `https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent(CONTACTO.mensaje)}`;
  const mail = `mailto:${CONTACTO.email}?subject=${encodeURIComponent("Quiero una presentación")}`;

  document.querySelectorAll("[data-wa]").forEach((a) => {
    a.href = wa;
    a.target = "_blank";
    a.rel = "noopener";
  });
  document.querySelectorAll("[data-mail]").forEach((a) => { a.href = mail; });

  const pretty = formatPhone(CONTACTO.whatsapp);
  document.querySelectorAll("[data-wa-label]").forEach((el) => { el.textContent = pretty; });
  document.querySelectorAll("[data-mail-label]").forEach((el) => { el.textContent = CONTACTO.email; });

  const y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());
})();

function formatPhone(digits) {
  // 56912345678 -> +56 9 1234 5678 ; otros largos se devuelven con "+" al frente.
  const d = String(digits).replace(/\D/g, "");
  if (d.length === 11 && d.startsWith("56")) {
    return `+56 ${d[2]} ${d.slice(3, 7)} ${d.slice(7)}`;
  }
  return `+${d}`;
}

/* ---------- 2. Antes / después: el divisor de la pantalla ---------- */
(function splitScreen() {
  const screen = document.getElementById("screen");
  const range = document.getElementById("split");
  if (!screen || !range) return;

  const apply = (v) => screen.style.setProperty("--split", `${v}%`);
  range.addEventListener("input", () => apply(range.value));

  // Entrada: la diapositiva buena "aparece" desde la derecha hasta la mitad.
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce) {
    let start = null;
    const from = 96, to = 42, dur = 1400;
    const ease = (t) => 1 - Math.pow(2, -10 * t); // salida exponencial
    const tick = (ts) => {
      if (start === null) start = ts;
      const t = Math.min(1, (ts - start) / dur);
      const v = from + (to - from) * ease(t);
      apply(v);
      range.value = v;
      if (t < 1 && !userTouched) requestAnimationFrame(tick);
    };
    let userTouched = false;
    range.addEventListener("pointerdown", () => { userTouched = true; }, { once: true });
    apply(from);
    range.value = from;
    requestAnimationFrame(tick);
  }
})();

/* ---------- 3. Puntero láser sobre la pantalla ---------- */
(function laserPointer() {
  const screen = document.getElementById("screen");
  const laser = document.getElementById("laser");
  if (!screen || !laser) return;
  if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  let x = 0, y = 0, tx = 0, ty = 0, raf = null;
  const loop = () => {
    // el punto sigue al cursor con una leve inercia, como una mano real
    x += (tx - x) * 0.35;
    y += (ty - y) * 0.35;
    laser.style.transform = `translate(${x}px, ${y}px)`;
    if (Math.abs(tx - x) > 0.2 || Math.abs(ty - y) > 0.2) raf = requestAnimationFrame(loop);
    else raf = null;
  };
  screen.addEventListener("pointermove", (e) => {
    const r = screen.getBoundingClientRect();
    tx = e.clientX - r.left;
    ty = e.clientY - r.top;
    if (raf === null) raf = requestAnimationFrame(loop);
  });
})();

/* ---------- 4. Títulos que enfocan al entrar en pantalla ---------- */
(function focusIn() {
  const els = document.querySelectorAll(".focus");
  if (!("IntersectionObserver" in window)) { els.forEach((el) => el.classList.add("in")); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.1 });
  els.forEach((el) => io.observe(el));
})();

/* ---------- 5. Valor: cantidad × complejidad ---------- */
(function valueMatrix() {
  const field = document.getElementById("field");
  const qty = document.getElementById("qty");
  const cpx = document.getElementById("cpx");
  const tier = document.getElementById("tier");
  if (!field || !qty || !cpx || !tier) return;

  const TIERS = [
    "Presentación directa: una idea clara, pocos datos y foco total en el cierre.",
    "Presentación estratégica: ordenamos el material y construimos el hilo conductor.",
    "Presentación de alto contenido: mucha información que hay que jerarquizar y simplificar sin perder rigor.",
    "Proyecto a medida: contenido técnico denso, varias sesiones de trabajo con tu equipo y valores adicionales.",
  ];

  const update = () => {
    const q = Number(qty.value), c = Number(cpx.value);
    field.style.setProperty("--x", `${q}%`);
    field.style.setProperty("--y", `${c}%`);
    const score = q * 0.45 + c * 0.55;
    let i = 0;
    if (score > 30) i = 1;
    if (score > 55) i = 2;
    if (score > 75) i = 3;
    if (tier.textContent !== TIERS[i]) tier.textContent = TIERS[i];
  };
  qty.addEventListener("input", update);
  cpx.addEventListener("input", update);
  update();
})();
