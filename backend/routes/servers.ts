import express, { Router, Request, Response } from 'express';
import PterodactylClient from '../api/pterodactyl';
import { authenticate } from '../middleware/auth';

const router = Router();

// Initialize Pterodactyl client
const pterodactyl = new PterodactylClient(
  process.env.PTERODACTYL_URL || '',
  process.env.PTERODACTYL_API_KEY || ''
);

// Get all servers
router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    const servers = await pterodactyl.getServers();
    res.json(servers);
  } catch (error) {
    console.error('Error fetching servers:', error);
    res.status(500).json({ error: 'Failed to fetch servers' });
  }
});

// Get specific server
router.get('/:serverId', authenticate, async (req: Request, res: Response) => {
  try {
    const { serverId } = req.params;
    const server = await pterodactyl.getServer(serverId);
    res.json(server);
  } catch (error) {
    console.error('Error fetching server:', error);
    res.status(500).json({ error: 'Failed to fetch server' });
  }
});

// Get server stats/status
router.get('/:serverId/stats', authenticate, async (req: Request, res: Response) => {
  try {
    const { serverId } = req.params;
    const stats = await pterodactyl.getServerStats(serverId);
    res.json(stats);
  } catch (error) {
    console.error('Error fetching server stats:', error);
    res.status(500).json({ error: 'Failed to fetch server stats' });
  }
});

// Send command to server
router.post('/:serverId/command', authenticate, async (req: Request, res: Response) => {
  try {
    const { serverId } = req.params;
    const { command } = req.body;

    if (!command) {
      return res.status(400).json({ error: 'Command is required' });
    }

    await pterodactyl.sendCommand(serverId, command);
    res.json({ success: true, message: 'Command sent successfully' });
  } catch (error) {
    console.error('Error sending command:', error);
    res.status(500).json({ error: 'Failed to send command' });
  }
});

// Start server (send start command)
router.post('/:serverId/start', authenticate, async (req: Request, res: Response) => {
  try {
    const { serverId } = req.params;
    await pterodactyl.sendCommand(serverId, 'start');
    res.json({ success: true, message: 'Server starting...' });
  } catch (error) {
    console.error('Error starting server:', error);
    res.status(500).json({ error: 'Failed to start server' });
  }
});

// Stop server
router.post('/:serverId/stop', authenticate, async (req: Request, res: Response) => {
  try {
    const { serverId } = req.params;
    await pterodactyl.sendCommand(serverId, 'stop');
    res.json({ success: true, message: 'Server stopping...' });
  } catch (error) {
    console.error('Error stopping server:', error);
    res.status(500).json({ error: 'Failed to stop server' });
  }
});

// Restart server
router.post('/:serverId/restart', authenticate, async (req: Request, res: Response) => {
  try {
    const { serverId } = req.params;
    await pterodactyl.sendCommand(serverId, 'restart');
    res.json({ success: true, message: 'Server restarting...' });
  } catch (error) {
    console.error('Error restarting server:', error);
    res.status(500).json({ error: 'Failed to restart server' });
  }
});

// Create new server
router.post('/', authenticate, async (req: Request, res: Response) => {
  try {
    const serverData = req.body;
    const newServer = await pterodactyl.createServer(serverData);
    res.status(201).json(newServer);
  } catch (error) {
    console.error('Error creating server:', error);
    res.status(500).json({ error: 'Failed to create server' });
  }
});

// Delete server
router.delete('/:serverId', authenticate, async (req: Request, res: Response) => {
  try {
    const { serverId } = req.params;
    const { force } = req.query;

    if (force === 'true') {
      await pterodactyl.forceDeleteServer(serverId);
    } else {
      await pterodactyl.deleteServer(serverId);
    }

    res.json({ success: true, message: 'Server deleted successfully' });
  } catch (error) {
    console.error('Error deleting server:', error);
    res.status(500).json({ error: 'Failed to delete server' });
  }
});

export default router;