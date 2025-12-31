import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {UpdateSingleFieldDto} from '../dto/update-single-field.dto';
import {User} from './entities/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
    ) {
    }

    async create(createUserDto: CreateUserDto) {
        const createdUser = new this.userModel(createUserDto);
        return createdUser.save();
    }

    async findAll() {
        return this.userModel.find().exec();
    }

    async findOne(id: string) {
        return this.userModel.findOne({id}).exec();
    }

    async remove(id: string) {
        return this.userModel.findOneAndDelete({id}).exec();
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        return this.userModel.findOneAndUpdate({id}, updateUserDto, {new: true}).exec();
    }

    async updateField(updateSingleFieldDto: UpdateSingleFieldDto) {
        const {id, fieldName, value} = updateSingleFieldDto;
        return this.userModel.findOneAndUpdate(
            {id},
            {[fieldName]: value},
            {new: true}
        ).exec();
    }
}
