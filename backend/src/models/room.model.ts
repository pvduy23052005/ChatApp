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

const roomSchema = new mongoose.Schema({
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

roomSchema.index({ "members.user_id": 1, deleted: 1, updatedAt: -1 });

const Room = mongoose.model("Room", roomSchema, "rooms");

export default Room; 