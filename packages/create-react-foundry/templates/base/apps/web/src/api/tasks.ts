export interface Task {
  id: number;
  label: string;
  done: boolean;
}

let tasks: Task[] = [
  { id: 1, label: "Wire up TanStack Query", done: true },
  { id: 2, label: "Add a task with the form below", done: false },
  { id: 3, label: "See it show up in the table", done: false },
];

// Stand-in for a real API call — swap this out once you have a backend.
export function fetchTasks(): Promise<Task[]> {
  return new Promise((resolve) => setTimeout(() => resolve(tasks), 300));
}

export function createTask(label: string): Promise<Task> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const task: Task = { id: tasks.length + 1, label, done: false };
      tasks = [...tasks, task];
      resolve(task);
    }, 300);
  });
}
