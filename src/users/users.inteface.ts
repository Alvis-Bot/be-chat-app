import {User} from "../common/entity/user.entity";

export interface IUsersService {
    getUserByEmail(email: string): Promise<User>;
    saveUser(user : User): Promise<User>;
    findUser(email : string): Promise<User>;
    getUserByPasswordResetToken(hashedToken: string,): Promise<User>
    updateUserOnline(userId: number, isOnline: boolean): Promise<void>;
}
