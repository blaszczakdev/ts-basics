import { type Todo, updateById } from './types';

function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}

function parseNumber(v: unknown): number | null {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

const listEl = document.querySelector<HTMLUListElement>('#todo-list')!;
const inputEl = document.querySelector<HTMLInputElement>('#todo-input')!;
const addBtn = document.querySelector<HTMLButtonElement>('#add-btn')!;

function loadTodos(): Todo[] {
  try {
    const raw = localStorage.getItem('todos-ts');
    return raw ? (JSON.parse(raw) as Todo[]) : [];
  } catch {
    return [];
  }
}
function saveTodos(items: Todo[]) {
  localStorage.setItem('todos-ts', JSON.stringify(items));
}

let todos: Todo[] = loadTodos();

function renderTodos() {
  listEl.innerHTML = '';
  for (const t of todos) {
    const li = document.createElement('li');
    const chk = document.createElement('input');
    chk.type = 'checkbox';
    chk.checked = t.status === 'done';
    chk.addEventListener('change', () => {
      todos = updateById(todos, t.id, (it) => ({
        ...it,
        status: chk.checked ? 'done' : 'open',
      }));
      saveTodos(todos);
      renderTodos();
    });

    const text = document.createElement('span');
    text.textContent = ` ${t.title} `;
    if (t.status === 'done') text.style.textDecoration = 'line-through';

    const del = document.createElement('button');
    del.textContent = 'Delete';
    del.addEventListener('click', () => {
      todos = todos.filter((it) => it.id !== t.id);
      saveTodos(todos);
      renderTodos();
    });

    li.append(chk, text, del);
    listEl.append(li);
  }
}

addBtn.addEventListener('click', () => {
  const val = inputEl.value;
  if (!isNonEmptyString(val)) return;
  const item: Todo = {
    id: uid(),
    title: val.trim(),
    status: 'open',
    createdAt: Date.now(),
  };
  todos = [item, ...todos];
  saveTodos(todos);
  inputEl.value = '';
  renderTodos();
});

renderTodos();

const aEl = document.querySelector<HTMLInputElement>('#a')!;
const bEl = document.querySelector<HTMLInputElement>('#b')!;
const sumBtn = document.querySelector<HTMLButtonElement>('#sum-btn')!;
const sumOut = document.querySelector<HTMLSpanElement>('#sum-out')!;

sumBtn.addEventListener('click', () => {
  const a = parseNumber(aEl.value);
  const b = parseNumber(bEl.value);
  if (a === null || b === null) {
    sumOut.textContent = 'Enter numbers.';
    return;
  }
  sumOut.textContent = `Sum: ${a + b}`;
});

type PokemonResp = {
  name: string;
  height: number;
  weight: number;
};

async function getPokemon(name: string): Promise<PokemonResp> {
  const res = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`
  );
  if (!res.ok) throw new Error('Not found');
  const data = (await res.json()) as PokemonResp;
  return data;
}

const pokeInput = document.querySelector<HTMLInputElement>('#poke')!;
const pokeBtn = document.querySelector<HTMLButtonElement>('#poke-btn')!;
const pokeOut = document.querySelector<HTMLSpanElement>('#poke-out')!;

pokeBtn.addEventListener('click', async () => {
  const q = pokeInput.value.trim();
  if (!q) return;
  pokeOut.textContent = 'Loading...';
  try {
    const p = await getPokemon(q);
    pokeOut.textContent = `Name: ${p.name}, height: ${p.height}, weight: ${p.weight}`;
  } catch {
    pokeOut.textContent = 'Not found.';
  }
});
