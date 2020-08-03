const mongoose = require("mongoose");

const connectionUrl = "mongodb://127.0.0.1:27017/task-manager-api";

mongoose.connect(connectionUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
});

const User = mongoose.model("User", {
  name: {
    type: String,
  },
  age: {
    type: Number,
  },
});

//Valid
const user = new User({ name: "Harvey", age: 43 });
//Invalid
// const user = new User({ name: "Harvey", age: "age" });

user.save().then(console.log).catch(console.log);
