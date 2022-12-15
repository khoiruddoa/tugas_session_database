import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/users.dto';

@Injectable()
export class UsersService {
   constructor(@InjectRepository(User) private readonly userRepository: Repository<User>){}

  getUsers(){
    return this.userRepository.find();
  }

  async updateUser(request: CreateUserDto, userId: number){
    const userExist = await this.userRepository.findOne({
      where:{
        id: userId
      }
    })
    if(!userExist){
      throw new BadRequestException("Data user tidak ditemukan")
    }

    // Login Update
  
    userExist.username = request.username
    userExist.password = request.password

    return await this.userRepository.update(userId, userExist )
  }

  createUser(request: CreateUserDto){
    const user = this.userRepository.create(request)
    return this.userRepository.save(user)
  }

  findUsersById(id:number){
    return this.userRepository.findOne({where:{id}})
  }
  
  findUsersByUsername(username:string){
    return this.userRepository.findOne({where:{username}})
  }

  async deleteUser(userId: number) {
    // get existing data
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      }
    })

    if(!user) {
      throw new BadRequestException('User tidak di temukan');
    }

    // execute delete query
    this.userRepository.remove(user);
  }
}