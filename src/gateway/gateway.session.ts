import { Injectable } from '@nestjs/common';
import {AuthenticatedSocket} from "../common/inteface";

export interface IGatewaySessionManager {
    getUserSocket(id: number): string[]
    setUserSocketId(id: number, socket: string): void
    removeUserSocketId(id: number): void
    getSockets(): Map<number, string[]>
}

@Injectable()
export class GatewaySessionManager implements IGatewaySessionManager {

     private readonly sessions : Map<number , string[]> = new Map<number, string[]>();
    getUserSocket(id: number) {
        return this.sessions.get(id);
    }

    setUserSocketId(id: number, socket: string) {
        this.sessions.set(id, [...this.sessions.get(id) || [], socket]);
    }

    removeUserSocketId(id: number) {
        this.sessions.delete(id);
    }

    removeSocketId(id: number, socket: string) {
        const sockets = this.sessions.get(id);
        if(sockets) {
            const index = sockets.indexOf(socket);
            if(index > -1) {
                sockets.splice(index, 1);
            }
        }
    }

    getSockets() {
        return this.sessions;
    }

}
