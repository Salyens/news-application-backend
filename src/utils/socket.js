const socketIO = require('socket.io');

/**
 * Creates a socket manager to manage the Socket.io instance.
 * 
 * @returns {Object} An object with methods to initialize and retrieve the Socket.io instance.
 */
function createSocketManager() {
  let io;

  return {
    /**
     * Initializes the Socket.io instance with the provided HTTP server and options.
     * 
     * @param {Object} httpServer - The HTTP server to attach Socket.io to.
     * @param {Object} options - Configuration options for Socket.io.
     * @returns {Object} The initialized Socket.io instance.
     */
    init: (httpServer, options) => {
      io = socketIO(httpServer, options);
      return io;
    },

    /**
     * Retrieves the initialized Socket.io instance.
     * 
     * @throws {Error} If Socket.io is not initialized.
     * @returns {Object} The initialized Socket.io instance.
     */
    getIO: () => {
      if (!io) {
        throw new Error("Socket.io not initialized!");
      }
      return io;
    }
  };
}

module.exports = createSocketManager();
