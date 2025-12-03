import { GameSession } from '../models/stats';

const DISCORD_API = 'https://discord.com/api';

export interface DiscordConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export async function exchangeDiscordCode(code: string, config: DiscordConfig): Promise<string> {
  const response = await fetch(`${DISCORD_API}/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      grant_type: 'authorization_code',
      redirect_uri: config.redirectUri,
      code,
    }).toString(),
  });
  const payload = await response.json();
  return payload.access_token as string;
}

export async function fetchDiscordGameSessions(token: string): Promise<GameSession[]> {
  const response = await fetch(`${DISCORD_API}/users/@me/guilds`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const guilds: { id: string; name: string }[] = await response.json();

  const sessions: GameSession[] = [];
  for (const guild of guilds) {
    const activityResponse = await fetch(`${DISCORD_API}/guilds/${guild.id}/members/@me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const member = await activityResponse.json();
    const gameActivity = member?.presence?.activities?.find((activity: any) => activity.type === 0);
    if (gameActivity) {
      sessions.push({
        id: `${guild.id}-${gameActivity.id}-${gameActivity.created_at}`,
        platform: 'discord',
        title: gameActivity.name,
        durationMinutes: Math.max(1, Math.round((Date.now() - gameActivity.created_at) / 60000)),
        timestamp: new Date(gameActivity.created_at).toISOString(),
        guildName: guild.name,
      });
    }
  }

  return sessions;
}
