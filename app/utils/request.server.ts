import { json } from '@remix-run/node';

export const badRequest = <T>(data: T) =>
  json<T>(data, { status: 400, statusText: 'Bad Request' });

export const unauthorized = <T>(data: T) =>
  json<T>(data, { status: 401, statusText: 'Unauthorized' });

export const forbidden = <T>(data: T) =>
  json<T>(data, { status: 403, statusText: 'Forbidden' });

export const notFound = <T>(data: T) =>
  json<T>(data, { status: 404, statusText: 'Not Found' });

export const teapot = <T>(data: T) =>
  json<T>(data, { status: 418, statusText: "I'm a teapot" });

export const serverError = <T>(data: T) =>
  json<T>(data, { status: 500, statusText: 'Server Error' });
