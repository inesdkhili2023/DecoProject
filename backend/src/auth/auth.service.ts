/* eslint-disable prettier/prettier */

import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { supabase } from 'src/supabase/supabase.client';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { TypeRole } from 'src/user/dto/enums/role.enum';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}


  // Initial creation of SUPER_ADMIN
async createInitialSuperAdmin() {
  const RESET = process.env.RESET_SUPER_ADMIN === 'true';

  // 1. Checking in the database
  const exists: User | null = await this.userRepository.findOne({
    where: { role: TypeRole.SUPER_ADMIN },
  });

  // 2. Checking in Supabase Auth
  const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) throw listError;

  const userInAuth = existingUsers.users.find(
    u => u.email === 'aymenbenhmida219@gmail.com'
  );

  // Case: if RESET_SUPER_ADMIN is enabled
  if (RESET) {
    if (userInAuth) {
      await supabase.auth.admin.deleteUser(userInAuth.id);

      console.log('SUPER_ADMIN removed from Supabase Auth'); //Debug
    }

    if (exists) {
      await this.userRepository.delete(exists.idUser); 

      console.log('SUPER_ADMIN deleted from database'); //Debug
    }
  }

  // Repeat checks after possible deletion
  const newExists: User | null = await this.userRepository.findOne({
    where: { role: TypeRole.SUPER_ADMIN },
  });

  const { data: usersAfterReset } = await supabase.auth.admin.listUsers();
  const newUserInAuth = usersAfterReset.users.find(
    u => u.email === 'aymenbenhmida219@gmail.com'
  );

  //Create only if absent
  if (!newExists || !newUserInAuth) {
    try {
      // Create in Supabase Auth
      if (!newUserInAuth) {
        const { error: authError } = await supabase.auth.admin.createUser({
          email: 'aymenbenhmida219@gmail.com',
          password: 'superadmin52@aymen',
          email_confirm: true,
          user_metadata: {
            role: 'SUPER_ADMIN',
            name: 'Super Admin',
          },
        });
        if (authError) throw authError;

        console.log('SUPER_ADMIN created in Supabase Auth'); // Debug
      }

      // Create in database
      if (!newExists) {
        await this.userRepository.save({
          name: 'Super',
          lastName: 'Admin',
          email: 'aymenbenhmida219@gmail.com',
          phone: '+123456789',
          address: 'Admin Address',
          age: 30,
          role: TypeRole.SUPER_ADMIN,
          password: await bcrypt.hash('superadmin52@aymen', 10),
        });

        console.log('SUPER_ADMIN added to database'); // Debug
      }
    } catch (error) {

      console.error('Error creating SUPER_ADMIN:', error.message); // Debug
      throw error;
    }

  } else {
    console.log('UPER_ADMIN already exists in the database and in Supabase Auth'); // Debug
  }
}





  // Sign Up
  async signUp(dto: CreateUserDto) {
    const { email, password, name, lastName, phone, address, age, role } = dto;

    // SUPER_ADMIN verification
    if (role === TypeRole.SUPER_ADMIN) {
      const superAdminExists = await this.userRepository.findOne({
        where: { role: TypeRole.SUPER_ADMIN },
      });
      if (superAdminExists) {
        throw new BadRequestException('SuperAdmin account already exists');
      }
    }

    // Creating the user in Supabase Auth
    const { data: supabaseUser, error: supabaseError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name,
        role,
      },
    });

    if (supabaseError) throw new Error(supabaseError.message);

    // Creation of the user in our DB
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.userRepository.create({
      name,
      lastName,
      email,
      phone,
      address,
      age,
      role,
      password: hashedPassword,
    });

    await this.userRepository.save(newUser);

    return {
      message: 'User registered successfully',
      user: {
        id: supabaseUser.user.id,
        ...newUser,
      },
    };
  }



  //Sign In
  async signIn(email: string, password: string) {
  // Vérifie dans la base de données locale
  const user = await this.userRepository.findOne({ where: { email } });

  if (!user) {
    throw new UnauthorizedException('User not found');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizedException('Invalid credentials');
  }

  // Authentifie l'utilisateur via Supabase
  const { data: sessionData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new UnauthorizedException('Error signing in with Supabase');
  }

  // ✅ Structure claire et complète pour le frontend
  return {
    message: 'Sign in successful',
    user: {
      idUser: user.idUser,          // ✅ ID numérique pour la base locale
      email: user.email,
      name: user.name,
      lastName: user.lastName,
      role: user.role,
      phone: user.phone,
      address: user.address,
      age: user.age,
    },
    tokens: {
      access_token: sessionData.session.access_token,
      refresh_token: sessionData.session.refresh_token,
    },
    session: sessionData.session, // tu peux l'enlever si inutile
  };
}


  //  Old methods are not migrated with supabase
  async forgotPassword(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new BadRequestException('User not found');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:3000/reset-password', 
    });

    if (error) throw new BadRequestException('Error sending password reset email');

    return { message: 'Password reset email sent successfully' };
  }

  async resetPassword(newPassword: string, accessToken: string) {

  
  const { error: sessionError } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: '' 
  });

  if (sessionError) {
    throw new BadRequestException('Invalid or expired token');
  }

  
  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword
  });

  if (updateError) {
    throw new BadRequestException('Error resetting password: ' + updateError.message);
  }

  return { message: 'Password reset successfully' };
}



}






      //---------------------Ancien AuthService---------------------//

      // Validate user with email and password
      // async validateUser(email: string, password: string): Promise<any> {
      //   return this.userService.validateUser(email, password);
      // }


      // Login user with OAuth
      // login(user: User): any {
      //   const payload = {
      //     email: user.email,
      //     sub: user.idUser,
      //     role: user.role,
      //   };
      
      //   const access_token = this.jwtService.sign(payload);
      
      //   return {
      //     access_token,
      //     role: user.role,
      //     user: {
      //       id: user.idUser,
      //       name: user.name,
      //       lastName: user.lastName,
      //       email: user.email,
      //       phone: user.phone,
      //       address: user.address,
      //       age: user.age,
      //       role: user.role,
      //     },
      //   };
      // }
      
      
      //Register user 
      // async register(userDto: CreateUserDto) {

      //   console.log('📥 Enregistrement utilisateur DTO :', userDto);// ajout

      //   return this.userService.create(userDto);
      // }



      //Validate OAuth login
      // async validateOAuthLogin(oauthData: {
      //   email: string;
      //   firstName: string;
      //   lastName: string;
      //   picture: string;
      //   provider: 'google' | 'facebook';
      //  }) {

      //   let user = await this.userService.findByEmail(oauthData.email);

      //   if (!user) {
      //     user = await this.userService.createOAuth({
      //     email: oauthData.email,
      //     name: oauthData.firstName,
      //     lastName: oauthData.lastName,
      //     role: TypeRole.CUSTOMER,
      //   });
      // }

      // const payload = {
      //   email: user.email,
      //   sub: user.idUser,
      //   role: user.role,
      //   provider: oauthData.provider,
      // };

      // return {
      //   access_token: this.jwtService.sign(payload),
      //   user,
      // };

