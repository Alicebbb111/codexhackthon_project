# SkillBridge AI 🛸

เว็บแอปช่วยเยาวชนค้นหาศักยภาพ → เรียนรู้ → พัฒนาทักษะ → เชื่อมกับงาน
(ธีมอวกาศ + มาสคอตเอเลี่ยนเขียว, สไตล์ UI อ้างอิง TryHackMe)

## วิธีรัน

เปิดไฟล์ได้เลยโดยไม่ต้องติดตั้งอะไร:

- ดับเบิลคลิก `index.html` หรือ
- รันเซิร์ฟเวอร์เล็กๆ (แนะนำ):

```bash
cd skillbridge-ai
npx serve .          # หรือ
python3 -m http.server 8080
```

แล้วเปิด http://localhost:8080

## โครงสร้างไฟล์

```
skillbridge-ai/
├── index.html        หน้าแรก (Landing)
├── assessment.html   แบบทดสอบ + แชทมาสคอต + quiz 5 ข้อ
├── passport.html     พาสปอร์ตทักษะ (สวยที่สุด)
├── dashboard.html    แดชบอร์ดภาพรวม
├── path.html         เส้นทางการเรียนแบบแผนที่ดาว
├── css/style.css     ธีมทั้งหมด
└── js/
    ├── mockData.js   ข้อมูลตัวอย่างทั้งหมด (แก้ที่เดียว)
    ├── api.js        ⚡ จุดเชื่อม MySQL API + AI model (ตั้งค่าที่นี่)
    └── main.js       ดาวพื้นหลัง, มาสคอต SVG, แชทลอย
```

## ขั้นถัดไป — เชื่อมต่อระบบจริง

1. **MySQL:** สร้าง backend (Node.js + Express + mysql2) แล้วแก้ `API_BASE`
   ใน `js/api.js` เป็น URL ของ backend เช่น `"http://localhost:3000/api"`
   — ทุกฟังก์ชัน (`getUserProfile`, `saveAssessment`) จะเรียก API จริงทันที
2. **AI model:** รันโมเดลที่เทรนไว้แล้วแก้ `AI_BASE` ใน `js/api.js`
   — endpoints ที่เว็บจะเรียก: `POST /predict` (ประเมินสกิล/แนะนำอาชีพ)
   และ `POST /chat` (แชทมาสคอต, ตอบกลับ `{ "reply": "..." }`)
3. **มาสคอตรูปจริง:** เปลี่ยนฟังก์ชัน `mascotSVG()` ใน `js/main.js`
   เป็น `<img src="assets/mascot.png">` (มี comment TODO ระบุไว้แล้ว)
