# Redis Clone in Node.js

A lightweight Redis-inspired in-memory key-value store built from scratch using Node.js and TCP sockets.

## 🚀 Features

- TCP client-server communication using Node.js `net` module
- In-memory key-value data storage
- Support for Redis-inspired commands:
  - `SET`
  - `GET`
  - `DEL`
  - `EXPIRE`
  - `KEYS`
- Automatic removal of expired keys when accessed
- Command validation and error handling
- Client and server implemented separately

## 🛠️ Technologies Used

- Node.js
- JavaScript
- Node.js `net` module
- TCP sockets

## 📁 Project Structure

```text
redis-clone-js/
├── client.js
├── server.js
├── package.json
└── README.md
