import type { AuthProvider, LoginInput } from '../services/AuthProvider';

export class LoginUser {
  constructor(private readonly auth: AuthProvider) {}

  async execute(fnName: string, input: LoginInput) {
    const email = input.email?.trim().toLocaleLowerCase();
    const password = input.password ?? '';

    if (!email || !email.includes('@')) throw new Error('Invalid email');
    if (password.length < 8)
      throw new Error('Password must be at least 8 characters long');

    return this.auth.login(fnName, { email, password });
  }
}
