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
  type: {
    type: String,
    enum: ["user", "system"]
  },
  status: {
    type: String,
    enum: ["sent", "seen"],
  },
  readBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
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

chatSchema.index({ room_id: 1, createdAt: -1 });

const Chat = mongoose.model("Chat", chatSchema, "chats");

export default Chat; 