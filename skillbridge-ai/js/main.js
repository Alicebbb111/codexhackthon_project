/* ============================================================
   main.js — ส่วนที่ใช้ร่วมกันทุกหน้า: ดาวพื้นหลัง, นับดาวกระพริบ,
   มาสคอตลอยมุมล่างขวา (แชท AI รอเชื่อมต่อ), เมนู active
   ============================================================ */

/* สร้างดาวพื้นหลัง */
(function makeStars() {
  const box = document.createElement("div");
  box.className = "stars";
  for (let i = 0; i < 70; i++) {
    const s = document.createElement("i");
    s.style.left = Math.random() * 100 + "%";
    s.style.top = Math.random() * 100 + "%";
    s.style.animationDelay = (Math.random() * 3).toFixed(2) + "s";
    s.style.transform = `scale(${(0.5 + Math.random()).toFixed(2)})`;
    box.appendChild(s);
  }
  document.body.prepend(box);
})();

/* SVG มาสคอตเอเลี่ยนเขียว (ใช้ชั่วคราว)
   TODO: เปลี่ยนเป็นไฟล์ภาพมาสคอตจริงตรงนี้ (เช่น <img src="assets/mascot.png">) */
function mascotSVG(size = 72) {
  return `
  <svg width="${size}" height="${size}" viewBox="0 0 120 120" aria-label="มาสคอตเอเลี่ยน">
    <!-- หนวด -->
    <line x1="45" y1="28" x2="36" y2="10" stroke="#4de8b0" stroke-width="4" stroke-linecap="round"/>
    <circle cx="34" cy="8" r="5" fill="#a6ff4d"/>
    <line x1="75" y1="28" x2="84" y2="10" stroke="#4de8b0" stroke-width="4" stroke-linecap="round"/>
    <circle cx="86" cy="8" r="5" fill="#a6ff4d"/>
    <!-- ตัว -->
    <ellipse cx="60" cy="72" rx="38" ry="40" fill="#5cc94f"/>
    <ellipse cx="60" cy="86" rx="24" ry="20" fill="#7dd96a"/>
    <!-- ตา -->
    <ellipse cx="46" cy="62" rx="11" ry="14" fill="#0b1026"/>
    <ellipse cx="74" cy="62" rx="11" ry="14" fill="#0b1026"/>
    <circle cx="49" cy="58" r="3.4" fill="#fff"/>
    <circle cx="77" cy="58" r="3.4" fill="#fff"/>
    <!-- ยิ้ม -->
    <path d="M52 88 Q60 96 68 88" stroke="#0b1026" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  </svg>`;
}

/* ปุ่มมาสคอตลอย + กล่องแชท (รอเชื่อม AI) */
(function mascotFab() {
  const fab = document.createElement("div");
  fab.className = "mascot-fab";
  fab.innerHTML = mascotSVG(46);
  fab.title = "คุยกับผู้ช่วย AI";

  const panel = document.createElement("div");
  panel.className = "mascot-chat";
  panel.innerHTML = `
    <div class="bubble">
      <span class="avatar">${mascotSVG(40)}</span>
      <div class="msg">สวัสดี! เราคือบริดจ์ 🛸 ผู้ช่วยนำทางด้านทักษะ
      มีอะไรให้ช่วยไหม?</div>
    </div>
    <input type="text" placeholder="พิมพ์ข้อความ…" aria-label="พิมพ์ข้อความถึง AI" />`;

  const input = panel.querySelector("input");
  input.addEventListener("keydown", async (e) => {
    if (e.key !== "Enter" || !input.value.trim()) return;
    const q = input.value.trim();
    const box = panel.querySelector(".msg");
    box.textContent = "…กำลังคิด";
    input.value = "";
    try {
      // จุดเชื่อม AI — ตอนนี้คืนข้อความ mock จาก api.js
      const reply = await window.SkillBridgeAPI.aiChat(q);
      box.textContent = reply;
    } catch {
      box.textContent = "อุ๊ปส์ สัญญาณขัดข้อง ลองใหม่อีกครั้งนะ 🛸";
    }
  });

  fab.addEventListener("click", () => {
    panel.classList.toggle("open");
    if (panel.classList.contains("open")) input.focus();
  });

  document.body.append(panel, fab);
})();

/* ไฮไลต์เมนูตามหน้าปัจจุบัน */
(function highlightNav() {
  const here = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".navbar nav a").forEach((a) => {
    if (a.getAttribute("href") === here) a.classList.add("active");
  });
})();
