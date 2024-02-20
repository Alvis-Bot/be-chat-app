import { Injectable } from '@nestjs/common';
import {IProfileService} from "./profile";

@Injectable()
export class ProfileService implements IProfileService{}
