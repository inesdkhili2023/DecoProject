/* eslint-disable prettier/prettier */
declare global {
  namespace Express {
    type User = import('src/user/entities/user.entity').User; 
  }
}
