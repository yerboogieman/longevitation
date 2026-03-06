import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiKeyGuard implements CanActivate {

    constructor(private readonly configService: ConfigService) {}

    canActivate(context: ExecutionContext): boolean {

        const request = context.switchToHttp().getRequest();
        const apiKey = request.headers['x-api-key'];

        if (!apiKey) {
            throw new UnauthorizedException('No API key provided');
        }

        const validApiKey = this.configService.get<string>('API_KEY');

        if (apiKey !== validApiKey) {
            throw new UnauthorizedException('Invalid API key');
        }

        const userId = this.configService.get<string>('API_KEY_USER_ID');
        request.user = { id: userId };

        return true;
    }
}
