import { HttpStatus } from "@nestjs/common";

interface IError {
	message: string;
	status: HttpStatus;
	code: string;
}

interface IErrorCode {
    IMAGE_NOT_FOUND: IError;
	FRIENDS_NOT_FOUND: IError;
	NOT_DELETE_MESSAGE: IError;
    MESSAGE_NOT_FOUND: IError;
    FILE_TYPE_NOT_MATCHING: IError;
	FRIEND_REQUEST_ALREADY_ACCEPTED: IError;
	FRIEND_REQUEST_NOT_FOUND: IError;
	ALREADY_FRIENDS: IError;
	CANT_SEND_FRIEND_REQUEST_TO_YOURSELF: IError;
    FRIEND_REQUEST_ALREADY_EXISTS: IError;
	CONVERSATION_ALREADY_EXISTS: IError;
    CANT_CREATE_CONVERSATION_WITH_YOURSELF: IError;
	NOT_CREATE_MESSAGE: IError;
    CONVERSATION_NOT_FOUND: IError;
    TOKEN_INVALID_OR_EXPIRED: IError;
    EMAIL_NOT_SEND: IError;
	USER_ALREADY_EXIST: IError;
	INTERNAL_SERVER_ERROR: IError;
	CUSTOMER_NOT_FOUND: IError;
	CUSTOMER_ALREADY_EXISTS: IError;
	USER_NOT_FOUND: IError;
}



export const ErrorCode :IErrorCode  = {
	// system error
	INTERNAL_SERVER_ERROR  :{
		message: "Internal server error",
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		code: "INTERNAL_SERVER_ERROR",
	},
	CUSTOMER_NOT_FOUND: {
		message: "Customer not found",
		status: HttpStatus.NOT_FOUND,
		code: "CUSTOMER_NOT_FOUND",
	},
	CUSTOMER_ALREADY_EXISTS: {
		message: "Customer already exists",
		status: HttpStatus.BAD_REQUEST,
		code: "CUSTOMER_ALREADY_EXISTS",
	},
	USER_NOT_FOUND: {
		message: "User not found",
		status: HttpStatus.NOT_FOUND,
		code: "USER_NOT_FOUND",
	},
	USER_ALREADY_EXIST: {
		message: "User already exist",
		status: HttpStatus.BAD_REQUEST,
		code: "USER_ALREADY_EXIST",
	},
	EMAIL_NOT_SEND: {
		message: "Email not send",
		status: HttpStatus.BAD_REQUEST,
		code: "EMAIL_NOT_SEND",
	},
	TOKEN_INVALID_OR_EXPIRED: {
		message: "Token invalid or expired",
		status: HttpStatus.BAD_REQUEST,
		code: "TOKEN_INVALID_OR_EXPIRED",
	},
	CONVERSATION_NOT_FOUND: {
		message: "Conversation not found",
		status: HttpStatus.NOT_FOUND,
		code: "CONVERSATION_NOT_FOUND",
	},
	NOT_CREATE_MESSAGE: {
		message: "Not create message in this conversation",
		status: HttpStatus.FORBIDDEN,
		code: "NOT_CREATE_MESSAGE",
	},
	CANT_CREATE_CONVERSATION_WITH_YOURSELF: {
		message: "Can't create conversation with yourself",
		status: HttpStatus.BAD_REQUEST,
		code: "CANT_CREATE_CONVERSATION_WITH_YOURSELF",
	},
	CONVERSATION_ALREADY_EXISTS: {
		message: "Conversation already exists",
		status: HttpStatus.BAD_REQUEST,
		code: "CONVERSATION_ALREADY_EXISTS",
	},
	FRIEND_REQUEST_ALREADY_EXISTS: {
		message: "Friend request already exists",
		status: HttpStatus.BAD_REQUEST,
		code: "FRIEND_REQUEST_ALREADY_EXISTS",
	},
	CANT_SEND_FRIEND_REQUEST_TO_YOURSELF: {
		message: "Can't send friend request to yourself",
		status: HttpStatus.BAD_REQUEST,
		code: "CANT_SEND_FRIEND_REQUEST_TO_YOURSELF",
	},
	ALREADY_FRIENDS: {
		message: "Already friends",
		status: HttpStatus.BAD_REQUEST,
		code: "ALREADY_FRIENDS",
	},
	FRIEND_REQUEST_NOT_FOUND: {
		message: "Friend request not found",
		status: HttpStatus.NOT_FOUND,
		code: "FRIEND_REQUEST_NOT_FOUND",
	},
	FRIEND_REQUEST_ALREADY_ACCEPTED: {
		message: "Friend request already accepted",
		status: HttpStatus.BAD_REQUEST,
		code: "FRIEND_REQUEST_ALREADY_ACCEPTED",
	},
	FILE_TYPE_NOT_MATCHING: {
		message: "File type not matching",
		status: HttpStatus.BAD_REQUEST,
		code : "FILE_TYPE_NOT_MATCHING"
	},
	MESSAGE_NOT_FOUND: {
		message: "Message not found",
		status: HttpStatus.NOT_FOUND,
		code: "MESSAGE_NOT_FOUND",
	},
	NOT_DELETE_MESSAGE: {
		message: "Not delete message in this conversation",
		status: HttpStatus.FORBIDDEN,
		code: "NOT_DELETE_MESSAGE",
	},
	FRIENDS_NOT_FOUND: {
		message: "Friends not found",
		status: HttpStatus.NOT_FOUND,
		code: "FRIENDS_NOT_FOUND",
	},
	IMAGE_NOT_FOUND: {
		message: "Image not found",
		status: HttpStatus.NOT_FOUND,
		code: "IMAGE_NOT_FOUND",
	}

};
