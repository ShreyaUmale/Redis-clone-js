const net = require('net');

// In-memory database
const store = {};
const expiry = {};

function isExpired(key) {
  if (expiry[key] && Date.now() > expiry[key]) {
    delete store[key];
    delete expiry[key];
    return true;
  }
  return false;
}

const server = net.createServer((socket) => {
  console.log('Client connected!');

  socket.on('data', (data) => {
    try {
      const input = data.toString().trim();
      const parts = input.split(' ');
      const command = parts[0].toUpperCase();

      if (command === 'SET') {
        const key = parts[1];
        const value = parts.slice(2).join(' ');
        if (!key || !value) {
          socket.write('ERROR: Usage: SET key value\n');
          return;
        }
        store[key] = value;
        delete expiry[key]; // remove old expiry if any
        socket.write('OK\n');
      } 
      else if (command === 'GET') {
        const key = parts[1];
        if (!key) {
          socket.write('ERROR: Usage: GET key\n');
          return;
        }
        if (isExpired(key)) {
          socket.write('(nil)\n');
          return;
        }
        const value = store[key];
        socket.write((value !== undefined ? value : '(nil)') + '\n');
      } 
      else if (command === 'DEL') {
        const key = parts[1];
        if (!key) {
          socket.write('ERROR: Usage: DEL key\n');
          return;
        }
        if (store[key] !== undefined) {
          delete store[key];
          delete expiry[key];
          socket.write('1\n');
        } else {
          socket.write('0\n');
        }
      }
      else if (command === 'EXPIRE') {
        const key = parts[1];
        const seconds = parseInt(parts[2]);
        if (!key || isNaN(seconds)) {
          socket.write('ERROR: Usage: EXPIRE key seconds\n');
          return;
        }
        if (store[key] === undefined) {
          socket.write('0\n');
          return;
        }
        expiry[key] = Date.now() + (seconds * 1000);
        socket.write('1\n');
      }
      else if (command === 'KEYS') {
        const allKeys = Object.keys(store).filter(k => !isExpired(k));
        socket.write((allKeys.length ? allKeys.join(' ') : '(empty)') + '\n');
      }
      else {
        socket.write('ERROR: Unknown command\n');
      }
    } catch (err) {
      console.error('Error handling command:', err.message);
      socket.write('ERROR: Something went wrong\n');
    }
  });

  socket.on('end', () => {
    console.log('Client disconnected');
  });

  socket.on('error', (err) => {
    console.error('Socket error:', err.message);
  });
});

const PORT = 7379;
server.listen(PORT, () => {
  console.log(`Redis clone server running on port ${PORT}`);
});