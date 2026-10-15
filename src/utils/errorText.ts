// Turns whatever got thrown into one line a person can read.
export function errorText(e: unknown): string {
  if (e instanceof Error) {
    if (e.name === 'NetworkError') return "Can't reach the server. Check your connection.";
    return e.message;
  }
  return 'Something went wrong. Try again.';
}
