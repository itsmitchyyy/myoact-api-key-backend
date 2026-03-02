import type { Request, Response } from 'express';
import { graphql } from 'graphql';
import { AppContainer } from '../../../infrastructure/config/container';
import { buildSchema } from '../../http/graphql/schema';

function getGraphQLParams(req: Request): {
  query?: string;
  variables?: any;
  operationName?: string;
} {
  if (req.method === 'GET') {
    return {
      query: typeof req.query.query === 'string' ? req.query.query : undefined,
      variables:
        typeof req.query.variables === 'string'
          ? JSON.parse(req.query.variables)
          : undefined,
      operationName:
        typeof req.query.operationName === 'string'
          ? req.query.operationName
          : undefined,
    };
  }

  return {
    query: req.body.query,
    variables: req.body.variables,
    operationName: req.body.operationName,
  };
}

export function graphqlExpressHandler(container: AppContainer) {
  const schema = buildSchema(container);

  return async (req: Request, res: Response) => {
    try {
      const { query, variables, operationName } = getGraphQLParams(req);

      if (!query) {
        return res
          .status(400)
          .json({ errors: [{ message: 'Missing GraphQL query' }] });
      }

      const result = await graphql({
        schema,
        source: query,
        variableValues: variables,
        operationName,
        contextValue: {
          authHeader: req.headers.authorization,
          requestId: req.header['x-request-id'],
        },
      });

      return res.status(result.errors?.length ? 400 : 200).json(result);
    } catch (error) {
      // IMPORTANT: if something already wrote to res, don't write again
      if (res.headersSent) return;

      return res.status(500).json({
        errors: [{ message: error?.message ?? 'Internal server error' }],
      });
    }
  };
}
