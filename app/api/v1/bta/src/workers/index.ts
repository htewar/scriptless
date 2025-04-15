import { startWorkflowWorker } from './workflow/start-worker';

let worker: ReturnType<typeof startWorkflowWorker>;

export const startWorkers = () => {
  worker = startWorkflowWorker();
};

export const stopWorkers = async () => {
  if (worker) {
    await worker.close();
  }
};