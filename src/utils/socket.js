const socketIO = require('socket.io');

function createSocketManager() {
  let io;

  return {
    init: (httpServer, options) => {
      io = socketIO(httpServer, options);
      return io;
    },
    getIO: () => {
      if (!io) {
        throw new Error("Socket.io not initialized!");
      }
      return io;
    }
  };
}

module.exports = createSocketManager();
