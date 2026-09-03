import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

function App() {
  return (
    <div className="container">
      <header>
        <h1>Task Manager</h1>
        <p>Administración de tareas con tRPC</p>
      </header>

      <main>
        <TaskForm />
        <TaskList />
      </main>
    </div>
  );
}

export default App;