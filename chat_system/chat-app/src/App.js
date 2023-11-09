import React, { useEffect } from 'react';
import io from 'socket.io-client';

const App = () => {
  useEffect(() => {
    const socket = io('http://localhost:8080');
    socket.on('connect', () => {
      console.log('Connected to the server');
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      {/* Your React app content */}
    </div>
  );
};

export default App;
