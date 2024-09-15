import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash } from "react-icons/fi";
import Modal from "./Modal";
import { fetchData } from "../App";
import Carousel from "./Carousel";

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
  const [editLocation, setEditLocation] = useState(task.location);
  const [editEditorValue, setEditEditorValue] = useState(task.desc);
  const [priorityValue, setPriorityValue] = useState(task.price);
  const [categoryValue, setCategoryValue] = useState(task.type);
  const [error, setError] = useState("");

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

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
      await fetch(`https://glassberry-ruby.vercel.app/shree/task/${id}`, {
        method: "DELETE",
      });
      fetchData(setTasks);
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
        location:editLocation,
        desc: editEditorValue,
        price: priorityValue,
        type: categoryValue,
      };
      await fetch(`https://glassberry-ruby.vercel.app/shree/task/${task._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      await fetchData(setTasks);
    } catch (error) {
      console.error("Error editing task:", error);
      setError("Failed to edit task. Please try again.");
    }
  };

  return (
    <>
      {/* Task Card */}
      <div className="card card-side bg-base-100 shadow-xl flex h-[200px] w-[350px]">
        <figure className="relative w-[40%] h-full">
          <div className="w-full h-full overflow-hidden">
            <Carousel slides={task.images} />
          </div>
        </figure>
        <div className="card-body p-2 w-[60%] flex flex-col">
          <span
            className={`badge ml-[50%] px-3 font-extralight  rounded-full ${
              task.type === "Commercial"
                ? "bg-blue-500 text-white"
                : "bg-green-500 text-white"
            }`}
          >
            {task.type}
          </span>

          <div className="info bg-whiteflex flex-col overflow-hidden justify-center">
            <a
              href="#"
              className="titulo text-blue-600 text-lg font-bold hover:underline"
            >
              {task.name}
            </a>
            <div className="ubicacion text-gray-600 text-sm">
              <i className="fas fa-map-marker-alt"></i>
              {task?.location}
            </div>
            <div className="desc text-gray-700 text-sm my-2">{task.desc}</div>
          </div>

          <div className="card-actions flex gap-2 justify-evenly">
            <div className="precio flex items-center">
              <span className="text-xl font-bold text-blue-600 mr-2">
                ₹{task.price}
              </span>
            </div>

            <div className="flex gap-2 justify-end">
              <FiEdit
                cursor="pointer"
                className="text-blue-500"
                size={25}
                onClick={() => setModalOpenToEdit(true)}
              />
              <Modal
                modalOpen={modalOpenToEdit}
                setModalOpen={setModalOpenToEdit}
              >
                <form
                  onSubmit={handleEditFormSubmit}
                  className="flex flex-col gap-5"
                >
                  <h3 className="font-bold text-lg">Edit Task</h3>
                  <div className="flex gap-2"> <input
                    required
                    className="input input-bordered w-full"
                    value={editInputValue}
                    onChange={(e) => setEditInputValue(e.target.value)}
                    type="text"
                    placeholder="Enter title here..."
                  />
                  
                  <input
                    required
                    className="input input-bordered w-full"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    type="text"
                    placeholder="Enter location here..."
                  /></div>
                 
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
                      <option value="" disabled selected>
                        Choose Category
                      </option>
                      <option value="Commercial">Commercial</option>
                      <option value="Residential">Residential</option>
                    </select>
                  </div>
                  <button className="btn" type="submit">
                    Update
                  </button>
                </form>
              </Modal>

              <FiTrash
                cursor="pointer"
                className="text-red-500"
                size={25}
                onClick={() => {
                  handleDeleteTask(task._id);
                }}
              />
              {/* <Modal modalOpen={modalOpenToDelete} setModalOpen={setModalOpenToDelete}>
            <h3 className="text-lg">Are you sure you want to delete this task?</h3>
            <div className="modal-action">
              <button className="btn" onClick={() => handleDeleteTask()}>Yes</button>
            </div>
          </Modal> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Task;
