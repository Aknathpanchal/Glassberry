

// import React, { useEffect, useState } from "react";
// import { FiEdit, FiTrash } from "react-icons/fi";
// import Modal from "./Modal";
// import { fetchData } from "../App";

// const Task = ({
//   task,
//   setTasks,
//   index,
//   modalOpenToDelete,
//   setModalOpenToDelete,
// }) => {
//   const [modalOpenToEdit, setModalOpenToEdit] = useState(false);
//   const [isFormSubmitted, setIsFormSubmitted] = useState(false);
//   const [editInputValue, setEditInputValue] = useState(task.name);
//   const [editEditorValue, setEditEditorValue] = useState(task.desc);
//   const [priorityValue, setPriorityValue] = useState(task.price);
//   const [categoryValue, setCategoryValue] = useState(task.type);
//   const [error, setError] = useState("");

//   const handleEditFormSubmit = async (e) => {
//     e.preventDefault();
//     if (!editEditorValue && !editInputValue) {
//       setError("Please enter title & description.");
//       return;
//     } else if (!editInputValue) {
//       setError("Please enter a title.");
//       return;
//     } else if (!editEditorValue) {
//       setError("Please enter a description.");
//       return;
//     }
//     setIsFormSubmitted(true);
//     setModalOpenToEdit(false);
//   };

//   const handleEditorChange = (event) => {
//     const newValue = event.target.value;
//     setEditEditorValue(newValue);
//     setIsFormSubmitted(false);
//   };

//   const handleDeleteTask = async (id) => {
//     try {
//       await fetch(`http://localhost:8080/shree/task/${id}`, {
//         method: "DELETE",
//       });
//       fetchData(setTasks);
//       setModalOpenToDelete(false);
//     } catch (error) {
//       console.error("Error deleting task:", error);
//       setError("Failed to delete task. Please try again.");
//     }
//   };

//   useEffect(() => {
//     if (isFormSubmitted) {
//       editTask();
//     }
//   }, [isFormSubmitted]);

//   const editTask = async () => {
//     try {
//       const payload = {
//         name: editInputValue,
//         desc: editEditorValue,
//         price: priorityValue,
//         type: categoryValue,
//       };
//       await fetch(
//         `http://localhost:8080/shree/task/${task._id}`,
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(payload),
//         }
//       );
//       await fetchData(setTasks);
//     } catch (error) {
//       console.error("Error editing task:", error);
//       setError("Failed to edit task. Please try again.");
//     }
//   };

//   return (
//     <>
//       {/* Task Card */}
//       <div className="card card-side bg-base-100 shadow-xl">
//         <figure className="w-[30%]">
//           <img
//             src={`http://localhost:8080/public/uploads/${task.images[0]}`}
//             alt={task.name}
//           />
//         </figure>
//         <div className="card-body">
//           <h2 className="card-title">{task.name}</h2>
//           <p>{task.desc}</p>
//           <p><strong>Price:</strong> {task.price}</p>
//           <p><strong>Type:</strong> {task.type}</p>

//           <div className="card-actions justify-end">
//             <FiEdit
//               cursor="pointer"
//               className="text-blue-500"
//               size={45}
//               onClick={() => setModalOpenToEdit(true)}
//             />
//             <Modal modalOpen={modalOpenToEdit} setModalOpen={setModalOpenToEdit}>
//               <form onSubmit={handleEditFormSubmit} className="flex flex-col gap-5">
//                 <h3 className="font-bold text-lg">Edit Task</h3>
//                 <input
//                   required
//                   className="input input-bordered w-full"
//                   value={editInputValue}
//                   onChange={(e) => setEditInputValue(e.target.value)}
//                   type="text"
//                   placeholder="Enter title here..."
//                 />
//                 <textarea
//                   className="textarea textarea-bordered w-full"
//                   placeholder="Enter description here..."
//                   value={editEditorValue}
//                   onChange={handleEditorChange}
//                 ></textarea>
//                 {error && <p className="error text-red-500">{error}</p>}
//                 <div className="flex gap-2">
//                   <input
//                     className="input input-bordered w-full"
//                     value={priorityValue}
//                     onChange={(e) => setPriorityValue(e.target.value)}
//                     type="number"
//                     placeholder="Enter price here..."
//                   />
//                   <select
//                     required
//                     className="select select-bordered w-full max-w-xs"
//                     value={categoryValue}
//                     onChange={(e) => setCategoryValue(e.target.value)}
//                   >
//                     <option value="" disabled selected>Choose Category</option>
//                     <option value="Commercial">Commercial</option>
//                     <option value="Residential">Residential</option>
//                   </select>
//                 </div>
//                 <button className="btn" type="submit">Update</button>
//               </form>
//             </Modal>

