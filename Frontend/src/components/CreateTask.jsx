import React, { useState } from 'react';
import { AiOutlinePlus } from "react-icons/ai";
import Modal from './Modal';

const CreateTask = ({ tasks, setTasks }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [editorValue, setEditorValue] = useState("");
    const [price, setPrice] = useState("");
    const [categoryValue, setCategoryValue] = useState("");
    const [error, setError] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);  // State to store selected files
    const [previewImages, setPreviewImages] = useState([]);  // State to store preview images

    // Function to handle file selection
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(prevFiles => [...prevFiles, ...files]); // Add new selected files

        const filePreviews = files.map(file => {
            return URL.createObjectURL(file);
        });
        setPreviewImages(prevImages => [...prevImages, ...filePreviews]); // Add new preview images
    };

    // Function to remove an image
    const removeImage = (index) => {
        setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
        setPreviewImages(prevImages => prevImages.filter((_, i) => i !== index));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!editorValue && !inputValue) {
            setError('Please enter title & description.');
            return;
        } else if (!inputValue) {
            setError('Please enter a title.');
            return;
        } else if (!editorValue) {
            setError('Please enter a description.');
            return;
        }

        const formData = new FormData();
        formData.append('name', inputValue);
        formData.append('desc', editorValue);
        formData.append('price', price);
        formData.append('type', categoryValue);

        // Append selected files to the form data
        selectedFiles.forEach(file => {
            formData.append('images', file);
        });

        try {
            const response = await fetch('http://localhost:8080/shree/task', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            const updatedTasks = [...tasks, data];
            setTasks(updatedTasks);
            setInputValue("");
            setEditorValue("");
            setPrice("");
            setCategoryValue("");
            setPreviewImages([]); // Clear preview images
            setSelectedFiles([]);  // Clear selected files
            setModalOpen(false);
        } catch (error) {
            console.error('Error adding task:', error);
            setError('Failed to add task. Please try again.');
        }
    };

    return (
        <>
            <div>
                <button onClick={() => setModalOpen(true)} className="btn btn-primary w-full flex items-center justify-center gap-2">
                    Add New Task
                    <AiOutlinePlus size={18} />
                </button>

                <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
                    <form onSubmit={handleFormSubmit} className="flex flex-col gap-5">
                        <h3 className="font-bold text-lg">Add New Property</h3>

                        <input
                            className="input input-bordered w-full"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            type="text"
                            placeholder="Enter name here..."
                        />

                        <textarea
                            className="textarea textarea-bordered w-full"
                            placeholder="Enter description here..."
                            value={editorValue}
                            onChange={(e) => setEditorValue(e.target.value)}
                        />

                        {error && <p className="text-red-500">{error}</p>}

                        <div className='flex gap-2'>
                           

                            <input
                            className="input input-bordered w-full"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            type="number"
                            placeholder="Enter price here..."
                        />

                            <select required
                                className="select select-bordered w-full max-w-xs"
                                onChange={(e) => setCategoryValue(e.target.value)}
                            >
                                <option value="" disabled selected>Choose types</option>
                                <option value="Commercial">Commercial</option>
                                <option value="Residential">Residential</option>
                            </select>
                        </div>

                        <div>
                            <input
                                type="file"
                                id="file-input"
                                accept="image/png, image/jpeg"
                                onChange={handleFileChange}
                                multiple
                                name='images'
                                className="hidden"
                            />
                            <label htmlFor="file-input" className="bg-gray-200 text-black w-full py-2 px-4 rounded-md cursor-pointer inline-block">
                                <i className="fas fa-upload"></i> &nbsp; Choose A Photos
                            </label>
                            {selectedFiles.length > 0 && <p>{selectedFiles.length} Files Selected</p>}

                            {selectedFiles.length > 0 &&   <div className="flex flex-wrap gap-4 mt-4">
                                {previewImages.map((image, index) => (
                                    <div key={index} className="relative">
                                        <img src={image} alt={`Preview ${index}`} className="w-16 h-16 object-contain rounded" />
                                        <button
                                            onClick={() => removeImage(index)}
                                            className="absolute top-0 right-0 bg-gray-500 text-black w-4 h-4 justify-center items-center flex pb-[5px] rounded-full"
                                        >x
                                        </button>
                                        <p className="text-center">{selectedFiles[index]?.name}</p>
                                    </div>
                                ))}
                            </div>}
                        </div>

                        <button className="btn bg-blue-600 text-white px-4 py-2 rounded-md" type="submit">
                            Submit
                        </button>
                    </form>
                </Modal>
            </div>
        </>
    );
}

export default CreateTask;
