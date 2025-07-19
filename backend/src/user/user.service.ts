/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateOAuthUserDto } from './dto/create-OAuth-user-dto';
import { randomBytes } from 'crypto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  //Find user by email
  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { email } });
    return user || undefined;
  }

  //Validate user by email and password
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.findByEmail(email);
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  //Create a new user (Classic Registration)
  async create(userDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(userDto.password, 10);
    const user = this.userRepository.create({ ...userDto, password: hashedPassword });
    return await this.userRepository.save(user);
  }

  //Update user password
  async updatePassword(idUser: number, newHashedPassword: string) {
    await this.userRepository.update(idUser, { password: newHashedPassword });
  }

  //Find user by id
  async findById (idUser: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { idUser } });
    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${idUser} non trouvé`);
    }
    return user;
  }

  // Retrieve all users
  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  } 


  //Create a new user (Registration with Google/Facebook )
  async createOAuth(dto: CreateOAuthUserDto): Promise<User> {
    
    const existing = await this.findByEmail(dto.email);
    if (existing) {
      throw new BadRequestException('Un compte existe déjà pour cet email');
    }

    const randomPassword = randomBytes(16).toString('hex'); 
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    const user = this.userRepository.create();  

    user.email    = dto.email;
    user.name     = dto.name;
    user.lastName = dto.lastName;
    user.password = hashedPassword;
    user.phone    = '';
    user.address  = '';
    user.age      = 0;
    user.role     = dto.role;

    return this.userRepository.save(user);
  }

}

