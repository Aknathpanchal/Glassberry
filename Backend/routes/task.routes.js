const { Router } = require("express");
const TaskModel = require("../models/Task");
const multer = require("multer");
const path = require("path");
const fs = require("fs"); // Add the file system module

const taskRouter = Router();

// Storage settings for multer
const storage = multer.diskStorage({
  destination: "./public/uploads", // Directory to store images
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  },
});

// Upload settings with file type filtering and file size limit
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // Limit file size to 1MB
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only images are allowed (jpeg, jpg, png, gif)!"));
    }
  },
});

// Route to get all tasks
taskRouter.get("/tasks", async (req, res) => {
  try {
    const tasks = await TaskModel.find({});
    return res.send(tasks);
  } catch (error) {
    return res.status(500).send({ message: "Error while fetching tasks" });
  }
});

// Route to get a specific task by ID
taskRouter.get("/task/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const task = await TaskModel.findById(id);
    return res.send(task);
  } catch (error) {
    return res.status(500).send({ message: "Error while fetching task" });
  }
});

// Route to create a task with multiple image uploads
taskRouter.post("/task", upload.array("images", 3), async (req, res) => {
  try {
    const images = req.files.map((file) => file.filename); // Get the uploaded image filenames
    const newTask = await TaskModel.create({
      ...req.body,
      images, // Add images to the task
    });
    return res.status(201).send(newTask);
  } catch (error) {
    return res.status(500).send({ message: "Error while creating task" });
  }
});

// Route to update a task by ID with image upload
taskRouter.patch("/task/:id", upload.array("images", 3), async (req, res) => {
  const id = req.params.id;
  try {
    const images = req.files ? req.files.map((file) => file.filename) : []; // Get new images if uploaded
    const updatedTask = await TaskModel.findByIdAndUpdate(
      id,
      {
        ...req.body,
        ...(images.length && { images }), // Only update images if they exist
      },
      { new: true }
    );
    return res.send(updatedTask);
  } catch (error) {
    return res.status(400).send({ message: "Error while updating task" });
  }
});

// DELETE route to delete a task and its images
taskRouter.delete("/task/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Find the task by ID
    const task = await TaskModel.findById(id);
    if (!task) {
      return res.status(404).send({ message: "Task not found." });
    }

    // Check if the task has images and delete them from the server
    if (task.images && task.images.length > 0) {
      task.images.forEach((image) => {
        const filePath = path.join(__dirname, "../public/uploads", image); // Adjust the path to where the images are stored

        // Check if file exists before deleting
        fs.access(filePath, fs.constants.F_OK, (err) => {
          if (!err) {
            // If file exists, delete it
            fs.unlink(filePath, (err) => {
              if (err) {
                console.error("Error while deleting image:", err);
              } else {
                console.log(`Deleted image: ${filePath}`);
              }
            });
          } else {
            console.log(`Image not found: ${filePath}`);
          }
        });
      });
    }

    // Delete the task from the database
    await TaskModel.findByIdAndDelete(id);

    return res
      .status(200)
      .send({ message: "Task and associated images deleted successfully." });
  } catch (error) {
    return res.status(500).send({ message: "Error while deleting task." });
  }
});

// Route to get filtered tasks
taskRouter.get("/task", async (req, res) => {
  try {
    const { name, location, minPrice, maxPrice, type } = req.query;

    // Build the filter object
    const filter = {};
    if (name) filter.name = { $regex: new RegExp(name, "i") }; // Case-insensitive search
    if (location) filter.location = { $regex: new RegExp(location, "i") }; // Case-insensitive search
    if (type) filter.type = type;
    if (minPrice) filter.price = { $gte: parseFloat(minPrice) };
    if (maxPrice)
      filter.price = { ...filter.price, $lte: parseFloat(maxPrice) };

    // Fetch tasks based on filters
    const tasks = await TaskModel.find(filter);

    return res.send(tasks);
  } catch (error) {
    return res.status(500).send({ message: "Error while fetching tasks." });
  }
});

// Handle multer file size error
taskRouter.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .send({ message: "File too large. Maximum size allowed is 1MB." });
    }
  } else if (err) {
    return res
      .status(500)
      .send({ message: "An error occurred during the upload." });
  }
  next();
});

module.exports = taskRouter;
