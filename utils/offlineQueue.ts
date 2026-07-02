type QueuedTask = {
  id: string;
  execute: () => Promise<void>;
  onSuccess?: () => void;
  onError?: (err: unknown) => void;
};

type Listener = () => void;

const queue: QueuedTask[] = [];
let listeners: Set<Listener> = new Set();

function generateId(): string {
  return `q_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function enqueue(task: Omit<QueuedTask, "id">): string {
  const id = generateId();
  queue.push({ ...task, id });
  return id;
}

export function processQueue() {
  while (queue.length > 0) {
    const task = queue.shift()!;
    task
      .execute()
      .then(() => task.onSuccess?.())
      .catch((err) => task.onError?.(err));
  }
  listeners.forEach((fn) => fn());
}

export function clearQueue() {
  queue.length = 0;
  listeners.forEach((fn) => fn());
}

export function getQueueLength(): number {
  return queue.length;
}

export function onQueueChange(fn: Listener): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
