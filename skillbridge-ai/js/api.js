/* ============================================================
   api.js — จุดเชื่อมต่อสำหรับอนาคต (ยังไม่ทำงานจริง)
   ตอนนี้ทุกฟังก์ชันคืนค่า mock ไปก่อน
   ------------------------------------------------------------
   TODO (MySQL): รัน backend (Node.js + Express + mysql2)
   แล้วตั้งค่า API_BASE ให้ตรง เช่น "http://localhost:3000/api"
   TODO (AI): ชี้ AI_BASE ไปที่ server ที่รันโมเดล AI ที่เทรนไว้
   ============================================================ */

const API_BASE = null; // TODO: เปลี่ยนเป็น URL ของ backend MySQL เช่น "http://localhost:3000/api"
const AI_BASE = null;  // TODO: เปลี่ยนเป็น URL ของ AI service เช่น "http://localhost:8000"

/** helper: เรียก API จริงถ้าตั้งค่าแล้ว ถ้ายังคืน mock ตามที่ส่งมา */
async function callApi(path, mockValue, options = {}) {
  if (!API_BASE) return mockValue; // ยังไม่ต่อ DB — ใช้ mock
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error("เรียก API ไม่สำเร็จ: " + path);
  return res.json();
}

/** ดึงโปรไฟล์ผู้ใช้ / ผลสกิล จากฐานข้อมูล MySQL (ตาราง users, skill_scores) */
function getUserProfile(userId = 1) {
  return callApi(`/users/${userId}`, window.MOCK_DATA.userProfile);
}

/** บันทึกคะแนนแบบทดสอบลง MySQL (ตาราง assessments) */
function saveAssessment(answers) {
  return callApi(`/assessments`, { ok: true, mock: true }, {
    method: "POST",
    body: JSON.stringify(answers),
  });
}

/** เรียกโมเดล AI ที่เทรนไว้ให้ประเมินสกิล + แนะนำอาชีพ */
async function aiPredict(profile) {
  if (!AI_BASE) {
    // ยังไม่ต่อ AI — คืนผล mock
    return window.MOCK_DATA.aiResult;
  }
  const res = await fetch(`${AI_BASE}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  });
  if (!res.ok) throw new Error("เรียก AI ไม่สำเร็จ");
  return res.json();
}

/** เรียก AI ตอบคำถามในแชทมาสคอต */
async function aiChat(message) {
  if (!AI_BASE) return "ตอนนี้ยังไม่ได้เชื่อมสมอง AI นะ แต่เดี๋ยวเพื่อนๆ จะต่อให้เร็ว ๆ นี้! 🛸";
  const res = await fetch(`${AI_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  if (!res.ok) throw new Error("เรียก AI chat ไม่สำเร็จ");
  const data = await res.json();
  return data.reply;
}

window.SkillBridgeAPI = { getUserProfile, saveAssessment, aiPredict, aiChat };
