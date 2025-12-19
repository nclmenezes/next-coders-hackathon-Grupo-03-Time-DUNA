export interface Email {
  name: string;
  email: string;
  role: string;
  class: string;
  id: string;
}

export interface EmailPayload {
  name: string;
  to: string;
  type: number;
  message: string;
}
