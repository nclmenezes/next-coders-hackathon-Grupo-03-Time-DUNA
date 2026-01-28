import { Email} from '../types';
import api from './Api';


class MailService {

  // Get all emails (simulated API call)
  async getMails(): Promise<Email[]> {
    const response=await api.get<Email[]>('/email');
    return response.data;
  }

  // POST - Criar [HttpPost("create")]
  async addEmail(data: { name: string; email: string; class: string; role: string }) {
    const response = await api.post('/email/create', data);
    return response.data;
  }

  // PUT - Atualizar [HttpPut("{id}")]
  async updateEmail(id: string, data: Partial<Email>) {
    const response = await api.put(`/email/${id}`, data);
    return response.data;
  }

  // DELETE - Remover [HttpDelete("{id}")]
  async deleteEmail(id: string) {
    const response = await api.delete(`/email/${id}`);
    return response.data;
  }
  
  async sendCommunication(payload: any): Promise<number> {
  // Criamos o objeto exatamente como o C# espera (EmailRequest)
  const emailRequest = {
    recipients: [payload.to], // O back espera uma lista de strings
    subject: `Comunicado para ${payload.name}`, // Ou o campo que for o assunto
    body: payload.message
  };

  const response = await api.post('/Email', emailRequest);
  return response.status;
}


  // rota de busca
  async searchEmails(term: string): Promise<Email[]> {
    const response=await api.get<Email[]>(`/email/search?term=${term}`);
    return response.data;
  }

  //rota de emails enviados
  async sentEmails(): Promise<any[]> {
    const response=await api.get('/Email/sent-emails');
    return response.data;
  }
}

export default new MailService();
