import React, { useState, useEffect } from 'react';
import { useBlockchain } from '../contexts/BlockchainContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

export const BlockchainViewer: React.FC = () => {
  const { chain, isConnected, connectMetaMask, addAlert, blockchain } = useBlockchain();
  const [newAlertDetails, setNewAlertDetails] = useState('');
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
  const [alertData, setAlertData] = useState<any[]>([]);

  useEffect(() => {
    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  useEffect(() => {
    const loadAlertData = async () => {
      if (blockchain) {
        const data = await Promise.all(
          chain.map(async (block) => {
            if (block.ipfsCID !== 'Genesis Block') {
              const alert = await blockchain.getAlertData(block.ipfsCID);
              return { ...block, alert };
            }
            return block;
          })
        );
        setAlertData(data);
      }
    };

    loadAlertData();
  }, [chain, blockchain]);

  const handleAddAlert = async () => {
    if (newAlertDetails.trim()) {
      await addAlert({
        details: newAlertDetails,
        timestamp: Date.now(),
        location
      });
      setNewAlertDetails('');
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Blockchain Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className={isConnected ? 'text-green-500' : 'text-red-500'}>
              {isConnected ? 'Connected to MetaMask' : 'Not connected to MetaMask'}
            </p>
            
            {!isConnected && (
              <Button onClick={connectMetaMask}>
                Connect MetaMask
              </Button>
            )}

            {isConnected && (
              <div className="space-y-2">
                <textarea
                  value={newAlertDetails}
                  onChange={(e) => setNewAlertDetails(e.target.value)}
                  placeholder="Enter alert details"
                  className="w-full p-2 border rounded"
                  rows={3}
                />
                <Button onClick={handleAddAlert}>
                  Add Alert
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {alertData.map((block, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>Block #{block.index}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Hash:</strong> {block.hash}</p>
                <p><strong>Previous Hash:</strong> {block.previousHash}</p>
                <p><strong>Timestamp:</strong> {new Date(block.timestamp * 1000).toLocaleString()}</p>
                {block.alert && (
                  <>
                    <p><strong>Alert Details:</strong> {block.alert.details}</p>
                    <p><strong>Location:</strong> {block.alert.location.latitude}, {block.alert.location.longitude}</p>
                  </>
                )}
                <p><strong>Nonce:</strong> {block.nonce}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}; 