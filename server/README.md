# Email Template API

A RESTful API service for managing email templates, variables, and partials with JSON-based storage.

## Features

- CRUD operations for email templates, variables, and partials
- File-based JSON database using lowdb
- Input validation using Joi
- Error handling middleware
- Cross-origin resource sharing (CORS) support
- Template variable management
- Reusable template partials
- Type-safe interfaces
- Automatic timestamp management

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

## Usage

Start the development server:
```bash
npm run dev
```

Start for production:
```bash
npm start
```

The server will run on `http://localhost:3000` by default.

## Project Structure

```
.
├── src/
│   ├── controllers/
│   │   ├── templateController.js
│   │   ├── variableController.js
│   │   └── partialController.js
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── routes/
│   │   ├── templateRoutes.js
│   │   ├── variableRoutes.js
│   │   └── partialRoutes.js
│   ├── validation/
│   │   └── schemas.js
│   ├── config/
│   │   └── db.js
│   └── index.js
├── db.json
├── package.json
└── README.md
```

## API Endpoints

### Templates

- `GET /api/templates` - Get all templates
- `GET /api/templates/:id` - Get a specific template
- `POST /api/templates` - Create a new template
- `PUT /api/templates/:id` - Update a template
- `DELETE /api/templates/:id` - Delete a template

### Variables

- `GET /api/variables` - Get all variables
- `GET /api/variables/:id` - Get a specific variable
- `POST /api/variables` - Create a new variable
- `PUT /api/variables/:id` - Update a variable
- `DELETE /api/variables/:id` - Delete a variable

### Partials

- `GET /api/partials` - Get all partials
- `GET /api/partials/:id` - Get a specific partial
- `POST /api/partials` - Create a new partial
- `PUT /api/partials/:id` - Update a partial
- `DELETE /api/partials/:id` - Delete a partial

## Data Models

### Template
```typescript
interface Template {
  id: string;
  name: string;
  content: string;
  variables: TemplateVariable[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Template Variable
```typescript
interface TemplateVariable {
  id: string;
  name: string;
  type: 'string' | 'number' | 'array' | 'json';
  defaultValue: any;
  description?: string;
  required: boolean;
}
```

### Template Partial
```typescript
interface TemplatePartial {
  id: string;
  name: string;
  content: string;
  description?: string;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## API Examples

### Templates

#### Create a Template
```bash
curl -X POST http://localhost:3000/api/templates \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Welcome Email",
    "content": "Hello {{userName}},\n\nWelcome to {{companyName}}!",
    "variables": [
      {
        "name": "userName",
        "type": "string",
        "defaultValue": "there",
        "required": true
      },
      {
        "name": "companyName",
        "type": "string",
        "defaultValue": "Our Company",
        "required": true
      }
    ]
  }'
```

#### Get All Templates
```bash
curl http://localhost:3000/api/templates
```

#### Get Template by ID
```bash
curl http://localhost:3000/api/templates/t1
```

### Variables

#### Create a Variable
```bash
curl -X POST http://localhost:3000/api/variables \
  -H "Content-Type: application/json" \
  -d '{
    "name": "orderTotal",
    "type": "number",
    "defaultValue": 0,
    "description": "Total order amount",
    "required": true
  }'
```

### Partials

#### Create a Partial
```bash
curl -X POST http://localhost:3000/api/partials \
  -H "Content-Type: application/json" \
  -d '{
    "name": "footer",
    "content": "Best regards,\nThe {{companyName}} Team",
    "description": "Standard email footer",
    "category": "general"
  }'
```

## Error Handling

The API uses standard HTTP status codes and returns error responses in the following format:

```json
{
  "status": "error",
  "statusCode": 400,
  "message": "Error message description"
}
```

Common HTTP Status Codes:
- 200: Success
- 201: Created
- 204: No Content
- 400: Bad Request
- 404: Not Found
- 500: Internal Server Error

## Validation

The API uses Joi for input validation. All requests are validated against predefined schemas:

- Template validation ensures:
  - Name is required and between 3-100 characters
  - Content is required
  - Variables array contains valid variable objects

- Variable validation ensures:
  - Name is required and between 1-50 characters
  - Type is one of: string, number, array, json
  - Default value is required
  - Required flag is boolean

- Partial validation ensures:
  - Name is required and between 3-100 characters
  - Content is required
  - Description and category are optional strings

## Development

### Technologies Used

- Express.js - Web framework
- lowdb - JSON file-based database
- Joi - Data validation
- express-async-handler - Async error handling
- http-errors - HTTP error creation
- CORS - Cross-Origin Resource Sharing support

### Best Practices

1. Error Handling
   - All errors are properly caught and formatted
   - Async operations use try-catch blocks
   - Custom error middleware for consistent error responses

2. Input Validation
   - All input is validated before processing
   - Custom validation schemas for each data type
   - Detailed error messages for invalid input

3. Database Operations
   - Atomic write operations
   - Data consistency checks
   - Automatic timestamp management

4. Code Organization
   - Modular architecture
   - Separation of concerns
   - Clear file structure

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT

## Author

[Your Name]

## Support

For support, email support@example.com or create an issue in the repository.</content>