import { useEffect, useState } from 'react';
import './App.css';
import CreateTask from './components/CreateTask';
import TodoList from './components/TodoList';
import SearchAndFilter from './components/searchAndFilter';

export const fetchData = async (setTasks) => {
  try {
    const response = await fetch(`https://glassberry-ruby.vercel.app/shree/tasks`);
    const data = await response.json();
    setTasks(data);
  } catch (error) {
    console.log(error.message);
  }
};

function App() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchData(setTasks)
  }, []);


  return (
    <div className="App">
   <main className="flex min-h-screen flex-col items-center p-10">
      <div className="text-center my-5 flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Property Management Application</h1>
        <CreateTask tasks={tasks} setTasks={setTasks} />
      </div>
    <SearchAndFilter tasks={tasks} setTasks={setTasks}/>
      <TodoList tasks={tasks} setTasks={setTasks} />
    </main>
    </div>
  );
}

export default App;
