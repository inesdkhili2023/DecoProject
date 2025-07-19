/* eslint-disable prettier/prettier */
// import { Strategy, Profile } from 'passport-facebook';
// import { Injectable } from "@nestjs/common";
// import { AuthService } from "../auth.service";
// import { PassportStrategy } from '@nestjs/passport';

// @Injectable()
// export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
//   constructor(private readonly authService: AuthService) {
//     super({
//       clientID: process.env.FACEBOOK_APP_ID,
//       clientSecret: process.env.FACEBOOK_APP_SECRET,
//       callbackURL: 'http://localhost:3000/auth/facebook/redirect',
//       profileFields: ['emails', 'name', 'photos'],
//       scope: ['email'], 
//     });
//   }

//   async validate(
//     accessToken: string,
//     refreshToken: string,
//     profile: Profile,
//     done: (err: any, user: any, info?: any) => void,
//   ): Promise<void> {
//     try {
//       const { name, emails, photos } = profile;

//       console.log('Facebook profile:', profile); 

//       if (!emails || emails.length === 0) {
//         throw new Error('No email returned from Facebook');
//       }

//       const user = await this.authService.validateOAuthLogin({
//         email: emails[0].value,
//         firstName: name?.givenName || '',
//         lastName: name?.familyName || '',
//         picture: photos?.[0]?.value || '',
//         provider:  'facebook',
//       });
//       done(null, user);
//     } catch (err) {
//       done(err, false);
//     }
//   }
// }