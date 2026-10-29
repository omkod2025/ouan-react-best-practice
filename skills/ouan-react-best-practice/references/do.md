# สิ่งที่ต้องทำ (DO)

แนวปฏิบัติที่ต้องทำทุกครั้งเมื่อเขียนโค้ด React ในโปรเจกต์ ใช้คู่กับ [CODE_STRUCTURE.md](./code-structure.md) และ [DONT.md](./dont.md)

---

## โครงสร้างและการจัดวางไฟล์

- [ ] **เริ่มโปรเจกต์ใหม่ด้วยโครงสร้าง feature-based** ตาม [CODE_STRUCTURE.md](./code-structure.md)
- [ ] **ทุก feature ต้องมี `index.js`** export เฉพาะสิ่งที่ภายนอกใช้ (components, hooks, provider)
- [ ] **import feature ผ่าน index เสมอ** — `import { TodoList } from '@/features/todos'`
- [ ] **วางไฟล์ใกล้ที่ใช้ (colocation)** — ของที่ใช้ใน feature เดียวอยู่ใน feature นั้น ย้ายขึ้น shared folder เมื่อมีที่ที่ 2 ใช้จริงเท่านั้น
- [ ] **`pages/` มีแค่การประกอบ** feature + layout, 1 ไฟล์ต่อ route
- [ ] **เรียก library ภายนอกผ่าน `lib/`** (HTTP client, date, storage) เพื่อเปลี่ยน library ได้ในไฟล์เดียว
- [ ] **`utils/` เป็น pure function** และมี test ทุกตัว
- [ ] **วาง test ใน `__tests__/`** ในโฟลเดอร์เดียวกับไฟล์ที่ test
- [ ] **แยกโฟลเดอร์ต่อ component เมื่อมีมากกว่า 1 ไฟล์** (style, test, sub-component) พร้อม `index.js` re-export — ดู [โครงสร้างภายใน component](./code-structure.md#โครงสร้างภายใน-component)

  ```text
  Modal/
  ├── index.js          # export { default } from './Modal';
  ├── Modal.jsx
  ├── Modal.module.css
  └── __tests__/Modal.test.jsx
  ```

- [ ] **ใช้ path alias `@/`** แทน relative path ลึกๆ
- [ ] **ตั้งชื่อไฟล์ตาม Naming Convention** ใน [CODE_STRUCTURE.md](./code-structure.md#naming-convention)

---

## Component

- [ ] **แตก component ให้เล็ก** — แต่ละตัวทำหน้าที่เดียว อ่านจบในหน้าจอเดียว
- [ ] **ประกาศ component ที่ระดับบนสุดของไฟล์** แล้วส่ง state/handler ผ่าน props

  ```jsx
  function Child({ onClick }) {
    return <button onClick={onClick}>+</button>;
  }
  function Parent() {
    const [count, setCount] = useState(0);
    return <Child onClick={() => setCount((c) => c + 1)} />;
  }
  ```

- [ ] **ใช้ Fragment `<>...</>`** เมื่อต้องการแค่ห่อหลาย element (ใช้ `<Fragment key={id}>` ใน list)
- [ ] **ใช้ spread `{...props}`** เมื่อส่ง props จาก object ที่มีหลาย field ไปยัง custom component

---

## State และ Data Flow

- [ ] **ใช้ Context หรือ state library** (Zustand, Redux Toolkit) เมื่อต้องส่ง state ลึกเกิน 2 ชั้น
- [ ] **memoize ค่า `value` ของ Context Provider** เมื่อไม่ได้ใช้ React Compiler
- [ ] **ใช้ functional update** — `setCount((c) => c + 1)` เมื่อ state ใหม่ขึ้นกับค่าเดิม
- [ ] **ใช้ TanStack Query / SWR** สำหรับ data fetching ใน production โดย `services/` คืน promise และ hook ใน feature เป็นตัวเรียก

---

## Performance

- [ ] **ครอบการคำนวณหนักด้วย `useMemo`** และใส่ dependency array ให้ครบ

  ```jsx
  const sorted = useMemo(() => [...items].sort(compareFn), [items]);
  ```

- [ ] **ใช้ `useCallback` + `React.memo`** เฉพาะจุดที่ profile แล้วพบว่า re-render เป็นปัญหาจริง
- [ ] **lazy load route และ component หนัก** ด้วย `React.lazy` + `Suspense`

  ```jsx
  const Dashboard = lazy(() => import('./pages/Dashboard'));

  <Suspense fallback={<Spinner />}>
    <Dashboard />
  </Suspense>
  ```

---

## Logic และการนำกลับมาใช้

- [ ] **ย้าย pure function ออกนอก component** — function ที่ไม่ใช้ state/props ไม่ต้องสร้างใหม่ทุก render
- [ ] **หุ้ม stateful logic ที่ใช้ซ้ำเป็น custom hook** (`useFetch`, `useLocalStorage`)
- [ ] **ใช้ currying กับ handler ที่ต่างกันแค่ parameter**

  ```jsx
  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  <input onChange={handleChange('name')} />
  <input onChange={handleChange('email')} />
  ```

- [ ] **cleanup side effect ใน `useEffect`** (AbortController, clearInterval, unsubscribe)

---

## เครื่องมือ

- [ ] **ใช้ Vite หรือ framework** (Next.js, React Router) สำหรับโปรเจกต์ใหม่
- [ ] **บังคับกฎ import ด้วย ESLint** (`eslint-plugin-boundaries` หรือ `import/no-restricted-paths`) ให้ CI ล้มเมื่อ import ผิด layer
- [ ] **TypeScript:** มี `types.ts` ในแต่ละ feature และ export type ที่ภายนอกใช้ผ่าน `index.ts`
