# กฎข้อห้าม (DON'T)

สิ่งที่ห้ามทำในโปรเจกต์ ทุกข้อควรถูกจับได้ใน code review หรือ lint ใช้คู่กับ [CODE_STRUCTURE.md](./code-structure.md) และ [DO.md](./do.md)

---

## ข้อห้ามด้านโครงสร้างและ import

| # | ห้าม | เหตุผล | ทำแทน |
| --- | --- | --- | --- |
| S1 | import ไฟล์ภายในของ feature ตรงๆ | ทำลาย public API ของ feature, refactor แล้วพังหลายที่ | import ผ่าน `@/features/<name>` |
| S2 | `components/`, `hooks/`, `utils/` import จาก `features/` หรือ `pages/` | shared code ต้องไม่รู้จัก business logic, เกิด circular dependency | ย้ายโค้ดนั้นเข้า feature |
| S3 | `features/` import จาก `pages/` | ทิศทาง dependency ย้อนกลับ | ส่งข้อมูลผ่าน props หรือ context |
| S4 | ใส่ business logic, fetch, state ซับซ้อนใน `pages/` | page ต้องเป็นแค่ตัวประกอบ | ย้ายเข้า feature แล้ว export ผ่าน index |
| S5 | import library ภายนอก (axios, dayjs, ฯลฯ) ตรงจาก component หรือ feature | เปลี่ยน library ต้องแก้ทั้งโปรเจกต์ | ครอบด้วย facade ใน `lib/` |
| S6 | ใส่ side effect (fetch, localStorage, DOM) ใน `utils/` | utils ต้องเป็น pure function ที่ test ง่าย | ใช้ `services/` หรือ custom hook |
| S7 | ย้ายไฟล์ขึ้น shared folder "เผื่อได้ใช้" | shared folder บวมด้วยโค้ดที่ใช้ที่เดียว | ย้ายเมื่อมีที่ที่ 2 ใช้จริง |
| S8 | export ทุกอย่างใน `index.js` ของ feature | barrel ใหญ่ทำให้ tree-shaking และ HMR ช้า, เปิดเผย internals | export เฉพาะที่ภายนอกใช้ |
| S9 | ใช้ relative path ลึกเกิน 2 ระดับ (`../../../`) | อ่านยาก แตกง่ายเมื่อย้ายไฟล์ | ใช้ alias `@/` |
| S10 | วาง style, test หรือ sub-component ของ component ไว้คนละที่กับตัว component | หาไฟล์ยาก ลบ component แล้วเหลือไฟล์ค้าง | แยกโฟลเดอร์ต่อ component + `index.js` |
| S11 | ตั้งชื่อไฟล์หลักของ component ว่า `index.jsx` | แท็บ editor และ stack trace เต็มไปด้วย `index` แยกไม่ออก | `Modal/Modal.jsx` + `Modal/index.js` re-export |

```js
// ❌ S1
import TodoList from '@/features/todos/components/TodoList';
// ✅
import { TodoList } from '@/features/todos';

// ❌ S5
import axios from 'axios';            // ใน features/todos/services/getTodos.js
// ✅
import { apiFetch } from '@/lib/fetch';
```

---

## ข้อห้ามด้าน React

| # | ห้าม | เหตุผล | ทำแทน |
| --- | --- | --- | --- |
| R1 | component เดียวยาวหลายร้อยบรรทัด | อ่านยาก test ยาก re-render ทั้งก้อน | แตกเป็น component ย่อย |
| R2 | ประกาศ component ซ้อนใน component | ถูกสร้างใหม่ทุก render → unmount/mount, state หาย, input หลุด focus | ประกาศระดับบนสุดของไฟล์แล้วส่ง props |
| R3 | คำนวณหนักใน body ของ component โดยไม่ memoize | รันซ้ำทุก render | `useMemo` พร้อม dependency ครบ |
| R4 | mutate state หรือ props ตรงๆ (`items.sort()`, `obj.x = 1`) | React ไม่เห็นการเปลี่ยนแปลง, bug ยากต่อการหา | สร้าง copy ใหม่ `[...items].sort()` |
| R5 | ห่อด้วย `<div>` เมื่อไม่มีหน้าที่ทาง layout/style | DOM ลึกเกินจำเป็น ทำ flex/grid/table พัง | Fragment `<>...</>` |
| R6 | import ทุก page แบบ static ใน bundle เดียว | first load ช้า | `React.lazy` + `Suspense` |
| R7 | ส่ง props ผ่านเกิน 2 ชั้นโดย component กลางไม่ได้ใช้ (prop drilling) | component กลางผูกกับข้อมูลที่ไม่เกี่ยว | Context หรือ state library |
| R8 | spread props ลง DOM element ตรงๆ (`<div {...props}>`) | attribute แปลกปลอมหลุดลง HTML | destructure เฉพาะที่ใช้ แล้ว spread ส่วนที่เหลืออย่างตั้งใจ |
| R9 | copy handler ที่ต่างกันแค่ชื่อ field | โค้ดซ้ำ | curried handler |
| R10 | ประกาศ pure function ไว้ใน component | สร้างใหม่ทุก render โดยไม่จำเป็น | ย้ายออกนอก component หรือไป `utils/` |
| R11 | copy stateful logic ไปหลาย component | แก้ bug ต้องแก้หลายที่ | custom hook |
| R12 | `useEffect` ที่ไม่ cleanup subscription/timer/request | memory leak, race condition | return cleanup function |
| R13 | ใส่ `useMemo`/`useCallback` ทุกจุดโดยไม่ได้วัดผล | เพิ่มความซับซ้อนโดยไม่ได้ประโยชน์ | profile ก่อน หรือใช้ React Compiler |
| R14 | ใช้ index ของ array เป็น `key` ใน list ที่เปลี่ยนลำดับได้ | state ของ item สลับกัน | ใช้ id ที่ไม่ซ้ำ |

