import { trpc } from '../lib/trpc';
import TaskItem from './TaskItem';

export default function TaskList() {
  const tasks = trpc.tasks.getAll.useQuery();

  if (tasks.isLoading) {
    return <p>Cargando tareas...</p>;
  }

  if (tasks.error) {
    return (
      <p className="error">
        {tasks.error.message}
      </p>
    );
  }

  const taskList = tasks.data?.data ?? [];

  return (
    <section>
      <div className="list-header">
        <h2>Mis tareas</h2>

        <button onClick={() => tasks.refetch()}>
          Actualizar
        </button>
      </div>

      {taskList.length === 0 ? (
        <p>No hay tareas todavía.</p>
      ) : (
        <div className="tasks">
          {taskList.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
            />
          ))}
        </div>
      )}
    </section>
  );
}