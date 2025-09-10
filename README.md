# TypeScript Basics (vanilla + Vite)

A tiny **TypeScript (vanilla)** demo that shows practical TS fundamentals without any framework:

- Domain types (`Todo`), unions, and **type guards**
- Reusable **generic** `updateById<T>()`
- Persistence with **localStorage**
- **Typed fetch** to a public API (PokeAPI)
- Plain **DOM API** UI (no libraries)

Live demo:  
Repo: https://github.com/blaszczakdev/ts-basics

---

## Table of Contents

- [Preview](#preview)
- [Stack](#stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [What matters in TS here](#what-matters-in-ts-here)
- [Scripts](#scripts)
- [Deploy](#deploy)
- [Next steps](#next-steps)
- [License](#license)

---

## Preview

**1) TODO (types, unions, guards, generic)**  
Add, mark as done, delete; persisted in `localStorage`.

**2) Calculator (type guards / narrowing)**  
Parsing user input with number validation.

**3) Mini API (typed fetch)**  
Request to `https://pokeapi.co/` and display selected fields.

---

## Stack

- **TypeScript** (`strict: true`)
- **Vite** (template `vanilla-ts`)
- **DOM API** (no framework)

---

## Quick Start

```bash
npm install
npm run dev
# open the printed localhost URL
```

Type-check only:

```bash
npm run typecheck
```

Production build:

```bash
npm run build
npm run preview
```

---

## Project Structure

```
ts-basics/
├─ index.html
├─ src/
│  ├─ main.ts        # UI logic (Todo, calculator, PokeAPI)
│  └─ types.ts       # domain types + generic updateById<T>()
├─ tsconfig.json
└─ package.json
```

---

## What matters in TS here

- **Domain types**

  ```ts
  export type TodoStatus = 'open' | 'done';
  export interface Todo {
    id: string;
    title: string;
    status: TodoStatus;
    createdAt: number;
  }
  ```

- **Type guards / narrowing**

  ```ts
  function isNonEmptyString(v: unknown): v is string {
    return typeof v === 'string' && v.trim().length > 0;
  }
  function parseNumber(v: unknown): number | null {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  ```

- **Generic update helper by `id`**

  ```ts
  export function updateById<T extends { id: string }>(
    items: T[],
    id: string,
    updater: (item: T) => T
  ): T[] {
    return items.map((it) => (it.id === id ? updater(it) : it));
  }
  ```

- **Typed fetch (PokeAPI)**
  ```ts
  type PokemonResp = { name: string; height: number; weight: number };
  const data = (await res.json()) as PokemonResp;
  ```

---

## Scripts

- `npm run dev` – dev server
- `npm run build` – production build
- `npm run preview` – preview the build
- `npm run typecheck` – type-check without emitting files

---

## Deploy

### Vercel

1. Import the repo → Framework: **Vite** (auto)
2. Build: `npm run build`, Output: `dist/`
3. Deploy → paste the **Live demo** link at the top of this README

### Netlify (alternative)

- Build command: `npm run build`
- Publish directory: `dist`

---

## Next steps

- Add tests (Vitest + @testing-library/dom) for helpers (`parseNumber`, `updateById`)
- Small **debounce** for text inputs
- Extract API types to `src/api/types.ts`
- Simple **CI** (GitHub Actions): `npm ci` + `npm run typecheck` + `npm run build`

---

## License

MIT
