const net = require('net');

const client = net.createConnection({ port: 7379 }, () => {
  console.log('Connected to server!');
  
  // Test SET
    client.write('KEYS\n');
});

client.on('data', (data) => {
  console.log('Server replied:', data.toString().trim());
  client.end();
});

client.on('end', () => {
  console.log('Disconnected from server');
});