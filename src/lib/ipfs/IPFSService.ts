import { create } from 'ipfs-http-client';
import pinataSDK from '@pinata/sdk';

interface AlertData {
  details: string;
  timestamp: number;
  location: {
    latitude: number;
    longitude: number;
  };
}

export class IPFSService {
  private ipfs: any;
  private pinata: any;

  constructor(ipfsGateway: string, pinataApiKey: string, pinataSecretKey: string) {
    this.ipfs = create({ url: ipfsGateway });
    this.pinata = pinataSDK(pinataApiKey, pinataSecretKey);
  }

  public async uploadAlertToIPFS(alertData: AlertData): Promise<string> {
    try {
      // Convert alert data to JSON
      const data = JSON.stringify(alertData);
      
      // Upload to IPFS
      const { cid } = await this.ipfs.add(data);
      
      // Pin to Pinata
      await this.pinata.pinByHash(cid.toString());
      
      return cid.toString();
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
      throw error;
    }
  }

  public async retrieveAlertFromIPFS(cid: string): Promise<AlertData> {
    try {
      const chunks = [];
      for await (const chunk of this.ipfs.cat(cid)) {
        chunks.push(chunk);
      }
      
      const data = Buffer.concat(chunks).toString();
      return JSON.parse(data);
    } catch (error) {
      console.error('Error retrieving from IPFS:', error);
      throw error;
    }
  }
} 