export class NetworkError extends Error {
  constructor() {
    super('No connection to the server.');
    this.name = 'NetworkError';
  }
}

export class ApiError extends Error {
  status: number;
  data: any; // whatever JSON the server sent back, scan results need it on 4xx
  constructor(status: number, message: string, data: any = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export class NotConnectedError extends Error {
  constructor(what: string) {
    super(`${what} isn't connected to the backend yet.`);
    this.name = 'NotConnectedError';
  }
}
