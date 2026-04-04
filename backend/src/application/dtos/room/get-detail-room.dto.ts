export interface RoomDetailOutputDTO {
  id: string;
  title: string;
  typeRoom: string;
  avatar: string;
  members: {
    id: string;
    fullName: string;
    avatar: string;
    role: string;
   }[];
}
