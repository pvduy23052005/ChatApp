import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  room_id: {
    type: String,
    default: ""
  },
  content: {
    type: String,
  },
  images: {
    type: Array,
    default: []
  },
  status: {
    type: String,
    enum: ["sent", "seen"],
  },
  deleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date
  }
}, {
  timestamps: true
})

const Chat = mongoose.model("Chat", chatSchema, "chats");

export default Chat; 