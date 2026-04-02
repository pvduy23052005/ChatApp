import mongoose from "mongoose";

const friendshipSchema = new mongoose.Schema({
  userId1: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  userId2: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  roomChatId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Room",
    required: true 
  }
}, {
  timestamps: true, 
});

friendshipSchema.index({ userId1: 1, userId2: 1 }, { unique: true });

const Friend = mongoose.model("Friend", friendshipSchema, "friends");
export default Friend;