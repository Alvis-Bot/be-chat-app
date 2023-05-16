import {User} from "./entity/user.entity";
import {Socket} from "socket.io";

export interface AuthenticatedSocket extends Socket {
    user: {
        sub: number;
        username: string;
    }
}



export interface AuthenticatedRequest extends Request {
    user: User
}