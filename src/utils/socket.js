const socketIO = require('socket.io');

/**
 * Creates and initializes the socket manager.
 * @returns {Object} Socket manager with init and getIO methods.
 */
function createSocketManager() {
  let io;

  return {
    init: (httpServer, options) => {
      io = socketIO(httpServer, options);
      

      const newsNamespace = io.of('/news');

      newsNamespace.on('connection', (socket) => {
        console.log(`User connected to news namespace: ${socket.id}`);

        socket.on('newsCreated', (news) => {
          newsNamespace.emit('newsCreated', news);
        });


        socket.on('newsUpdated', (news) => {
          newsNamespace.emit('newsUpdated', news);
        });


        socket.on('newsDeleted', ({ id, title }) => {
          newsNamespace.emit('newsDeleted', { id, title });
        });

        socket.on('disconnect', () => {
          console.log(`User disconnected from news namespace: ${socket.id}`);
        });
      });

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
