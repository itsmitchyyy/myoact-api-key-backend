export type AuthResult = {
  token: string;
  user: { id: string; email: string; name?: string };
};

export type RegisterInput = { email: string; name: string; password: string };
export type LoginInput = { email: string; password: string };

export interface AuthProvider {
  register(fnName: string, input: RegisterInput): Promise<AuthResult>;
  login(fnName: string, input: LoginInput): Promise<AuthResult>;
}
