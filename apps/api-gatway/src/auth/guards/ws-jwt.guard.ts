import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    try {
      const client: Socket = context.switchToWs().getClient<Socket>();
      const token = this.extractTokenFromHandshake(client);

      if (!token) {
        throw new WsException('No token provided');
      }

      const payload = this.jwtService.verify(token);
      client.data.user = {
        userId: payload.sub,
        email: payload.email,
        username: payload.username,
      };

      return true;
    } catch (err) {
      throw new WsException('Invalid token');
    }
  }

  private extractTokenFromHandshake(client: Socket): string | null {
    const authHeader = client.handshake.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    // Também suporta token via query parameter
    const token = client.handshake.auth?.token || client.handshake.query?.token;
    return token as string;
  }
}
