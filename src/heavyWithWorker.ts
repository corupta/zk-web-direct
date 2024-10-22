async function main() {
  const worker = new Worker(new URL("./heavyWorker.ts", import.meta.url), {
    type: "module",
  });
  worker.onmessage = (e) => {
    const msg = e.data as string;
    if (msg !== "pong") {
      console.log(msg);
    }
  };
  worker.postMessage("start");

  setInterval(() => {
    worker.postMessage("ping");
  }, 10000); // Send a message every 10 seconds
}

main();
