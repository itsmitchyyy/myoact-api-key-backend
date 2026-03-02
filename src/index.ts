import express from 'express';
import { buildContainer } from './infrastructure/config/container';
import { graphqlExpressHandler } from './interfaces/http/graphql/handler';

const app = express();
app.use(express.json());

const container = buildContainer(process.env);

app.all('/graphql', graphqlExpressHandler(container));
app.get('/health', (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Local server running at http://localhost:${PORT}/graphql`);
});
