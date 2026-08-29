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
   มาสคอตจริง: ใช้รูป assets/mascot.png (ครอปจากสติกเกอร์ชีต) */
function mascotSVG(size = 72) {
  return `<img src="assets/mascot.png" width="${size}" height="${size}"
    style="border-radius:50%; object-fit:cover;" alt="มาสคอตเอเลี่ยน" />`;
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
