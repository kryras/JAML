import Worker from 'worker-loader!@/scripts/tf-worker'

const worker = new Worker()

export async function warmUpModel (modelName) {
  return sendMessage({ action: 'warmup', modelName })
}

export async function predict ([modelName, picture, quantity]) {
  return sendMessage({ action: 'predict', modelName, picture, quantity })
}

async function sendMessage (msg) {
  const pred = (message) => new Promise((res, rej) => {
    const channel = new MessageChannel();

    channel.port1.onmessage = ({ data }) => {
      channel.port1.close();
      if (data.error) {
        rej(data.error);
      } else {
        res(data.result);
      }
    };
    worker.postMessage(message, [channel.port2]);
  });
  return pred(msg)
}