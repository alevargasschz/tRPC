import { useState } from 'react';
import { trpc } from '../lib/trpc';
import { TaskPriority } from '../../../../server/src/core/domain/task.domain';

export default function TaskForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIA);

  const utils = trpc.useUtils();

  const createTask = trpc.tasks.create.useMutation({
    onSuccess: async () => {
      await utils.tasks.getAll.invalidate();

      setTitle('');
      setDescription('');
      setPriority(TaskPriority.MEDIA)
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      return;
    }

    await createTask.mutateAsync({
      title,
      description,
      isCompleted: false,
      priority,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <h2>Nueva tarea</h2>

      <input
        type="text"
        placeholder="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <select
        value={priority}
        onChange={(e) =>
          setPriority(e.target.value as TaskPriority)
        }
      >
        <option value={TaskPriority.BAJA}>Baja</option>
        <option value={TaskPriority.MEDIA}>Media</option>
        <option value={TaskPriority.ALTA}>Alta</option>
      </select>

      <button
        type="submit"
        disabled={createTask.isPending}
      >
        {createTask.isPending
          ? 'Creando...'
          : 'Crear tarea'}
      </button>

      {createTask.error && (
        <p className="error">
          {createTask.error.message}
        </p>
      )}
    </form>
  );
}