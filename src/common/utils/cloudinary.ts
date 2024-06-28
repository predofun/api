
import { ConflictException, NotFoundException } from '@nestjs/common';
import { ENVIRONMENT } from '../configs/environment';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: ENVIRONMENT.CLOUDINARY.CLOUD_NAME,
  api_key: ENVIRONMENT.CLOUDINARY.API_KEY,
  api_secret: ENVIRONMENT.CLOUDINARY.API_SECRET
});
export interface CustomFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  size: number;
  buffer: Buffer;
  mimetype: string;
}
export function validateImage(file: Express.Multer.File) {
  console.log(file);
  const allowedImageMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];
  if (!allowedImageMimeTypes.includes(file.mimetype)) {
    throw new ConflictException('Invalid Image type');
  }
}
export function removeUrlUnfriendlyCharacters(str: string): string {
  const unfriendlyCharacters = /[^a-zA-Z0-9-_.]/g;
  return str.replace(unfriendlyCharacters, '');
}
export function uploadFiles(
  area: string,
  files: Express.Multer.File[],
) {
  try {
    const promises = files.map((file) => {
      const newFilename = `coinswag_${area}_${Date.now()}`;
      return new Promise((resolve, reject) => {
        validateImage(file);

        // Compress the image using sharp
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: 'image',
              folder: `${area}`,
              public_id: newFilename,
            },
            (error, result) => {
              if (error) {
                reject(error);
                console.log(error);
                throw new NotFoundException('Error in uploading files');
              } else {
                resolve(result);
              }
            },
          )
          .end(file.buffer);
      });
    });

    return Promise.all(promises);
  } catch (error) {
    console.log(error)
    throw new ConflictException('Error in uploading files');
  }
}

