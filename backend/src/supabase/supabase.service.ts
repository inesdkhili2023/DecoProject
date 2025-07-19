/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Express } from "express";
import slugify from "slugify";

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;
  private readonly targetBucket = 'product-images';
  private readonly uploadTimeout = 30000; // 30s
  private readonly pdfUploadTimeout = 60000; // 60s

  constructor(private configService: ConfigService) {
    const url = this.configService.get<string>('SUPABASE_URL');
    const key = this.configService.get<string>('SUPABASE_KEY');
  
    if (!url || !key) {
      throw new Error('Supabase URL or Key is not defined in environment variables');
    }

    this.supabase = createClient(url, key, {
      auth: {
        persistSession: false,
      },
    });
  }

  private async withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    const timeout = new Promise<T>((_, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Operation timed out after ${ms}ms`));
      }, ms).unref();
    });

    return Promise.race([promise, timeout]);
  }

  // Upload Product Image 
  async uploadProductImage(
    file: Express.Multer.File,
    token: string,
    categoryName: string,
    productId: number
  ): Promise<string> {
    // 1. Token verification with timeout
    const { data: { user }, error: authError } = await this.withTimeout(
      this.supabase.auth.getUser(token),
      this.uploadTimeout
    );
    
    if (authError || !user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    // 2. Cleaning up names
    const originalName = file.originalname;
    const decodedName = Buffer.from(originalName, 'binary').toString('utf8');
    
    // Category name cleanup
    const cleanCategoryName = categoryName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .toLowerCase();

    // 3. Preparing the file name
    const extension = decodedName.split('.').pop();
    const safeName = slugify(decodedName.replace(/\.[^/.]+$/, ''), { 
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g
    });

    // 4. Construction of the path
    const filePath = cleanCategoryName 
      ? `products/categories/${cleanCategoryName}/product_${productId}/${Date.now()}_${safeName}.${extension}`
      : `products/product_${productId}/${Date.now()}_${safeName}.${extension}`;

    // 5. Upload with timeout
    const uploadPromise = this.supabase.storage
      .from(this.targetBucket)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });

    const { error } = await this.withTimeout(uploadPromise, this.uploadTimeout);

    if (error) throw new Error(`Upload failed: ${error.message}`);
    
    return this.supabase.storage
      .from(this.targetBucket)
      .getPublicUrl(filePath).data.publicUrl;
  }

  // Upload Brand Image 
  async uploadBrandImage(
    file: Express.Multer.File,
    token: string,
    brandId: number
  ): Promise<string> {
    // 1. Token verification with timeout
    const { data: { user }, error: authError } = await this.withTimeout(
      this.supabase.auth.getUser(token),
      this.uploadTimeout
    );
    
    if (authError || !user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    // 2. Cleaning up names
    const originalName = file.originalname;
    const decodedName = Buffer.from(originalName, 'binary').toString('utf8');
    
    // 3. Preparing the file name
    const extension = decodedName.split('.').pop();
    const safeName = slugify(decodedName.replace(/\.[^/.]+$/, ''), { 
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g
    });

    // 4. Construction of the path
    const filePath = `brands/brand_${brandId}/${Date.now()}_${safeName}.${extension}`;

    // 5. Upload with timeout
    const uploadPromise = this.supabase.storage
      .from(this.targetBucket)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });

    const { error } = await this.withTimeout(uploadPromise, this.uploadTimeout);

    if (error) throw new Error(`Upload failed: ${error.message}`);

    return this.supabase.storage
      .from(this.targetBucket)
      .getPublicUrl(filePath).data.publicUrl;
  }

  async uploadTechnicalSheet(
    file: Express.Multer.File,
    token: string,
    categoryName: string,
    productId: number
  ): Promise<string> {
    // Token verification with timeout
    const { data: { user }, error: authError } = await this.withTimeout(
      this.supabase.auth.getUser(token),
      this.pdfUploadTimeout
    );
    
    if (authError || !user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    // File type validation
    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException('Only PDF files are allowed for technical sheets');
    }

    // File size validation
    if (file.size > 500 * 1024 * 1024) {
      throw new Error('File exceeds 500MB limit');
    }

    // Category name cleanup
    const cleanCategoryName = categoryName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .toLowerCase();

    // File path construction
    const originalName = file.originalname;
    const safeName = slugify(originalName.replace('.pdf', ''), {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g
    });

    const filePath = `products/categories/${cleanCategoryName}/product_${productId}/technical_sheets/${Date.now()}_${safeName}.pdf`;

    // Upload with timeout
    const uploadPromise = this.supabase.storage
      .from(this.targetBucket)
      .upload(filePath, file.buffer, {
        contentType: 'application/pdf',
        upsert: false
      });

    const { error } = await this.withTimeout(uploadPromise, this.pdfUploadTimeout);

    if (error) throw new Error(`Technical sheet upload failed: ${error.message}`);
    
    return this.supabase.storage
      .from(this.targetBucket)
      .getPublicUrl(filePath).data.publicUrl;
  }
}