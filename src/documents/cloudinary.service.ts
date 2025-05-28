// // import { Inject, Injectable, Logger } from '@nestjs/common';
// // import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
// // import { Multer } from 'multer';

// // @Injectable()
// // export class CloudinaryService {
// //   private readonly logger = new Logger(CloudinaryService.name);

// //   constructor(@Inject('CLOUDINARY') private cloudinary) {}

// //   async uploadFile(file: Multer.File, folder: string, fileType: string): Promise<string> {
// //     try {
// //       const resourceType = fileType.toLowerCase() === 'pdf' ? 'raw' : 'auto';
// //       this.logger.log(`Uploading file to Cloudinary: folder=${folder}, resource_type=${resourceType}, originalname=${file.originalname}, mimetype=${file.mimetype}`);

// //       if (!file.mimetype.includes("pdf") && fileType.toLowerCase() === "pdf") {
// //         this.logger.error(`Invalid file type: expected PDF, got ${file.mimetype}`);
// //         throw new Error("Invalid file type: PDF required");
// //       }
// //       if (file.size > 10 * 1024 * 1024) {
// //         this.logger.error(`File size exceeds 10MB: ${file.size} bytes`);
// //         throw new Error("File size exceeds 10MB limit");
// //       }

// //       const result: UploadApiResponse = await new Promise((resolve, reject) => {
// //         const stream = this.cloudinary.uploader.upload_stream(
// //           { folder, resource_type: resourceType },
// //           (error, result) => {
// //             if (error) {
// //               this.logger.error(`Cloudinary upload failed: ${error.message}`);
// //               reject(new Error(`Cloudinary upload failed: ${error.message}`));
// //             } else {
// //               this.logger.log(`Upload successful: secure_url=${result.secure_url}, public_id=${result.public_id}, resource_type=${result.resource_type}`);
// //               resolve(result);
// //             }
// //           },
// //         );
// //         stream.end(file.buffer);
// //       });

// //       return result.secure_url;
// //     } catch (error) {
// //       this.logger.error(`Failed to upload file to Cloudinary: ${error.message}`);
// //       throw new Error(`Failed to upload file to Cloudinary: ${error.message}`);
// //     }
// //   }
// // }

// import { Inject, Injectable, Logger } from '@nestjs/common';
// import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';

// @Injectable()
// export class CloudinaryService {
//   private readonly logger = new Logger(CloudinaryService.name);

//   constructor(@Inject('CLOUDINARY') private cloudinary) {}

//   async uploadFile(file: Express.Multer.File, folder: string, fileType: string): Promise<string> { // Use Express.Multer.File
//     try {
//       const resourceType = fileType.toLowerCase() === 'pdf' ? 'raw' : 'auto';
//       this.logger.log(`Uploading file to Cloudinary: folder=${folder}, resource_type=${resourceType}, originalname=${file.originalname}, mimetype=${file.mimetype}`);

//       if (!file.mimetype.includes("pdf") && fileType.toLowerCase() === "pdf") {
//         this.logger.error(`Invalid file type: expected PDF, got ${file.mimetype}`);
//         throw new Error("Invalid file type: PDF required");
//       }
//       if (file.size > 10 * 1024 * 1024) {
//         this.logger.error(`File size exceeds 10MB: ${file.size} bytes`);
//         throw new Error("File size exceeds 10MB limit");
//       }

//       const result: UploadApiResponse = await new Promise((resolve, reject) => {
//         const stream = this.cloudinary.uploader.upload_stream(
//           { folder, resource_type: resourceType },
//           (error, result) => {
//             if (error) {
//               this.logger.error(`Cloudinary upload failed: ${error.message}`);
//               reject(new Error(`Cloudinary upload failed: ${error.message}`));
//             } else {
//               this.logger.log(`Upload successful: secure_url=${result.secure_url}, public_id=${result.public_id}, resource_type=${result.resource_type}`);
//               resolve(result);
//             }
//           },
//         );
//         stream.end(file.buffer);
//       });

//       return result.secure_url;
//     } catch (error) {
//       this.logger.error(`Failed to upload file to Cloudinary: ${error.message}`);
//       throw new Error(`Failed to upload file to Cloudinary: ${error.message}`);
//     }
//   }
// }

import { Inject, Injectable, Logger } from '@nestjs/common';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);

  constructor(@Inject('CLOUDINARY') private cloudinary) {}

  async uploadFile(file: Express.Multer.File, folder: string, fileType: string): Promise<string> {
    try {
      const resourceType = fileType.toLowerCase() === 'pdf' ? 'raw' : 'auto';
      this.logger.log(`Uploading file to Cloudinary: folder=${folder}, resource_type=${resourceType}, originalname=${file.originalname}, mimetype=${file.mimetype}`);

      if (!file.mimetype.includes('pdf') && fileType.toLowerCase() === 'pdf') {
        this.logger.error(`Invalid file type: expected PDF, got ${file.mimetype}`);
        throw new Error('Invalid file type: PDF required');
      }
      if (file.size > 10 * 1024 * 1024) {
        this.logger.error(`File size exceeds 10MB: ${file.size} bytes`);
        throw new Error('File size exceeds 10MB limit');
      }

      const result: UploadApiResponse = await new Promise((resolve, reject) => {
        const stream = this.cloudinary.uploader.upload_stream(
          { folder, resource_type: resourceType },
          (error, result) => {
            if (error) {
              this.logger.error(`Cloudinary upload failed: ${error.message}`);
              reject(new Error(`Cloudinary upload failed: ${error.message}`));
            } else {
              this.logger.log(`Upload successful: secure_url=${result?.secure_url}, public_id=${result?.public_id}, resource_type=${result?.resource_type}`);
              resolve(result);
            }
          },
        );
        stream.end(file.buffer);
      });

      if (!result?.secure_url) {
        this.logger.error('Cloudinary returned no secure_url');
        throw new Error('Failed to retrieve secure_url from Cloudinary');
      }

      return result.secure_url;
    } catch (error) {
      this.logger.error(`Failed to upload file to Cloudinary: ${error.message}`);
      throw new Error(`Failed to upload file to Cloudinary: ${error.message}`);
    }
  }
}