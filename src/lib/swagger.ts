import { createSwaggerSpec } from 'next-swagger-doc';

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: 'src/app/api', // define api folder under app directory
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Event Calendar System API',
        version: '1.0',
        description: 'API documentation for the Event Calendar System. Note: Contains deliberate bugs for testing.',
      },
      components: {
        securitySchemes: {
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [],
    },
  });
  return spec;
};
