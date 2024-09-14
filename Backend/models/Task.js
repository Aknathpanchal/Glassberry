const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({
    name: { type: String, required: true }, 
    desc: { type: String },
    price: { type: String },
    type: { type: String },
    images: [String]  
});

const TaskModel = mongoose.model("Task", taskSchema);

module.exports = TaskModel;
