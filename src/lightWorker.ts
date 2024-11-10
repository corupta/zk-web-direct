import { pipelineLight } from "./lightZk";

function log(msg: string) {
  self.postMessage(msg);
}

self.onmessage = async (e) => {
  if (e.data === "start") {
    try {
      await pipelineLight(log);
    } catch (error) {
      console.error("Error in zkLight:", error);
    }
  } else if (e.data === "ping") {
    self.postMessage("pong");
  }
};