//             <FiTrash
//               cursor="pointer"
//               className="text-red-500"
//               size={45}
//               onClick={() => setModalOpenToDelete(true)}
//             />
//             <Modal modalOpen={modalOpenToDelete} setModalOpen={setModalOpenToDelete}>
//               <h3 className="text-lg">Are you sure you want to delete this task?</h3>
//               <div className="modal-action">
//                 <button className="btn" onClick={() => handleDeleteTask(task._id)}>Yes</button>
//               </div>
//             </Modal>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Task;


import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash } from "react-icons/fi";
import Modal from "./Modal";
import { fetchData } from "../App";

const Task = ({
  task,
  setTasks,
  index,
  modalOpenToDelete,
  setModalOpenToDelete,
}) => {
  const [modalOpenToEdit, setModalOpenToEdit] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [editInputValue, setEditInputValue] = useState(task.name);
  const [editEditorValue, setEditEditorValue] = useState(task.desc);
  const [priorityValue, setPriorityValue] = useState(task.price);
  const [categoryValue, setCategoryValue] = useState(task.type);
  const [error, setError] = useState("");

  const handleEditFormSubmit = async (e) => {
    e.preventDefault();
    if (!editEditorValue && !editInputValue) {
      setError("Please enter title & description.");
      return;
    } else if (!editInputValue) {
      setError("Please enter a title.");
      return;
    } else if (!editEditorValue) {
      setError("Please enter a description.");
      return;
    }
    setIsFormSubmitted(true);
    setModalOpenToEdit(false);
  };

  const handleEditorChange = (event) => {
    const newValue = event.target.value;
    setEditEditorValue(newValue);
    setIsFormSubmitted(false);
  };

  const handleDeleteTask = async (id) => {
    try {
      await fetch(`http://localhost:8080/shree/task/${id}`, {
        method: "DELETE",
      });
      fetchData(setTasks);
      setModalOpenToDelete(false);
    } catch (error) {
      console.error("Error deleting task:", error);
      setError("Failed to delete task. Please try again.");
    }
  };

  useEffect(() => {
    if (isFormSubmitted) {
      editTask();
    }
  }, [isFormSubmitted]);

  const editTask = async () => {
    try {
      const payload = {
        name: editInputValue,
        desc: editEditorValue,
        price: priorityValue,
        type: categoryValue,
      };
      await fetch(
        `http://localhost:8080/shree/task/${task._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      await fetchData(setTasks);
    } catch (error) {
      console.error("Error editing task:", error);
      setError("Failed to edit task. Please try again.");
    }
  };

  return (
    <>
      {/* Task Card */}
      <div className="card card-side bg-base-100 shadow-xl">
        <figure className="w-[40%]">
          <img
            className="object-fill w-full h-full"
            src={`http://localhost:8080/public/uploads/${task.images[0]}`}
            alt={task.name}
          />
        </figure>
        <div className="card-body w-[60%] text-left">
          <h2 className="card-title">{task.name}</h2>
          <p><strong>Description:</strong>{task.desc}</p>
          <p><strong>Price:</strong> {task.price}</p>
          <p><strong>Type:</strong> {task.type}</p>

          <div className="card-actions justify-end">
            <FiEdit
              cursor="pointer"
              className="text-blue-500"
              size={45}
              onClick={() => setModalOpenToEdit(true)}
            />
            <Modal modalOpen={modalOpenToEdit} setModalOpen={setModalOpenToEdit}>
              <form onSubmit={handleEditFormSubmit} className="flex flex-col gap-5">
                <h3 className="font-bold text-lg">Edit Task</h3>
                <input
                  required
                  className="input input-bordered w-full"
                  value={editInputValue}
                  onChange={(e) => setEditInputValue(e.target.value)}
                  type="text"
                  placeholder="Enter title here..."
                />
                <textarea
                  className="textarea textarea-bordered w-full"
                  placeholder="Enter description here..."
                  value={editEditorValue}
                  onChange={handleEditorChange}
                ></textarea>
                {error && <p className="error text-red-500">{error}</p>}
                <div className="flex gap-2">
                  <input
                    className="input input-bordered w-full"
                    value={priorityValue}
                    onChange={(e) => setPriorityValue(e.target.value)}
                    type="number"
                    placeholder="Enter price here..."
                  />
                  <select
                    required
                    className="select select-bordered w-full max-w-xs"
                    value={categoryValue}
                    onChange={(e) => setCategoryValue(e.target.value)}
                  >
                    <option value="" disabled selected>Choose Category</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Residential">Residential</option>
                  </select>
                </div>
                <button className="btn" type="submit">Update</button>
              </form>
            </Modal>

            <FiTrash
              cursor="pointer"
              className="text-red-500"
              size={45}
              onClick={() => setModalOpenToDelete(true)}
            />
            <Modal modalOpen={modalOpenToDelete} setModalOpen={setModalOpenToDelete}>
              <h3 className="text-lg">Are you sure you want to delete this task?</h3>
              <div className="modal-action">
                <button className="btn" onClick={() => handleDeleteTask(task._id)}>Yes</button>
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
};

export default Task;
