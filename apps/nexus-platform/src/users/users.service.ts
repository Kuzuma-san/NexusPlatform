import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User)
    private userModel: typeof User
  ){}

  //Guest
  create(createUserDto: CreateUserDto): Promise<User> {
    return this.userModel.create(createUserDto);
  }

  //Admin
  findAll(): Promise<User[]> {
    return this.userModel.findAll();
  }

  //Admin
  async findOne(id: number): Promise<User> {
    return await this.userModel.findOne({
      where: {id: id},
      attributes: {exclude: ['password']}
    });
  }

  //User...Also check if user is not updating other user-> taking th eid from req body and not by user himself so not needed
  async update(id: number, updateUserDto: UpdateUserDto): Promise<{ numberOfRowsAffected: number }>  {
    const [numberOfRowsAffected] = await this.userModel.update(updateUserDto,{
      where: {id},
    });
    return {numberOfRowsAffected};
  }

  //Admin and User(Only himself and then logout)
  async remove(id: number): Promise<number> {
    const user = await this.findOne(id);
    if(!user){
      throw new NotFoundException("User does not Exist!");
    }
    return await this.userModel.destroy({
      where: {id},
    });
  }
}
