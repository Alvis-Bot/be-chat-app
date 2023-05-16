import {IoAdapter} from "@nestjs/platform-socket.io";
import {AuthenticatedSocket} from "../common/inteface";
import {ApiException} from "../exception/api.exception";
import {INestApplication, INestApplicationContext, UnauthorizedException} from "@nestjs/common";
import * as cookie from 'cookie';
import {JwtService} from "@nestjs/jwt";
import {AuthService} from "../auth/service/auth.service";
import {Services} from "../common/enum/services.enum";
import {ConfigService} from "@nestjs/config";
import * as process from "process";
export class WebsocketAdapter extends IoAdapter{


    private jwtService: JwtService;
    constructor(private app: INestApplicationContext) {
        super(app);
        app.resolve<JwtService>(JwtService).then((jwtService) => {
            this.jwtService = jwtService;
        });
    }
    createIOServer(port: number, options?: any): any {
        const server = super.createIOServer(port, options);
        server.use((socket : AuthenticatedSocket, next) => {
          const accessToken= socket.handshake.query.accessToken as string;
          console.log('accessToken', accessToken);
            if (!accessToken) {
                return next(new Error('Authentication error'));
            }
           try {
               socket.user = this.jwtService.verify(accessToken , {
                   secret: process.env.JWT_SECRET,
               });
           }catch (e) {
               return next(new Error('Authentication error'));
           }
            next();
        });
        return server;
    }
}