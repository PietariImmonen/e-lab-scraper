import { Timestamp } from "firebase/firestore";

export interface IUser {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
