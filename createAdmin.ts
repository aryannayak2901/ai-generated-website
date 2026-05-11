import { getPayload } from 'payload';
import config from './src/payload.config';

async function createAdmin() {
  const payload = await getPayload({ config });
  
  try {
    const user = await payload.create({
      collection: 'users',
      data: {
        email: 'admin@chambers.com',
        password: 'password123',
      },
    });
    console.log('Admin user created successfully:', user.email);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Failed to create admin:', error.message);
    } else {
      console.error('Failed to create admin:', error);
    }
  }
  process.exit(0);
}

createAdmin();
