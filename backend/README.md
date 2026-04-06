# HostPanel Backend API

Backend API server for the Minecraft hosting panel with Pterodactyl integration.

## Setup

### Prerequisites
- Node.js 16+
- npm or yarn
- Pterodactyl Panel instance with admin API key

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Configure your environment variables in `.env`:
```env
PTERODACTYL_URL=https://your-panel.com
PTERODACTYL_API_KEY=your_api_key_here
FRONTEND_URL=http://localhost:5173
```

### Running

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm run build
npm start
```

## API Endpoints

### Authentication
All endpoints require Bearer token in Authorization header:
```
Authorization: Bearer <token>
```

### Server Endpoints

#### Get All Servers
```
GET /api/servers
```

#### Get Server Details
```
GET /api/servers/:serverId
```

#### Get Server Stats
```
GET /api/servers/:serverId/stats
```

Response includes:
- CPU usage
- Memory usage
- Disk usage
- Network I/O

#### Send Console Command
```
POST /api/servers/:serverId/command
Content-Type: application/json

{
  "command": "say Hello World"
}
```

#### Start Server
```
POST /api/servers/:serverId/start
```

#### Stop Server
```
POST /api/servers/:serverId/stop
```

#### Restart Server
```
POST /api/servers/:serverId/restart
```

#### Create New Server
```
POST /api/servers
Content-Type: application/json

{
  "name": "My Server",
  "description": "My Minecraft Server",
  "user_id": 1,
  "egg_id": 1,
  "docker_image": "ghcr.io/pterodactyl/yolks:java_17",
  "limits": {
    "memory": 2048,
    "swap": 0,
    "disk": 5120,
    "cpu": 100,
    "io": 500
  },
  "feature_limits": {
    "databases": 1,
    "backups": 2,
    "allocations": 1
  },
  "allocation": {
    "default": 1
  }
}
```

#### Delete Server
```
DELETE /api/servers/:serverId?force=false
```

### Health Check
```
GET /health
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| PORT | Server port | No (default: 5000) |
| NODE_ENV | Environment (development/production) | No |
| FRONTEND_URL | Frontend URL for CORS | No |
| PTERODACTYL_URL | Pterodactyl panel URL | Yes |
| PTERODACTYL_API_KEY | Pterodactyl admin API key | Yes |
| ADMIN_USERS | Admin email addresses (comma-separated) | No |
| JWT_SECRET | JWT secret for authentication | No |

## Error Handling

All errors return JSON with error message:
```json
{
  "error": "Error message here"
}
```

## Pterodactyl Panel Setup

1. Login to your Pterodactyl panel as admin
2. Go to Admin > API
3. Create a new API token with admin permissions
4. Copy the API key to your `.env` file

## Development

### Project Structure
```
backend/
├── server.ts           # Main Express app
├── api/
│   └── pterodactyl.ts  # Pterodactyl client
├── routes/
│   └── servers.ts      # Server endpoints
├── middleware/
│   └── auth.ts         # Authentication
└── package.json
```

### Adding New Endpoints

1. Add the endpoint to `routes/servers.ts`
2. Use the `pterodactyl` client instance
3. Add authentication middleware
4. Handle errors properly

## Production Deployment

1. Build the project:
```bash
npm run build
```

2. Set environment variables on your server

3. Run the server:
```bash
npm start
```

## License

MIT
