import { Server, Socket } from "socket.io";
// import { io }   from "../server"; // Commented out: Needs Next.js compatible IO instance
import logger from "../utils/logger";

export const registerSocketHandlers = (io: Server) => {
  // This function needs to be called with a properly initialized Socket.IO server instance
  // in a Next.js environment.
  io.on('connection', (socket: Socket) => {
    logger.info('Client connected to socket: ', socket.id);

    socket.on('subscribeToJob', (jobId: string) => {
      socket.join(jobId);
      logger.info(`Client subscribed to Job: ${jobId}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected from socket:', socket.id);
    });
  });
};

// This function emits a progress update for a specific node to socket
export const emitNodeProgress = (
    jobId: string,
    nodeUpdate: {
        nodeId: string;
        type: string;
        status: string;
        progressPercentage: number;
        response?: any;
        errorMessage?: any;
    }
)  => {
    // This needs a valid `io` instance passed or accessible.
    // For now, this will likely cause an error if called.
    // Consider passing the `io` instance to this function or making it accessible globally.
    // io.to(jobId).emit('workflow-progress', {
    //    jobId,
    //    ...nodeUpdate,
    // });
    logger.warn("emitNodeProgress called, but Socket.IO instance is not properly configured in Next.js context.");
};