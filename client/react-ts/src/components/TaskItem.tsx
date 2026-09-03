import { trpc } from '../lib/trpc';
import { TaskPriority } from '../../../../server/src/core/domain/task.domain';

interface Task {
  _id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  priority: TaskPriority;
}

interface TaskItemProps {
  task: Task;
}

export default function TaskItem({ task }: TaskItemProps) {
  const utils = trpc.useUtils();

  const updateTask = trpc.tasks.update.useMutation({
    onSuccess: () => {
      utils.tasks.getAll.invalidate();
    },
  });

  const deleteTask = trpc.tasks.delete.useMutation({
    onSuccess: () => {
      utils.tasks.getAll.invalidate();
    },
  });

  const toggleCompleted = async () => {
    await updateTask.mutateAsync({
      id: task._id,
      data: {
        isCompleted: !task.isCompleted,
      },
    });
  };

  const handleDelete = async () => {
    await deleteTask.mutateAsync({
      id: task._id,
    });
  };

  return (
    <div className={`task ${task.isCompleted ? 'completed' : ''}`}>
      <div>
        <h3>{task.title}</h3>

        <p>{task.description}</p>

        <span>
          Prioridad: {task.priority}
        </span>
      </div>

      <div className="task-actions">
        <button onClick={toggleCompleted}>
          {task.isCompleted
            ? 'Marcar pendiente'
            : 'Completar'}
        </button>

        <button
          onClick={handleDelete}
          disabled={deleteTask.isPending}
        >
          {deleteTask.isPending
            ? 'Eliminando...'
            : 'Eliminar'}
        </button>
      </div>
    </div>
  );
}