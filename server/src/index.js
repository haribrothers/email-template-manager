import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler.js';
import templateRoutes from './routes/templateRoutes.js';
import variableRoutes from './routes/variableRoutes.js';
import partialRoutes from './routes/partialRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/templates', templateRoutes);
app.use('/api/variables', variableRoutes);
app.use('/api/partials', partialRoutes);

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});