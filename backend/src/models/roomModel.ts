import mongoose, { Schema, Document } from 'mongoose';

export interface IRoom extends Document {
  roomId: string;
  hostId: string;
  pax: number;
  participants: string[];
  isActive: boolean;
  createdAt: Date;
}

const RoomSchema: Schema = new Schema({
  roomId: { type: String, required: true, unique: true },
  hostId: { type: String, required: true },
  pax: { type: Number, required: true },
  participants: { type: [String], default: [] },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IRoom>('Room', RoomSchema);
