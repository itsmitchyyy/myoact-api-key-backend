import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import type {
  AuthProvider,
  AuthResult,
  LoginInput,
  RegisterInput,
} from '../../application/services/AuthProvider';

type LambdaResponse<T> =
  | { ok: true; data: T }
  | { ok: false; error: { message: string; code?: string } };

export class LambdaAuthProvider implements AuthProvider {
  private readonly client: LambdaClient;

  constructor(private readonly region?: string) {
    this.client = new LambdaClient({ region: this.region });
  }

  async register(fnName: string, input: RegisterInput): Promise<AuthResult> {
    return this.invoke<AuthResult>(fnName, {
      type: 'register',
      input,
    });
  }

  async login(fnName: string, input: LoginInput): Promise<AuthResult> {
    return this.invoke<AuthResult>(fnName, {
      type: 'login',
      input,
    });
  }

  private async invoke<T>(functionName: string, body: unknown): Promise<T> {
    const cmd = new InvokeCommand({
      FunctionName: functionName,
      InvocationType: 'RequestResponse',
      Payload: new TextEncoder().encode(JSON.stringify(body)),
    });

    const res = await this.client.send(cmd);

    if (res.FunctionError) {
      const raw = res.Payload ? new TextDecoder().decode(res.Payload) : '';
      throw new Error(
        `Auth lambda failed (${res.FunctionError}): ${raw || 'no payload'}`,
      );
    }

    const payloadText = res.Payload
      ? new TextDecoder().decode(res.Payload)
      : '';
    if (!payloadText) throw new Error('Auth lambda returned no payload');

    let parsed: LambdaResponse<T>;

    try {
      parsed = JSON.parse(payloadText) as LambdaResponse<T>;
    } catch (error) {
      throw new Error(`Auth lambda returned invalid JSON: ${payloadText}`);
    }

    if (parsed.ok === false)
      throw new Error(parsed.error?.message ?? 'Auth lambda error');

    return parsed.data as unknown as T;
  }
}
