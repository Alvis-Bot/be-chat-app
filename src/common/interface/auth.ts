import {ObjectId} from "typeorm";

export interface JwtPayload {
  username: string;
  sub: number;
}