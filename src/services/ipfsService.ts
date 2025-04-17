import axios from 'axios';

const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
const PINATA_API_SECRET = import.meta.env.VITE_PINATA_API_SECRET;
const PINATA_JWT = import.meta.env.VITE_PINATA_JWT;
const IPFS_GATEWAY = import.meta.env.VITE_IPFS_GATEWAY;

// Validate environment variables
if (!PINATA_JWT) {
  console.error('PINATA_JWT is not defined in environment variables');
}

interface SOSData {
  location: {
    latitude: number;
    longitude: number;
  };
  timestamp: number;
  userInfo: {
    name?: string;
    contact?: string;
  };
  emergencyDetails?: string;
}

export const pinJSONToIPFS = async (sosData: SOSData) => {
  try {
    console.log('Preparing to pin data to IPFS:', sosData);
    
    if (!PINATA_JWT) {
      throw new Error('Pinata JWT token is not configured. Please check your environment variables.');
    }
    
    const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';
    
    const response = await axios.post(
      url,
      {
        pinataContent: sosData,
        pinataMetadata: {
          name: `SOS_Alert_${new Date().toISOString()}`,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${PINATA_JWT}`,
        },
      }
    );

    console.log('IPFS pinning response:', response.data);
    return response.data.IpfsHash;
  } catch (error) {
    console.error('Error pinning to IPFS:', error);
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      });
    }
    throw error;
  }
};

export const getIPFSUrl = (ipfsHash: string) => {
  if (!IPFS_GATEWAY) {
    console.warn('IPFS_GATEWAY is not defined, using default gateway');
    return `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
  }
  return `https://${IPFS_GATEWAY}/ipfs/${ipfsHash}`;
}; 