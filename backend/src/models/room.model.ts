import mongoose from "mongoose";


const memberSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  role: {
    type: String,
    enum: ["superAdmin", "admin", "member"],
    default: "member",

  },
  status: {
    type: String,
    enum: ["waiting", "accepted", "refused"]
  }
}, {
  _id: false
}
)

const userSchema = new mongoose.Schema({
  title: {
    type: String,
    default: "",
  },
  typeRoom: {
    type: String,
    enum: ["single", "group", "friend"],
  },
  members: [memberSchema],
  lastMessageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat"
  },
  deleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
})

const Room = mongoose.model("Room", userSchema, "rooms");

export default Room; 