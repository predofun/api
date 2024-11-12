import { ENVIRONMENT } from '../configs/environment';
import * as apiKey from '../../medix-424107-59f23af2a167.json';
import { Storage } from '@google-cloud/storage';
import {
  GenerativeModel,
  HarmBlockThreshold,
  HarmCategory,
  VertexAI,
} from '@google-cloud/vertexai';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Gemini {
  apiKey: string;
  model: GenerativeModel;
  vertexAI: VertexAI;
  constructor() {
    this.vertexAI = new VertexAI({
      project: apiKey.project_id,
      location: 'us-central1',
    });
    this.model = this.vertexAI.getGenerativeModel({
      model: 'gemini-1.5-flash-001',
      generationConfig: {
        maxOutputTokens: 8192,
        temperature: 1,
        topP: 0.95,
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    });
  }
  async uploadFile(file: Express.Multer.File, mimeType: string) {
    const storage = new Storage({
      projectId: apiKey.project_id,
      keyFilename: ENVIRONMENT.GOOGLE.CLOUD.API_KEY,
    });

    const bucket = storage.bucket('oneid-documents');

    const newFilename = `document_${Date.now()}`;
    const newFile = bucket.file(newFilename);

    try {
      await newFile.save(file.buffer, {
        contentType: mimeType,
        metadata: {
          cacheControl: 'public, max-age=31536000',
        },
      });

      console.log(`${file.originalname} uploaded to oneid-documents🎉`);

      return {
        name: newFilename,
        size: (file.size / (1024 * 1024)).toFixed(2),
        mimeType: file.mimetype,
        publicUrl: `https://storage.cloud.google.com/oneid-documents/${newFilename}`,
        url: `gs://oneid-documents/${newFilename}`,
      };
    } catch (error) {
      console.error('ERROR:', error);
    }
  }

  async verifyDocument(url: string, documentType: string) {
    const filePart = {
      fileData: {
        fileUri: url,
        mimeType: 'image/jpeg',
      },
    };

    const textPart = { text: this.getPromptForDocumentType(documentType) };

    const request = {
      contents: [{ role: 'user', parts: [filePart, textPart] }],
      generationConfig: {
        temperature: 0.95,
        topP: 1.0,
        maxOutputTokens: 8192,
        response_mime_type: 'application/json',
      },
    };

    const generativeModel = this.vertexAI.getGenerativeModel({
      model: 'gemini-1.5-flash-001',
      systemInstruction: {
        role: 'Document Verification AI',
        parts: [
          {
            text: `You are a document verification AI. Extract and verify information from identification documents.`,
          },
        ],
      },
    });

    const response = await generativeModel.generateContent(request);
    return JSON.parse(response.response.candidates[0].content.parts[0].text);
  }

  private getPromptForDocumentType(documentType: string): string {
    const prompts = {
      NIN: `Analyze this Nigerian National Identity Card image. Extract only these fields and provide a single confidence score in this json format:
            {
                "data": {
                    "fullName": "",
                    "ninNumber": "",
                    "dateOfBirth": "",
                    "gender": ""
                },
                "confidenceScore": 0.0  // number between 0 and 1
            }`,

      BVN: `Analyze this BVN document image. Extract only these fields and provide a single confidence score in this json format:
            {
                "data": {
                    "fullName": "",
                    "bvnNumber": "",
                    "dateOfBirth": "",
                    "gender": ""
                },
                "confidenceScore": 0.0  // number between 0 and 1
            }`,

      InternationalPassport: `Analyze this International Passport image. Extract only these fields and provide a single confidence score in this json format:
            {
                "data": {
                    "fullName": "",
                    "passportNumber": "",
                    "dateOfBirth": "",
                    "expiryDate": "",
                    "nationality": ""
                },
                "confidenceScore": 0.0  // number between 0 and 1
            }`,

      DriversLicense: `Analyze this Driver's License image. Extract only these fields and provide a single confidence score in this json format:
            {
                "data": {
                    "fullName": "",
                    "licenseNumber": "",
                    "dateOfBirth": "",
                    "expiryDate": "",
                    "class": ""
                },
                "confidenceScore": 0.0  // number between 0 and 1
            }`,

      VotersCard: `Analyze this Voter's Card image. Extract only these fields and provide a single confidence score in this json format:
            {
                "data": {
                    "fullName": "",
                    "vinNumber": "",
                    "gender": "",
                    "pollingUnit": ""
                },
                "confidenceScore": 0.0  // number between 0 and 1
            }`,
    };

    return (
      prompts[documentType] ||
      'Analyze this document and extract key information.'
    );
  }
}
