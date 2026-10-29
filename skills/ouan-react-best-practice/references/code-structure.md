# Code Structure

โปรเจกต์ React ใช้โครงสร้างแบบ **feature-based (Advanced)** แยกโค้ดตามโดเมน ให้แต่ละ feature เก็บ components, hooks, services และ context ไว้ด้วยกัน และให้ `pages/` ทำหน้าที่แค่ประกอบ feature เข้ากับ layout

> ที่มา: [Junior vs Senior React Folder Structure](https://www.youtube.com/watch?v=UUga4-z7b6s) — Web Dev Simplified · [GitHub repo](https://github.com/WebDevSimplified/react-folder-structure)

ดูเพิ่ม: [DO.md](./do.md) · [DONT.md](./dont.md)

---

## Folder Tree

```text
src/
├── assets/                 # global CSS, รูป, font ที่ใช้ทั้งแอป
├── components/             # shared UI ที่ไม่รู้จัก business logic
│   ├── form/               # Checkbox, FormInput, FormSelect, RadioButton
│   └── ui/                 # Button, ButtonGroup, Dropdown, Modal
├── context/                # global context (เช่น AnalyticsContext)
├── data/                   # constants.js, config JSON, default data
├── features/
│   ├── authentication/
│   │   ├── components/     # LoginForm, SignupForm
│   │   ├── hooks/          # useLogin, useSignup, useVerifyPassword
│   │   ├── services/       # login, signup, getUser
│   │   └── index.js        # public API ของ feature
│   ├── projects/           # components/, services/, index.js
│   ├── settings/           # components/, context/, hooks/, services/, index.js
│   └── todos/              # assets/, components/, context/, services/, index.js
├── hooks/                  # generic hooks + __tests__/
├── layouts/                # Navbar, Sidebar, PageContainer
├── lib/                    # facade ครอบ library ภายนอก (fetch.js)
├── pages/                  # 1 ไฟล์ต่อ route: Home, Login, Projects, Settings, Signup
├── services/               # service ระดับแอป (analytics.js)
├── utils/                  # pure functions + __tests__/
├── App.js
└── index.js
```

### โครงสร้างภายใน feature

ใส่เฉพาะโฟลเดอร์ที่ feature นั้นใช้จริง ไม่ต้องสร้างครบทุกโฟลเดอร์

```text
features/<feature-name>/
├── assets/          # รูป/ไฟล์ที่ใช้เฉพาะ feature นี้
├── components/      # UI ของ feature
├── context/         # context เฉพาะ feature
├── hooks/           # hooks เฉพาะ feature
├── services/        # เรียก API ของ feature (ผ่าน lib/)
├── utils/           # helper เฉพาะ feature
├── __tests__/
└── index.js         # export เฉพาะสิ่งที่ภายนอกใช้
```

### โครงสร้างภายใน component

component ที่มีแค่ไฟล์ JSX ไฟล์เดียว วางเป็นไฟล์เดี่ยวได้ (`Button.jsx`) ถ้า component มี style, test, sub-component หรือ hook ของตัวเอง ให้แยกเป็นโฟลเดอร์ แล้วใช้ `index.js` re-export เพื่อให้ path import เหมือนเดิม

```text
components/ui/
├── Button.jsx                 # ไฟล์เดียว → วางเดี่ยวได้
└── Modal/                     # มีหลายไฟล์ → แยกโฟลเดอร์
    ├── index.js               # export { default } from './Modal';
    ├── Modal.jsx
    ├── Modal.module.css
    ├── ModalHeader.jsx        # sub-component ที่ใช้เฉพาะ Modal
    └── __tests__/
        └── Modal.test.jsx
```

```js
// components/ui/Modal/index.js
export { default } from './Modal';
```

```js
// ใช้งาน — path เหมือนกันไม่ว่าจะเป็นไฟล์เดี่ยวหรือโฟลเดอร์
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
```

ใช้รูปแบบเดียวกันกับ component ภายใน feature (`features/todos/components/TodoList/`) ให้ตั้งชื่อไฟล์หลักตามชื่อ component (`Modal.jsx`) แทน `index.jsx` เพื่อให้แท็บใน editor และ stack trace อ่านออก

---

## หน้าที่ของแต่ละโฟลเดอร์

| โฟลเดอร์ | เก็บอะไร | หมายเหตุ |
| --- | --- | --- |
| `features/<name>/` | ทุกอย่างของโดเมนเดียว | ภายนอกเข้าผ่าน `index.js` เท่านั้น |
| `pages/` | 1 ไฟล์ต่อ route | ประกอบ feature + layout ไม่มี business logic |
| `layouts/` | โครงหน้า: Navbar, Sidebar, PageContainer | ใช้ซ้ำทุกหน้า |
| `components/` | UI ทั่วไป แบ่ง `ui/` กับ `form/` | ไม่รู้จัก feature ใด |
| `hooks/` | hook ทั่วไป (useFetch, useLocalStorage) | ใช้ได้ทุก feature |
| `lib/` | facade ครอบ library ภายนอก | จุดเดียวที่ import library ภายนอก |
| `services/` | การเชื่อมต่อระดับแอป (analytics, logging) | ของเฉพาะ feature อยู่ใน feature |
| `utils/` | pure functions (format, คำนวณ) | ไม่มี side effect |
| `data/` | ค่าคงที่, JSON config | ไม่มี logic |
| `context/` | context ที่ใช้ทั้งแอป | context เฉพาะ feature อยู่ใน feature |
| `assets/` | CSS global, รูป, font | asset เฉพาะ feature อยู่ใน feature |

---

## ทิศทางการ import

import ไหลทางเดียวจากบนลงล่าง ห้ามย้อนกลับ

```text
pages/  ──►  layouts/
   │            │
   ▼            ▼
features/<a>/index.js   (feature อื่นเข้าได้ผ่าน index เท่านั้น)
   │
   ▼
shared:  components/ · hooks/ · context/ · services/
   │
   ▼
lib/ · utils/ · data/
   │
   ▼
external libraries (เข้าผ่าน lib/ เท่านั้น)
```

| Layer | import ได้จาก | ห้าม import จาก |
| --- | --- | --- |
| `pages/` | `features/*` (ผ่าน index), `layouts/`, shared | ไฟล์ภายใน feature |
| `features/<a>/` | shared, `features/<b>` ผ่าน index | `pages/`, ไฟล์ภายในของ feature อื่น |
| `layouts/` | shared, `features/*` (ผ่าน index) | `pages/` |
| `components/`, `hooks/` | `lib/`, `utils/`, `data/` | `features/`, `pages/` |
| `lib/` | library ภายนอก | โค้ดภายในแอป |
| `utils/` | `data/` | ทุกอย่างที่มี side effect |

---

## ตัวอย่าง

### Feature public API

```js
// features/todos/index.js
export { default as TodoList } from './components/TodoList';
export { default as NewTodoModal } from './components/NewTodoModal';
export { TodoProvider, useTodos } from './context/TodoContext';
// ไม่ export services — ภายนอกไม่ต้องรู้ว่าดึงข้อมูลยังไง
```

### Page เป็นแค่ตัวประกอบ

```jsx
// pages/Home.js
import { PageContainer } from '@/layouts/PageContainer';
import { TodoList, NewTodoModal, TodoProvider } from '@/features/todos';

export default function Home() {
  return (
    <TodoProvider>
      <PageContainer title="Todos">
        <NewTodoModal />
        <TodoList />
      </PageContainer>
    </TodoProvider>
  );
}
```

### lib/ เป็น facade

```js
// lib/fetch.js
const BASE_URL = import.meta.env.VITE_API_URL;

export async function apiFetch(path, { method = 'GET', body, ...opts } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
    ...opts,
  });
  if (!res.ok) throw new Error(`${method} ${path} failed: ${res.status}`);
  return res.json();
}
```

```js
// features/todos/services/getTodos.js
import { apiFetch } from '@/lib/fetch';
export const getTodos = () => apiFetch('/todos');
```

### Path alias

```js
// vite.config.js
import path from 'node:path';
export default {
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
};
```

```json
// jsconfig.json / tsconfig.json
{ "compilerOptions": { "baseUrl": ".", "paths": { "@/*": ["src/*"] } } }
```

---

## Naming Convention

| ชนิด | รูปแบบ | ตัวอย่าง |
| --- | --- | --- |
| Component | PascalCase | `TodoList.jsx` หรือ `TodoList/TodoList.jsx` |
| Component style | ชื่อ component + `.module.css` | `TodoList.module.css` |
| Hook | camelCase ขึ้นต้น `use` | `useLogin.js` |
| Service | camelCase เป็น verb | `getTodos.js`, `createProject.js` |
| Util | camelCase | `formatCurrency.js` |
| Context | PascalCase ลงท้าย `Context` | `TodoContext.js` |
| Feature folder | kebab-case หรือ lowercase | `authentication/`, `user-profile/` |
| Test | ชื่อไฟล์ + `.test` ใน `__tests__/` | `__tests__/formatDate.test.js` |
