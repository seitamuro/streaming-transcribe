import {
  StartStreamTranscriptionCommand,
  TranscribeStreamingClient,
} from "@aws-sdk/client-transcribe-streaming";
import { WebSocket, WebSocketServer } from "ws";

const port = 8080;
const server = new WebSocketServer({ port: port });
const clients = new Set<WebSocket>();
const clients_name = new Map<WebSocket, string>();
const transcribeClient = new TranscribeStreamingClient({
  region: "us-east-1",
});

console.log(`WebSocket Server is running on port ${port}`);

server.on("connection", async (ws) => {
  console.log("Client has connected");
  clients.add(ws);
  clients_name.set(ws, `${clients.size}`);

  ws.send(`You are name is ${clients_name.get(ws)}`);

  const pcmEncode = (input: Float32Array) => {
    const buffer = new ArrayBuffer(input.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < input.length; i++) {
      const s = Math.max(-1, Math.min(1, input[i]));
      view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    return buffer;
  };
  //const audioDataIterator = pEvent.iterator(ws, "message");
  async function* audioDataIterator(ws: WebSocket) {
    try {
      while (true) {
        const event = await new Promise((resolve, reject) => {
          ws.addEventListener(
            "message",
            (event) => {
              console.log(event);
              return resolve(event);
            },
            {
              once: true,
            }
          );
          ws.addEventListener("close", () =>
            reject(new Error("WebSocket closed"))
          );
          ws.addEventListener("error", (error) => reject(error));
        });
        yield event;
      }
    } finally {
      ws.close();
    }
  }

  const getAudioStream = async function* () {
    for await (const _chunk of audioDataIterator(ws)) {
      const chunk = _chunk as MessageEvent;
      if (chunk.data.message === "SHARE_RECORDING_BUFFER") {
        const abuffer = pcmEncode(chunk.data.buffer[0]);
        const audiodata = new Uint8Array(abuffer);
        console.log(`processing chunk of size ${audiodata.length}`);
        yield {
          AudioEvent: {
            AudioChunk: audiodata,
          },
        };
      }
    }
    const command = new StartStreamTranscriptionCommand({
      IdentifyMultipleLanguages: true,
      LanguageOptions: "en-US,ja-JP",
      MediaEncoding: "pcm",
      MediaSampleRateHertz: 44100,
      AudioStream: getAudioStream(),
    });
    const data = await transcribeClient.send(command);

    if (data.TranscriptResultStream) {
      for await (const event of data.TranscriptResultStream) {
        if (event?.TranscriptEvent?.Transcript) {
          for (const result of event?.TranscriptEvent?.Transcript.Results ||
            []) {
            if (result?.Alternatives && result?.Alternatives[0].Items) {
              let completeSentence = ``;
              for (let i = 0; i < result?.Alternatives[0].Items?.length; i++) {
                completeSentence += ` ${result?.Alternatives[0].Items[i].Content}`;
              }
              console.log(`Transcription: ${completeSentence}`);
            }
          }
        }
      }
    }
  };

  ws.on("close", () => {
    console.log("Client has disconnected");
    clients.delete(ws);
  });
});
