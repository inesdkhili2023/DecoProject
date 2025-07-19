/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TypeRole } from 'src/user/dto/enums/role.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('SUPABASE_JWT_SECRET')!, 
    });
  }

  validate(payload: any) {

    return { 
      idUser: payload.sub, 
      email: payload.email,
      role: payload.user_metadata?.role || TypeRole.CUSTOMER, 
     };
  }
  
}
