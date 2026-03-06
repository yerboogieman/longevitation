import { Module } from '@nestjs/common';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import { User, UserSchema } from '@customation/model/document';
import { UserController } from '@customation/web';
import { UserService, StatusService, AvatarService, LabelService, LABELS_CONFIG_TOKEN, FileSystemStorageService, STORAGE_CONFIG_TOKEN } from '@customation/service';

import { UserMongooseRepository, RoleMongooseRepository } from '@customation/data';
import { SecurityModule, AuthService } from '@customation/security';
import { Model } from 'mongoose';
import * as path from 'path';

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
      provide: 'IRoleRepository',
      useFactory: (userModel: Model<User>) => {
        return new RoleMongooseRepository(userModel);
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
    {
      provide: LABELS_CONFIG_TOKEN,
      useValue: {
        i18nDirectory: path.join(process.cwd(), 'i18n'),
        defaultLocale: 'en',
        supportedLocales: ['en'],
      },
    },
    LabelService,
    StatusService,
    {
      provide: STORAGE_CONFIG_TOKEN,
      useValue: {
        rootDirectory: path.join(process.cwd(), 'uploads'),
        maxFolderDepth: 4,
      },
    },
    {
      provide: 'STORAGE_SERVICE',
      useClass: FileSystemStorageService,
    },
    AvatarService,
  ],
  exports: [UserService],
})
export class UsersModule {}
