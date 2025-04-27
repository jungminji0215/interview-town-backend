import swaggerJSDoc from 'swagger-jsdoc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: '면접 타운 API',
      version: '1.0.0',
      description: '면접 타운 백엔드 API 명세입니다.',
    },
  },
  apis: [
    path.join(__dirname, './schemas/*.yaml'),
  ],
});

export default swaggerSpec;