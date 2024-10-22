import { pipelineHeavy } from "./heavyZk";

function log(msg: string) {
  console.log(msg);
}

self.onmessage = async (e) => {
  if (e.data === "start") {
    try {
      await pipelineHeavy(log);
    } catch (error) {
      console.error("Error in zkHeavy:", error);
    }
  } else if (e.data === "ping") {
    self.postMessage("pong");
  }
};
