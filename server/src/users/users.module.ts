import { Module } from '@nestjs/common';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import { User, UserSchema } from '@customation/model/document';
import { UserController } from '@customation/web';
import { UserService } from '@customation/service';
import { AuthGuard } from './auth.guard';
import { UserMongooseRepository } from '@customation/data';
import { SecurityModule, AuthService } from '@customation/security';
import { Model } from 'mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ]),
    EventEmitterModule.forRoot(),
    SecurityModule,
  ],
  controllers: [UserController],
  providers: [
    {
      provide: 'IUserRepository',
      useFactory: (userModel: Model<User>) => {
        return new UserMongooseRepository(userModel);
      },
      inject: [getModelToken(User.name)],
    },
    {
      provide: UserService,
      useFactory: (userRepository: UserMongooseRepository, authService: AuthService, eventEmitter: EventEmitter2) => {
        return new UserService(userRepository, authService, eventEmitter);
      },
      inject: ['IUserRepository', AuthService, EventEmitter2],
    },
    AuthGuard,
  ],
  exports: [UserService],
})
export class UsersModule {}
