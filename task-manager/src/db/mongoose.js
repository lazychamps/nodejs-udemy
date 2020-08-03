const mongoose = require("mongoose");
const { default: validator } = require("validator");

const connectionUrl = "mongodb://127.0.0.1:27017/task-manager-api";

mongoose.connect(connectionUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
});

const User = mongoose.model("User", {
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    min: 7,
    validate(value) {
      if (value.includes("password")) {
        throw new Error("Password can not contain password");
      }
    },
  },
  age: {
    type: Number,
    default: 0,
  },
});

//Valid
const user = new User({
  name: "  Louis    ",
  email: "LOUIS@litt.com      ",
  password: "password",
});
//Invalid
// const user = new User({ name: "Harvey", age: "age" });

user.save().then(console.log).catch(console.log);

// const Task = mongoose.model("Task", {
//   description: {
//     type: String,
//   },
//   completed: {
//     type: Boolean,
//   },
// });

// const myTask = new Task({
//   description: "Learn ReactJS",
//   completed: true,
// });

// myTask.save().then(console.log).catch(console.log);
