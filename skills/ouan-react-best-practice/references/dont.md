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

## ข้อห้ามด้านเครื่องมือ

- **ห้ามเริ่มโปรเจกต์ใหม่ด้วย Create React App** — เลิกพัฒนาแล้ว ใช้ Vite หรือ framework แทน
- **ห้าม merge โค้ดที่ ESLint boundaries rule ล้ม** — แก้ import ให้ถูก layer ก่อน
- **ห้ามปิด lint rule ด้วย `eslint-disable`** สำหรับกฎ import โดยไม่มีคอมเมนต์อธิบายเหตุผล
