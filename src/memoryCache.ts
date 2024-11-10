import { CacheHeader } from 'o1js';
export type CacheDump = {
  [key: string]: string[];
}
export type B64Arr = string[];
const uint8ArrToB64Arr = (data: Uint8Array) => {
  const output: string[] = [];
  const chunkLength = 32 * 1024 * 1024 * 3;
  const buildChunk = (start: number, currentChunkLength:number) => {
      const chunk = [];
      for (let j = 0; j < currentChunkLength; ++j) {
          chunk.push(String.fromCharCode(data[start+j]));
      }
      output.push(btoa(chunk.join('')));
  }
  let i;
  for (i = 0; i + chunkLength <= data.length; i += chunkLength) {
      buildChunk(i, chunkLength);
  }
  if (i < data.length) {
      buildChunk(i, data.length - i)
  }
  return output;
}
const b64ArrToUint8Arr = (data: B64Arr) => {
  let totalLength = 0;
  (() => {
    for (let i = 0; i < data.length; ++i) {
      totalLength += data[i].length * 3 / 4;
    }
    const lastChunk = data[data.length - 1];
    const last4Str = lastChunk.substr(lastChunk.length - 4);
    const last3Dat = atob(last4Str);
    totalLength -= (3 - last3Dat.length);
  })();
  const output = new Uint8Array(totalLength);
  let i = 0;
  for (let j = 0; j < data.length; ++j) {
    const chunkStr = atob(data[j]);
    for (let k = 0; k < chunkStr.length; ++k) {
      output[i++] = chunkStr.charCodeAt(k);
    }
  }
  return output;
};
  
export class MemoryCache {
  private cache: Map<string, [string, Uint8Array]> = new Map();
  public readonly canWrite: boolean = true
  constructor(dump?: CacheDump) {
    if (dump) {
      Object.entries(dump).forEach(([key, value]) => {
        const [uniqueId, ...dataB64] = value;
        const data = b64ArrToUint8Arr(dataB64);
        this.cache.set(key, [uniqueId, data]);
      });
    }
  }
  public read({ persistentId, uniqueId, dataType }: CacheHeader) {
    let res = this.cache.get(persistentId);
    if (!res) return;
    if (res[0] !== uniqueId) return;
    return res[1];
  }
  public write({ persistentId, uniqueId, dataType }: CacheHeader, data: Uint8Array) {
    this.cache.set(persistentId, [uniqueId, data]);
  }

  public exportDump(): CacheDump {
    const dump: CacheDump = {};
    this.cache.forEach((value, key) => {
      const [uniqueId, data] = value;
      const dataB64 = uint8ArrToB64Arr(data);
      dump[key] = [uniqueId, ...dataB64];
    });
    return dump;
  }
}