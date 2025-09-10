export type ID = string;

export type TodoStatus = 'open' | 'done';

export interface Todo {
  id: ID;
  title: string;
  status: TodoStatus;
  createdAt: number;
}

export function updateById<T extends { id: ID }>(
  items: T[],
  id: ID,
  updater: (item: T) => T
): T[] {
  return items.map((it) => (it.id === id ? updater(it) : it));
}
