declare module 'supertest' {
  const request: (...args: unknown[]) => unknown;
  export default request;
}
