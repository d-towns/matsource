# Voice AI Appointment Setter

A microservice for making automated appointment setting calls using OpenAI's voice capabilities and Twilio.

## Features

- Makes automated outbound calls to leads captured from Facebook ads
- Uses natural language AI to conduct real-time conversations
- Sets appointments for home service businesses (roofing companies)
- Integrates with calendar systems
- Provides call analytics and success metrics

## Tech Stack

- Node.js & TypeScript
- Express.js
- MongoDB for data storage
- Twilio for voice calling
- OpenAI API for conversational AI
- JWT for authentication

## Prerequisites

- Node.js 18+ and npm
- MongoDB instance
- Twilio account with phone number
- OpenAI API key with access to Voice API

## Installation

1. Clone the repository
2. Install dependencies:
```bash
cd voice-ai-service
npm install
```
3. Copy the example environment file and update with your credentials:
```bash
cp .env.example .env
# Update .env with your credentials
```

## Development

Start the development server:

```bash
npm run dev
```

## Building for Production

Build the TypeScript code:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/leads | Register a new lead from form submission |
| POST | /api/calls/initiate | Manually trigger a call to a lead |
| GET | /api/calls/:id | Get status and details of a specific call |
| GET | /api/appointments | List all appointments |
| GET | /api/metrics | Get system performance metrics |

## Environment Variables

- `PORT`: Server port (default: 3001)
- `MONGODB_URI`: MongoDB connection string
- `TWILIO_ACCOUNT_SID`: Twilio account SID
- `TWILIO_AUTH_TOKEN`: Twilio authentication token
- `TWILIO_PHONE_NUMBER`: Twilio phone number for outbound calls
- `OPENAI_API_KEY`: OpenAI API key
- `JWT_SECRET`: Secret for JWT authentication
- `LOG_LEVEL`: Winston logger level

## Testing

Run tests:

```bash
npm test
```

## License

MIT 