export interface RoomDTO {
  _id: string;
  roomId: string;
  hostId: string;
  pax: number;
  participants: string[];
  isActive: boolean;
  createdAt: Date;
}
