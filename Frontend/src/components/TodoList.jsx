import { useState } from "react";
import Task from "./Task";

const TodoList = ({ tasks, setTasks }) => {
  const [modalOpenToDelete, setModalOpenToDelete] = useState(false);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tasks && tasks.map((task, taskIndex) => (
        <Task
        key={task._id || taskIndex}
          task={task}
          setTasks={setTasks}
          index={taskIndex}
          modalOpenToDelete={modalOpenToDelete}
          setModalOpenToDelete={setModalOpenToDelete}
        />
      ))}
    </div>
  );
};

export default TodoList;
