import {User} from "../../common/entity/user.entity";
import {TokenModel} from "../../common/model/token.model";
import {JwtPayload} from "../../common/interface/auth";
import {UserCreateDto} from "../../common/dto/user-create.dto";
import {VerityDto} from "../../common/dto/verity.dto";

export interface IAuthService{
    login(user: User) : Promise<TokenModel>
    validateUser(username: string, password: string): Promise<User>
    validateJwt(payload: JwtPayload): Promise<User>
    refresh(user: User) : Promise<TokenModel>
    createUser(dto: UserCreateDto): Promise<void>
    verifyOTP(dto: VerityDto): Promise<TokenModel>
}