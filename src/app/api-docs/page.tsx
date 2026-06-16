import { getApiDocs } from '@/lib/swagger';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

export default async function ApiDoc() {
  const spec = await getApiDocs();
  return (
    <section className="container mx-auto mt-10 p-4">
      <SwaggerUI spec={spec} />
    </section>
  );
}
