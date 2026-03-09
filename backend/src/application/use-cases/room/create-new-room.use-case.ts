import { IRoomRepository } from "../../../domain/interfaces/room.interface";

export class CreateNewRoomUseCase {
  constructor(private readonly roomRepository: IRoomRepository) { }

  async execute(myID: string, titleRoom: string, members: string[]) {

    if (!titleRoom) {
      throw new Error("Nhập tên phòng");
    }

    if (!members) {
      throw new Error("Vui lòng chọn thành viên");
    }

    const memberIDs: string[] = Array.isArray(members)
      ? [...members]
      : [members];


    if (memberIDs.length === 1) {
      const userID: string = memberIDs[0]!;
      const existRoom = await this.roomRepository.checkRoomExist(myID, userID);
      if (existRoom) {
        throw new Error("Phòng này đã tồn tại");
      }
    }

    const newRoomData = {
      title: titleRoom,
      typeRoom: "group",
      members: [
        {
          user_id: myID,
          role: "superAdmin",
          status: "accepted"
        }
      ]
    }

    memberIDs.forEach((memberID) => {
      newRoomData.members.push({
        user_id: memberID,
        role: "member",
        status: "accepted"
      })
    });

    const newRoom = await this.roomRepository.createNewRoom(newRoomData);

    return newRoom;
  }
}
