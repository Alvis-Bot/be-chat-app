import {MulterField, MulterOptions} from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import {applyDecorators, UseInterceptors} from "@nestjs/common";
import {FileFieldsInterceptor, FileInterceptor, FilesInterceptor} from "@nestjs/platform-express";
import {ApiConsumes} from "@nestjs/swagger";

export function ApiFile(
    fieldName: string = 'file',
    required: boolean = false,
    localOptions?: MulterOptions,
) {
    return applyDecorators(
        UseInterceptors(FileInterceptor(fieldName, localOptions)),
        ApiConsumes('multipart/form-data'),
    );
}

export type UploadFields = MulterField & { required?: boolean };
export function ApiFileFieldsAndType(
    uploadField: UploadFields[],
    localOptions?: MulterOptions,
) {
    return applyDecorators(
        UseInterceptors(FileFieldsInterceptor(uploadField, localOptions)),
        ApiConsumes("multipart/form-data"),
    );
}



export function ApiFiles(
    fieldName: string = 'files',
    required: boolean = false,
    maxCount: number = 10,
    localOptions?: MulterOptions,
) {
    return applyDecorators(
        UseInterceptors(FilesInterceptor(fieldName, maxCount, localOptions)),
        ApiConsumes('multipart/form-data'),
    );
}
