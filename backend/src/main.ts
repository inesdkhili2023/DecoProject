import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthService } from './auth/auth.service';
import { getRepository } from 'typeorm';
import { supabase } from './supabase/supabase.client';
import { User } from './user/entities/user.entity';
import * as express from 'express';
import * as multer from 'multer';

async function cleanupExistingUser() {

  try {
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) throw listError;

    const user = users.users.find(u => u.email === 'aymenbenhmida219@gmail.com');

    if (user) {
      const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
      if (deleteError) throw deleteError;

      console.log('Existing user deleted from Supabase Auth'); //Debug 

    }

    const userRepository = getRepository(User);
    await userRepository.delete({ email: 'aymenbenhmida219@gmail.com' });
    
    console.log('Existing user deleted from User table'); //Debug 

  } catch (error) {

    console.error('Cleanup error:', error.message); //Debug 

    throw error;
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuration for file processing
  app.use(express.json({ limit: '500mb' })); 
  app.use(express.urlencoded({ extended: true, limit: '500mb' })); 

  // Custom middleware for logging multipart requests
  app.use((req, res, next) => {

    if (req.headers['content-type']?.includes('multipart/form-data')) {

      console.log('Multipart request detected'); //Debug 
      console.log('Content-Type:', req.headers['content-type']); //Debug 
      console.log('Content-Length:', req.headers['content-length']); //Debug 
    }
    next();
  });

  // Configuration CORS
  app.enableCors({
    origin: 'http://localhost:4200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'] 
  });

  // User cleaning if necessary
  if (process.env.RESET_SUPER_ADMIN === 'true') {
    try {
      await cleanupExistingUser();
    } catch (error) {

      console.log('ℹNo user to clean or cleanup error'); //Debug 
    }
  }

  // Creation of the super admin
  try {
    const authService = app.get(AuthService);
    await authService.createInitialSuperAdmin();

    console.log('SUPER_ADMIN checked/created successfully'); //Debug 

  } catch (error) {

    console.error('SUPER_ADMIN creation error:', error.message); //Debug 
  }

  await app.listen(process.env.PORT ?? 3000);

  console.log(`Application running on port ${process.env.PORT ?? 3000}`); //Debug 
}

bootstrap();