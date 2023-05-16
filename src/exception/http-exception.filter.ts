import {
	ArgumentsHost,
	BadRequestException,
	Catch,
	ExceptionFilter,
	ForbiddenException,
	HttpException,
	HttpStatus, UnauthorizedException
} from "@nestjs/common";
import { ApiException } from "./api.exception";
import { Request, Response } from "express";
import * as fs from "fs";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const { getRequest, getResponse } = host.switchToHttp();
		const response: Response = getResponse();
		const request: Request = getRequest();
		const status = exception.getStatus();
		console.log(exception)

		// custom exception error
		if (exception instanceof ApiException) {
			response.status(status).json({
				// status: status,
				code: exception.code,
				message: exception.message,
			});
		} else if (exception instanceof UnauthorizedException) {
			const message = exception.getResponse()["message"];
			response.status(status).json({
				// status: status,
				code: "UNAUTHORIZED",
				message: message,
			});
		}else if (exception instanceof ForbiddenException) {
			response.status(status).json({
				// status: status,
				code: "FORBIDDEN",
				message: "Forbidden",
			});
			// class-validator error
		} else if (exception instanceof BadRequestException) {
			const errors = exception.getResponse()["message"];
			const message = Array.isArray(errors) ? errors[0] : errors;
			// nếu error là mảng thì lấy message đầu tiên
			if (Array.isArray(errors)) {
				response.status(status).json({
					// status: status,
					code: "BAD_REQUEST",
					message
				});
			} else {
				response.status(status).json({
					// status: status,
					code: "BAD_REQUEST",
					message: errors,
				});
			}
	}else {
			response.status(status).json({
				// status: status,
				code: "INTERNAL_SERVER_ERROR",
				message: "Internal server error",
			});
		}
	}

}
