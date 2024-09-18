const mongoose = require('mongoose');
const Chat = require("./models/chat.js");

main()
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
}

let allChats = [
    {
      from: "neha",
      to: "preeti",
      msg: "send me notes for the exam",
      created_at: new Date(),
    },
    {
      from: "anita",
      to: "ramesh",
      msg: "bring me some fruits",
      created_at: new Date(),
    },
    {
      from: "tony",
      to: "peter",
      msg: "love you 3000",
      created_at: new Date(),
    },
    {
      from: "sarah",
      to: "mike",
      msg: "don't forget our dinner plans tonight",
      created_at: new Date(),
    },
    {
      from: "john",
      to: "emma",
      msg: "can you help me with the project tomorrow?",
      created_at: new Date(),
    }
  ];

Chat.insertMany(allChats);