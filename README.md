# ouan-react-best-practice

Agent skill มาตรฐาน React ของทีม รวมสองส่วนไว้ด้วยกัน

- **โครงสร้างโค้ดและกฎของทีม**: folder structure แบบ feature-based, ทิศทางการ import, รายการ DO และรายการ DON'T ที่มีรหัสอ้างอิง (`S1`–`S11` ด้านโครงสร้าง, `R1`–`R14` ด้าน React)
- **Vercel React Best Practices**: 70 rules ใน 8 หมวด เรียงตามผลกระทบ (waterfalls, bundle size, server, client fetching, re-render, rendering, JS, advanced)

skill จะทำงานอัตโนมัติเมื่อสั่งเขียน, รีวิว, refactor หรือ scaffold โค้ด React / Next.js / Vite

---

## ติดตั้ง

### วิธีที่ 1: skills CLI (Claude Code, Cursor, Codex, Gemini CLI ฯลฯ)

```bash
# ติดตั้งในโปรเจกต์ปัจจุบัน
npx skills add omkod2025/ouan-react-best-practice

# ติดตั้งแบบ global (ใช้ได้ทุกโปรเจกต์)
npx skills add omkod2025/ouan-react-best-practice -g
```

CLI จะถามว่าจะติดตั้งให้ agent ตัวไหน แล้ววางไฟล์ไว้ในโฟลเดอร์ที่ agent นั้นอ่าน

### วิธีที่ 2: Claude Code (copy เอง)

```bash
git clone https://github.com/omkod2025/ouan-react-best-practice.git /tmp/ouan-rbp

# ใช้ได้ทุกโปรเจกต์ (personal)
mkdir -p ~/.claude/skills
cp -r /tmp/ouan-rbp/skills/ouan-react-best-practice ~/.claude/skills/

# หรือใช้เฉพาะโปรเจกต์นี้ (commit เข้า repo ให้ทั้งทีมใช้)
mkdir -p .claude/skills
cp -r /tmp/ouan-rbp/skills/ouan-react-best-practice .claude/skills/
```

ตรวจว่าติดตั้งแล้ว: เปิด Claude Code แล้วพิมพ์ `/skills` ต้องเห็น `ouan-react-best-practice` ในรายการ

อัปเดต: `git -C /tmp/ouan-rbp pull` แล้ว copy ทับอีกครั้ง

### วิธีที่ 3: claude.ai / Claude Desktop

1. ดาวน์โหลด [`dist/ouan-react-best-practice.skill`](dist/ouan-react-best-practice.skill)
2. อัปโหลดไฟล์ในหน้าตั้งค่า Skills ของ claude.ai แล้วเปิดใช้งาน

---

## วิธีใช้

ไม่ต้องเรียกชื่อ skill พิมพ์งานตามปกติได้เลย เช่น

```text
สร้าง feature cart ใหม่ มีหน้ารายการสินค้าในตะกร้าและปุ่ม checkout
รีวิว src/features/todos ตามมาตรฐานทีม
refactor หน้า Dashboard นี้ให้โหลดเร็วขึ้น
```

ถ้าต้องการบังคับให้ใช้ ให้เรียกชื่อตรงๆ ใน Claude Code ได้ที่ `/ouan-react-best-practice`

ผลรีวิวจะแบ่งเป็น Critical / Should fix / Nice to have และอ้างรหัส rule ทุกข้อ เช่น

```markdown
### Critical
- `src/pages/Home.jsx:12` — fetch + state ใน page (**S4**). ย้ายไป `features/todos/hooks/useTodos.js`
- `src/features/todos/services/getTodos.js:3-8` — await ต่อกัน 2 ครั้ง (**async-parallel**). ใช้ `Promise.all`
```

---

## โครงสร้าง repo

```text
.
├── README.md
├── dist/
│   └── ouan-react-best-practice.skill     # ไฟล์สำหรับอัปโหลดเข้า claude.ai
└── skills/
    └── ouan-react-best-practice/
        ├── SKILL.md                       # คำสั่งหลัก, สรุป rule, ตารางจับคู่และ conflict
        ├── NOTICE.md                      # แหล่งที่มาและ license
        ├── references/
        │   ├── code-structure.md          # folder tree, import rules, naming
        │   ├── do.md                      # สิ่งที่ต้องทำ
        │   ├── dont.md                    # กฎข้อห้าม S1–S11, R1–R14
        │   └── vercel-AGENTS.md           # Vercel guide ฉบับรวม
        └── rules/                         # Vercel rule แยกไฟล์ละข้อ (70 ข้อ)
```

## แก้ไขและ build ใหม่

1. แก้ไฟล์ใน `skills/ouan-react-best-practice/`
2. ถ้ามีการเปลี่ยนรหัส rule ใน `references/dont.md` ให้อัปเดตตารางสรุปใน `SKILL.md` ให้ตรงกัน
3. build ไฟล์ `.skill` ใหม่ (เป็น zip ของโฟลเดอร์ skill):

   ```bash
   cd skills && zip -r ../dist/ouan-react-best-practice.skill ouan-react-best-practice -x '*.DS_Store'
   ```

## แหล่งที่มา

- [10 React Antipatterns to Avoid](https://www.youtube.com/watch?v=b0IZo2Aho9Y) — Fireship
- [Junior vs Senior React Folder Structure](https://www.youtube.com/watch?v=UUga4-z7b6s) — Web Dev Simplified ([code](https://github.com/WebDevSimplified/react-folder-structure))
- [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) — `react-best-practices` (MIT, Vercel Engineering)
