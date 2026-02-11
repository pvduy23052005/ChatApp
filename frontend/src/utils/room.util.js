// handle user already read  ?
export const markRoomRead_util = (rooms, currentRoomID, myID) => {
  const newListRooms = rooms.map((room) => {
    const oldReadBy = room.lastMessage?.readBy || [];

    if (room._id !== currentRoomID) {
      return room;
    }

    if (oldReadBy.includes(myID)) {
      return room;
    }

    const NewReadBy = [...oldReadBy, myID];

    const newRoom = {
      ...room,
      lastMessage: {
        ...room.lastMessage,
        readBy: NewReadBy,
      },
    };
    return newRoom;
  });
  return newListRooms;
};

// handle last-message real-time .
export const updateLastMessageAndReorder_util = (rooms, newMessage, myID) => {
  const roomIndex = rooms.findIndex((room) => room._id === newMessage.room_id);

  if (roomIndex === -1) return rooms;

  const newListRooms = [...rooms];

  const roomToUpdate = { ...newListRooms[roomIndex] };

  roomToUpdate.lastMessage = {
    content: newMessage.content,
    createdAt: newMessage.createdAt,
    user_id: myID,
    readBy: newMessage.readBy,
  };

  newListRooms.splice(roomIndex, 1);
  newListRooms.unshift(roomToUpdate);

  return newListRooms;
};

export const updateSatusMessmasge_util = (chats, myID) => {
  const newListMessages = chats.map((message) => {
    const currentReadList = message.readBy || [];
    const isUserAlreadyRead = currentReadList.includes(myID);

    if (isUserAlreadyRead) {
      return message;
    }

    const newMessage = {
      ...message,
      readBy: [...currentReadList, myID],
    };

    return newMessage;
  });

  return newListMessages;
};

export const updateAdminForRoom_util = (room, memberID) => {
  const updateMemberRoom = room.members.map((member) => {
    if (member.user_id._id !== memberID) {
      return member;
    }

    const updateMember = {
      ...member,
      role: "superAdmin",
    };

    return updateMember;
  });

  return {
    ...room,
    members: updateMemberRoom,
  };
};
