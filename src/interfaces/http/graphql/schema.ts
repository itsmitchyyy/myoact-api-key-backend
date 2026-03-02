import {
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';
import {
  LoginInput,
  RegisterInput,
} from 'src/application/services/AuthProvider';
import type { AppContainer } from 'src/infrastructure/config/container';

export function buildSchema(container: AppContainer): GraphQLSchema {
  const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
      id: { type: new GraphQLNonNull(GraphQLID) },
      email: { type: new GraphQLNonNull(GraphQLString) },
      name: { type: GraphQLString },
    },
  });

  const AuthPayloadType = new GraphQLObjectType({
    name: 'AuthPayload',
    fields: {
      token: { type: new GraphQLNonNull(GraphQLString) },
      user: { type: new GraphQLNonNull(UserType) },
    },
  });

  const RegisterInput = new GraphQLInputObjectType({
    name: 'RegisterInput',
    fields: {
      email: { type: new GraphQLNonNull(GraphQLString) },
      name: { type: new GraphQLNonNull(GraphQLString) },
      password: { type: new GraphQLNonNull(GraphQLString) },
    },
  });

  const LoginInput = new GraphQLInputObjectType({
    name: 'LoginInput',
    fields: {
      email: { type: new GraphQLNonNull(GraphQLString) },
      password: { type: new GraphQLNonNull(GraphQLString) },
    },
  });

  const MutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      register: {
        type: new GraphQLNonNull(AuthPayloadType),
        args: { input: { type: new GraphQLNonNull(RegisterInput) } },
        resolve: async (_, { input }: { input: RegisterInput }) => {
          const fnName = process.env.AWS_LAMBDA_REGISTER_USER_FUNCTION_NAME;
          if (!fnName) throw new Error('AUTH_LAMBDA_NAME is not set');
          return container.registerUser.execute(fnName, input);
        },
      },
      login: {
        type: new GraphQLNonNull(AuthPayloadType),
        args: { input: { type: new GraphQLNonNull(LoginInput) } },
        resolve: async (_, { input }: { input: LoginInput }) => {
          const fnName = process.env.AWS_LAMBDA_LOGIN_USER_FUNCTION_NAME;
          if (!fnName) throw new Error('AUTH_LAMBDA_NAME is not set');
          return container.loginUser.execute(fnName, input);
        },
      },
    },
  });

  const QueryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
      health: { type: new GraphQLNonNull(GraphQLString), resolve: () => 'ok' },
    },
  });

  return new GraphQLSchema({
    query: QueryType,
    mutation: MutationType,
  });
}
