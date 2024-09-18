const express = require("express");
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const Chat = require("./models/chat.js");
const methodOverride = require("method-override");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended: true})); //for parsing data
app.use(methodOverride("_method"));

main()
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
}

let chat1 = new Chat({
    from: "neha",
    to: "priya",
    msg: "send me your exam sheets",
    created_at: new Date(),
  });
  
  chat1.save().then((res) => {
    console.log(res);
  });

// Index Route
app.get("/chats", async (req, res) => {
  let chats = await Chat.find();
  // console.log(chats);
  res.render("index.ejs", {chats});
});

//New Route
app.get("/chats/new", (req, res) => {
  res.render("new.ejs");
})

//Create Route
// app.post("/chats", (req,res) => {
//   let{from, to , msg} =req.body;
//   let newChat = new Chat({
//     from: from,
//     to: to,
//     msg: msg,
//     created_at: new Date()
//     });


//     newChat.save().then(res => {
//       console.log("chat was saved ");
//     })
//     .catch((err) => {
//       console.log(err);
//     });
//     res.redirect("/chats");
//   });

app.post("/chats", async (req, res) => {
  let { from, to, msg } = req.body;
  console.log("Received chat data:", { from, to, msg }); // Add this line for debugging
  
  let newChat = new Chat({
    from: from,
    to: to,
    msg: msg,
    created_at: new Date()
  });

  try {
    await newChat.save();
    console.log("Chat was saved:", newChat); // Add this line for debugging
    res.redirect("/chats");
  } catch (err) {
    console.log("Error saving chat:", err);
    res.status(500).send("Error saving chat");
  }
});

app.get("/clear-chats", async (req, res) => {
  try {
    await Chat.deleteMany({});
    console.log("All chats cleared");
    res.redirect("/chats");
  } catch (err) {
    console.log("Error clearing chats:", err);
    res.status(500).send("Error clearing chats");
  }
});


//Edit Route
app.get("/chats/:id/edit", async (req, res) => {
  let {id} =req.params;
  let chat = await Chat.findById(id);
  res.render("edit.ejs", {chat});
})


//Update Route
app.put("/chats/:id", async (req, res) => {
  let { id } = req.params;
  let { msg: newMsg } = req.body;
  console.log(newMsg);
  let updatedChat = await Chat.findByIdAndUpdate(
      id,
      { msg: newMsg },
      { runValidators: true, new: true }
  );

  console.log(updatedChat);
  res.redirect("/chats");
});

//Destroy Route
app.delete("/chats/:id", async (req, res) => {
  let { id } = req.params;
  let deletedChat = await Chat.findByIdAndDelete(id);
  console.log(deletedChat);
  res.redirect("/chats");
});




app.get("/", (req, res) => {
  res.send("root is working");
});

app.listen(8080, () => {
  console.log("server is listening on port 8080");
});