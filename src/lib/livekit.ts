import { AccessToken } from 'livekit-server-sdk';
export async function generateToken(roomName: string, identity: string, name: string, canPublish: boolean): Promise<string> {
  const at = new AccessToken(process.env.LIVEKIT_API_KEY!, process.env.LIVEKIT_API_SECRET!, { identity, name, ttl: '4h' });
  at.addGrant({ room: roomName, roomJoin: true, canPublish, canPublishData: true, canSubscribe: true, roomAdmin: canPublish, roomCreate: canPublish });
  return await at.toJwt();
}
export const generateRoomName = (streamId: string) => `iqra-${streamId}`;
