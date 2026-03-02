import type { AuthProvider, RegisterInput } from '../services/AuthProvider';

export class RegisterUser {
  constructor(private readonly auth: AuthProvider) {}

  async execute(fnName: string, input: RegisterInput) {
    const email = input.email?.trim().toLocaleLowerCase();
    const name = input.name?.trim();
    const password = input.password ?? '';

    if (!email || !email.includes('@')) throw new Error('Invalid email');
    if (!name) throw new Error('Name is required');
    if (password.length < 8)
      throw new Error('Password must be at least 8 characters long');

    return this.auth.register(fnName, { email, name, password });
  }
}