```jsx
// ❌ R2
function Parent() {
  const [count, setCount] = useState(0);
  const Child = () => <button onClick={() => setCount(count + 1)}>+</button>;
  return <Child />;
}

// ❌ R4
const sorted = items.sort(compareFn);
// ✅
const sorted = useMemo(() => [...items].sort(compareFn), [items]);

// ❌ R8
function Button(props) {
  return <button {...props} />;          // ส่ง isLoading, variant ลง DOM
}
// ✅
function Button({ isLoading, variant, ...rest }) {
  return <button className={variant} disabled={isLoading} {...rest} />;
}
```

---

## ข้อห้ามด้าน Security

| # | ห้าม | เหตุผล | ทำแทน | ตรวจด้วย |
| --- | --- | --- | --- | --- |
| X1 | merge เมื่อ `npm audit` เจอ high/critical ใน production dependency | ช่องโหว่ที่รู้จักแล้วถูกนำไปโจมตีได้ทันที | `npm audit fix` หรืออัปเดต/เปลี่ยน package | CI: `npm audit --audit-level=high --omit=dev` |
| X2 | ใส่ secret ใน `VITE_*`, `NEXT_PUBLIC_*`, `REACT_APP_*` | ตัวแปรเหล่านี้ถูก bundle ลง JS ฝั่ง client ใครก็อ่านได้ | เก็บไว้ฝั่ง server แล้วเรียกผ่าน API ของเรา | CI: secret check ใน `assets/ci.yml` |
| X3 | `dangerouslySetInnerHTML` กับข้อมูลที่ไม่ได้ sanitize | XSS | DOMPurify + comment อธิบาย | ESLint: `react/no-danger` |
| X4 | ใส่ URL จาก user ลง `href`/`src` โดยไม่ตรวจ protocol | `javascript:` URL รันสคริปต์ได้ | `safeUrl()` ใน `utils/` | ESLint: `react/jsx-no-script-url` (เฉพาะ literal) + review |
| X5 | `target="_blank"` โดยไม่มี `rel="noreferrer"` | หน้าปลายทางเข้าถึง `window.opener` ได้ | เพิ่ม `rel="noreferrer"` | ESLint: `react/jsx-no-target-blank` |
| X6 | ไม่ commit lockfile หรือใช้ `npm install` ใน CI | ได้ dependency คนละเวอร์ชันกับที่ทดสอบ เปิดทางให้ supply-chain attack | commit lockfile + `npm ci` | review |
| X7 | `eval`, `new Function`, `setTimeout("string")` | รันโค้ดจาก string ได้ เสี่ยง injection | เขียนเป็น function ปกติ | ESLint: `no-eval`, `no-implied-eval`, `no-new-func` |
| X8 | เก็บ access token ระยะยาวไว้ใน `localStorage` | สคริปต์ใดๆ บนหน้า (รวม XSS) อ่านได้ | httpOnly cookie หรือเก็บ token อายุสั้นไว้ใน memory | review |

```jsx
// ❌ X2 — .env
VITE_STRIPE_SECRET_KEY=sk_live_...
// ✅
VITE_API_URL=https://api.example.com   # ค่าสาธารณะเท่านั้น

// ❌ X4
<a href={user.website}>Website</a>
// ✅
<a href={safeUrl(user.website)} target="_blank" rel="noreferrer">Website</a>
```

---

## ข้อห้ามด้านเครื่องมือ

- **ห้ามเริ่มโปรเจกต์ใหม่ด้วย Create React App** — เลิกพัฒนาแล้ว ใช้ Vite หรือ framework แทน
- **ห้ามติดตั้ง ESLint แบบไม่ระบุเวอร์ชัน** — ได้ ESLint 10 ซึ่ง `eslint-plugin-react` ยังไม่รองรับ ใช้ `eslint@9` และ `@eslint/js@9`
- **ห้าม merge โค้ดที่ `npm run lint` ล้ม** รวมถึง warning (CI ใช้ `--max-warnings=0`)
- **ห้ามปิด lint rule ด้วย `eslint-disable`** โดยไม่มีคอมเมนต์อธิบายเหตุผลหลัง `--`
- **ห้ามปิด `react-hooks/exhaustive-deps`** เพื่อเลี่ยง warning — แก้ dependency ให้ถูก หรือใช้ `useEffectEvent` / ref
