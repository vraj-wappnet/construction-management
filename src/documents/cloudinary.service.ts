// import { Inject, Injectable, Logger } from '@nestjs/common';
// import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';

// @Injectable()
// export class CloudinaryService {
//   private readonly logger = new Logger(CloudinaryService.name);

//   constructor(@Inject('CLOUDINARY') private cloudinary) {}

//   async uploadFile(
//     file: Express.Multer.File,
//     folder: string,
//     fileType: string,
//   ): Promise<string> {
//     try {
//       const resourceType = fileType.toLowerCase() === 'pdf' ? 'raw' : 'auto';
//       this.logger.log(
//         `Uploading file to Cloudinary: folder=${folder}, resource_type=${resourceType}, originalname=${file.originalname}, mimetype=${file.mimetype}`,
//       );

//       if (!file.mimetype.includes('pdf') && fileType.toLowerCase() === 'pdf') {
//         this.logger.error(
//           `Invalid file type: expected PDF, got ${file.mimetype}`,
//         );
//         throw new Error('Invalid file type: PDF required');
//       }
//       if (file.size > 10 * 1024 * 1024) {
//         this.logger.error(`File size exceeds 10MB: ${file.size} bytes`);
//         throw new Error('File size exceeds 10MB limit');
//       }

//       const result: UploadApiResponse = await new Promise((resolve, reject) => {
//         const stream = this.cloudinary.uploader.upload_stream(
//           { folder, resource_type: resourceType },
//           (error, result) => {
//             if (error) {
//               this.logger.error(`Cloudinary upload failed: ${error.message}`);
//               reject(new Error(`Cloudinary upload failed: ${error.message}`));
//             } else {
//               this.logger.log(
//                 `Upload successful on cloudinary: secure_url=${result?.secure_url}, public_id=${result?.public_id}, resource_type=${result?.resource_type}`,
//               );
//               resolve(result);
//             }
//           },
//         );
//         stream.end(file.buffer);
//       });

//       if (!result?.secure_url) {
//         this.logger.error('Cloudinary returned no secure_url');
//         throw new Error('Failed to retrieve secure_url from Cloudinary');
//       }

//       return result.secure_url;
//     } catch (error) {
//       this.logger.error(
//         `Failed to upload file to Cloudinary: ${error.message}`,
//       );
//       throw new Error(`Failed to upload file to Cloudinary: ${error.message}`);
//     }
//   }
// }

import { Inject, Injectable, Logger } from '@nestjs/common';
import { v2, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

// Define a minimal interface for the Cloudinary instance
interface Cloudinary {
  uploader: {
    upload_stream: (
      options: { folder: string; resource_type: string },
      callback: (
        error: UploadApiErrorResponse | undefined,
        result: UploadApiResponse | undefined,
      ) => void,
    ) => any;
  };
  utils: {
    api_sign_request: (params: any, apiSecret: string) => string;
  };
}

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);

  constructor(@Inject('CLOUDINARY') private cloudinary: Cloudinary) {}

  async uploadFile(
    file: Express.Multer.File,
    folder: string,
    fileType: string,
  ): Promise<string> {
    try {
      const resourceType = fileType.toLowerCase() === 'pdf' ? 'raw' : 'auto';
      this.logger.log(
        `Uploading file to Cloudinary: folder=${folder}, resource_type=${resourceType}, originalname=${file.originalname}, mimetype=${file.mimetype}`,
      );

      if (!file.mimetype.includes('pdf') && fileType.toLowerCase() === 'pdf') {
        this.logger.error(
          `Invalid file type: expected PDF, got ${file.mimetype}`,
        );
        throw new Error('Invalid file type: PDF required');
      }
      if (file.size > 10 * 1024 * 1024) {
        this.logger.error(`File size exceeds 10MB: ${file.size} bytes`);
        throw new Error('File size exceeds 10MB limit');
      }

      const result: UploadApiResponse = await new Promise((resolve, reject) => {
        const stream = this.cloudinary.uploader.upload_stream(
          { folder, resource_type: resourceType },
          (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
            if (error || !result) {
              const errorMessage = error ? error.message : 'No result from Cloudinary';
              this.logger.error(`Cloudinary upload failed: ${errorMessage}`);
              reject(new Error(`Cloudinary upload failed: ${errorMessage}`));
            } else {
              this.logger.log(
                `Upload successful: secure_url=${result.secure_url}, public_id=${result.public_id}, resource_type=${result.resource_type}`,
              );
              resolve(result);
            }
          },
        );
        stream.end(file.buffer);
      });

      if (!result.secure_url) {
        this.logger.error('Cloudinary returned no secure_url');
        throw new Error('Failed to retrieve secure_url from Cloudinary');
      }

      return result.secure_url;
    } catch (error) {
      this.logger.error(
        `Failed to upload file to Cloudinary: ${(error as Error).message}`,
      );
      throw new Error(`Failed to upload file to Cloudinary: ${(error as Error).message}`);
    }
  }

  async generateSignedUrl(filePath: string, fileType: string): Promise<string> {
    try {
      const publicId = this.extractPublicId(filePath);
      const resourceType = fileType.toLowerCase() === 'pdf' ? 'raw' : 'image';
      const transformation = 'fl_attachment';

      const apiSecret = process.env.CLOUDINARY_API_SECRET;
      if (!apiSecret) {
        this.logger.error('CLOUDINARY_API_SECRET is not defined');
        throw new Error('CLOUDINARY_API_SECRET is not defined');
      }

      const apiKey = process.env.CLOUDINARY_API_KEY;
      if (!apiKey) {
        this.logger.error('CLOUDINARY_API_KEY is not defined');
        throw new Error('CLOUDINARY_API_KEY is not defined');
      }

      const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
      if (!cloudName) {
        this.logger.error('CLOUDINARY_CLOUD_NAME is not defined');
        throw new Error('CLOUDINARY_CLOUD_NAME is not defined');
      }

      const timestamp = Math.round(new Date().getTime() / 1000);
      const paramsToSign = {
        public_id: publicId,
        transformation,
        resource_type: resourceType,
        timestamp,
      };

      const signature = this.cloudinary.utils.api_sign_request(paramsToSign, apiSecret);
      const baseUrl = `https://res.cloudinary.com/${cloudName}/${resourceType}/upload/${transformation}/${publicId}`;
      const signedUrl = `${baseUrl}?api_key=${apiKey}&signature=${signature}×tamp=${timestamp}`;

      this.logger.log(`Generated signed URL: ${signedUrl}`);
      return signedUrl;
    } catch (error) {
      this.logger.error(`Failed to generate signed URL: ${(error as Error).message}`);
      throw new Error(`Failed to generate signed URL: ${(error as Error).message}`);
    }
  }

  private extractPublicId(filePath: string): string {
    const match = filePath.match(/\/(image|raw)\/upload\/(?:v\d+\/)?(.+?)(\.[a-zA-Z0-9]+)?$/);
    if (!match) {
      this.logger.error(`Invalid Cloudinary URL: ${filePath}`);
      throw new Error(`Invalid Cloudinary URL: ${filePath}`);
    }
    const publicId = match[2];
    this.logger.log(`Extracted publicId: ${publicId} from filePath: ${filePath}`);
    return publicId;
  }
}