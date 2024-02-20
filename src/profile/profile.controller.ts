import {Controller, Patch, UploadedFiles} from '@nestjs/common';
import {Routers} from "../common/enum/routers.enum";
import {AuthUser} from "../auth/decorator/user.decorator";
import {User} from "../common/entity/user.entity";
import {UpdateProfileDto} from "../common/dto/update-profile.dto";
import {extname} from "path";
import {ApiFileFieldsAndType} from "../users/decorator/api-file.decorator";
import {diskStorage} from "multer";
import {ApiException} from "../exception/api.exception";
import {ErrorCode} from "../exception/error.code";

@Controller(Routers.PROFILES)
export class ProfileController {



    @Patch()
    @ApiFileFieldsAndType(
        [
            { name: "banner", maxCount: 1 },
            { name: "avatar", maxCount: 1 },
            { name: "cardBackImage", maxCount: 1 },
        ],
        {
            storage: diskStorage({
                destination: "./uploads",
                filename: (req, file, cb) => {
                    const randomName = Array(32)
                        .fill(null)
                        .map(() => Math.round(Math.random() * 16).toString(16))
                        .join("");
                    return cb(null, `${randomName}${extname(file.originalname)}`);
                },
            }),
            fileFilter: (req: any, file: any, cb: any) => {
                console.log(file);
                if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
                    // Allow storage of file
                    cb(null, true);
                } else {
                    // Reject file
                    cb(new ApiException(ErrorCode.FILE_TYPE_NOT_MATCHING), false);
                }
            },
        },
    )
    updateProfile(@AuthUser() user: User , dto : UpdateProfileDto ,@UploadedFiles() files : Express.Multer.File[]) {
        console.log(user);
        console.log(dto);
        console.log(files);
    }
}
