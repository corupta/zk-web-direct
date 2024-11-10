import { CacheHeader } from 'o1js';
export type CacheDump = {
  [key: string]: string[];
}

function loadAssetAsUint8Array(url: string) {
  const request = new XMLHttpRequest();
  request.open("GET", url, false); // false makes it synchronous
  request.responseType = "arraybuffer";

  request.send();

  if (request.status === 200) {
    return new Uint8Array(request.response);
  } else {
    return undefined;
  }
}

function loadTextFile(url: string) {
  const request = new XMLHttpRequest();
  request.open("GET", url, false); // false makes it synchronous
  request.overrideMimeType("text/plain"); // Ensures response is treated as plain text

  request.send();

  if (request.status === 200) {
    return request.responseText;
  } else {
    return undefined;
  }
}

export class FileCache {
  private baseUrl: string;
  private logger: (message: string) => void;
  public readonly canWrite: boolean = false
  constructor(logger: (message: string) => void, baseUrl: string = '/caches/') {
    if (!baseUrl.endsWith('/')) {
        baseUrl += '/';
    }
    this.baseUrl = baseUrl;
    this.logger = logger;
  }
  public read({ persistentId, uniqueId, dataType }: CacheHeader) {
    const currentId = loadTextFile(`${this.baseUrl}${persistentId}.header`);
    this.logger(`cache read: ${persistentId} ${uniqueId} ${dataType} read currentId ${currentId} `);
    if (!currentId) return;
    if (currentId !== uniqueId) return;
    if (dataType === 'string') {
      let string = loadTextFile(`${this.baseUrl}${persistentId}`);
      if (!string) return;
      this.logger('cache read string');
      return new TextEncoder().encode(string);
    } else {
      let buffer = loadAssetAsUint8Array(`${this.baseUrl}${persistentId}`);
      if (!buffer) return;
      this.logger('cache read buffer');
      return new Uint8Array(buffer);
    }
  }
  public write() {
    this.logger('cache write not implemented');
  }
}