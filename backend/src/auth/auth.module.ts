/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
// import { LocalStrategy } from './strategies/local.strategy';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { MailModule } from 'src/mail/mail.module';
import { MailService } from 'src/mail/mail.service';
// import { FacebookStrategy } from './strategies/facebook.strategy';
// import { GoogleStrategy } from './strategies/google.strategy';
import { SupabaseModule } from 'src/supabase/supabase.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [
    ConfigModule,
    MailModule,
    TypeOrmModule.forFeature([User]),
    UserModule,
    PassportModule,
    SupabaseModule, 
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): JwtModuleOptions => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, MailService],
    // providers: [AuthService, LocalStrategy, JwtStrategy, MailService, GoogleStrategy, FacebookStrategy],
  exports: [AuthService],
})
export class AuthModule {}
