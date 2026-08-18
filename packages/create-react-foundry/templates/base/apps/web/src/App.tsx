import { useMemo } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import { Button, Input } from "{{packageScope}}/react";
import { createTask, fetchTasks, type Task } from "./api/tasks.js";
import styles from "./App.module.css";

const taskColumns: ColumnDef<Task>[] = [
  { accessorKey: "label", header: "Task" },
  {
    accessorKey: "done",
    header: "Status",
    cell: (info) => (info.getValue() ? "Done" : "Pending"),
  },
];

export function App() {
  const queryClient = useQueryClient();
  const tasksQuery = useQuery({ queryKey: ["tasks"], queryFn: fetchTasks });

  const addTask = useMutation({
    mutationFn: createTask,
    onSuccess: (task) => {
      queryClient.setQueryData<Task[]>(["tasks"], (previous = []) => [...previous, task]);
    },
  });

  const form = useForm({
    defaultValues: { label: "" },
    onSubmit: async ({ value, formApi }) => {
      await addTask.mutateAsync(value.label);
      formApi.reset();
    },
  });

  const table = useReactTable({
    data: tasksQuery.data ?? [],
    columns: useMemo(() => taskColumns, []),
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <p className={styles.eyebrow}>Scaffolded with Foundry</p>
        <h1 className={styles.title}>Welcome to {{projectName}}</h1>
        <p className={styles.lede}>
          This app is wired up to <code>{{packageScope}}/react</code>, your generated component library. Edit{" "}
          <code>src/App.tsx</code> to get started.
        </p>

        <section className={styles.demo} aria-labelledby="demo-heading">
          <h2 id="demo-heading" className={styles.demoHeading}>
            Component library
          </h2>
          <div className={styles.demoRow}>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
          <div className={styles.demoRow}>
            <Input label="Your name" defaultValue="" placeholder="Ada Lovelace" />
          </div>
        </section>

        <section className={styles.demo} aria-labelledby="tanstack-heading">
          <h2 id="tanstack-heading" className={styles.demoHeading}>
            Optional: TanStack Query + Form + Table
          </h2>
          <p className={styles.tanstackLede}>
            Data-fetching scaffolding, not required to use the component library above.{" "}
            <code>src/api/tasks.ts</code> stands in for a real API; the form below adds a task
            through TanStack Query, and the table renders whatever the query currently holds. Not
            using it? Delete this section, <code>src/api/tasks.ts</code>, the{" "}
            <code>QueryClientProvider</code> in <code>src/main.tsx</code>, and the three{" "}
            <code>@tanstack/*</code> dependencies from <code>package.json</code>.
          </p>

          <form
            className={styles.taskForm}
            onSubmit={(event) => {
              event.preventDefault();
              event.stopPropagation();
              void form.handleSubmit();
            }}
          >
            <form.Field
              name="label"
              validators={{
                onChange: ({ value }) =>
                  value.trim().length === 0 ? "Task name is required" : undefined,
              }}
            >
              {(field) => (
                <Input
                  label="New task"
                  placeholder="Ship the release"
                  value={field.state.value}
                  onChange={field.handleChange}
                  error={field.state.meta.errors[0]}
                />
              )}
            </form.Field>
            <Button type="submit" variant="primary" disabled={addTask.isPending}>
              {addTask.isPending ? "Adding…" : "Add task"}
            </Button>
          </form>

          {tasksQuery.isLoading ? (
            <p className={styles.tanstackLede}>Loading tasks…</p>
          ) : (
            <table className={styles.table}>
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <p className={styles.footer}>
          Build and preview components in isolation with Storybook at{" "}
          <a href="http://localhost:6006">localhost:6006</a>.
        </p>
      </div>
    </main>
  );
}
