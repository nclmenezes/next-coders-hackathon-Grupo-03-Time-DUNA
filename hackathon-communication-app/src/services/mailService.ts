import { Email, EmailPayload } from '../types';
import { mockEmails } from './mockData';

// Simulated delay for API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class MailService {
  // Get all emails (simulated API call)
  async getMails(): Promise<Email[]> {
    await delay(500); // Simulate network delay
    return mockEmails;
  }

  // Send communication (simulated API call)
  async sendCommunication(payload: EmailPayload): Promise<number> {
    await delay(1000); // Simulate network delay
    
    console.log('Simulated email send:', payload);
    
    // Simulate success
    return 200;
  }
}

export default new MailService();
