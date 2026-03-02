import { LoginUser } from '../../application/usecases/LoginUser';
import { RegisterUser } from '../../application/usecases/RegisterUser';
import { LambdaAuthProvider } from '../services/LambdaAuthProvider';

export type AppContainer = {
  registerUser: RegisterUser;
  loginUser: LoginUser;
};

export function buildContainer(env: NodeJS.ProcessEnv): AppContainer {
  const region = env.AWS_REGION;

  const authProvider = new LambdaAuthProvider(region);

  return {
    registerUser: new RegisterUser(authProvider),
    loginUser: new LoginUser(authProvider),
  };
}
