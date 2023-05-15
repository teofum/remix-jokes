import bcryptjs from 'bcryptjs';

import { db } from './db.server';
import { createCookieSessionStorage, redirect } from '@remix-run/node';

export const login = async (username: string, password: string) => {
  const user = await db.user.findUnique({
    where: { username },
  });
  if (!user) return null;

  const passwordMatch = await bcryptjs.compare(password, user.passwordHash);
  if (!passwordMatch) return null;

  return { id: user.id, username };
};

export const register = async (username: string, password: string) => {
  const passwordHash = await bcryptjs.hash(password, 10);

  const user = await db.user.create({
    data: { username, passwordHash }
  });

  return { id: user.id, username };
};

interface SessionData {
  userId: string;
}

interface SessionFlashData {
  error: string;
}

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) throw new Error('SESSION_SECRET envvar missing');

const storage = createCookieSessionStorage<SessionData, SessionFlashData>({
  cookie: {
    name: 'RJ_Session',
    httpOnly: true,
    secure: true,
    secrets: [sessionSecret],
    path: '/',
    sameSite: 'lax',
    maxAge: 3600 * 24 * 30,
  },
});

export const createUserSession = async (
  userId: string,
  redirectUrl: string,
) => {
  const session = await storage.getSession();
  session.set('userId', userId);

  return redirect(redirectUrl, {
    headers: {
      'Set-Cookie': await storage.commitSession(session),
    },
  });
};

export const getUserSession = (request: Request) => {
  return storage.getSession(request.headers.get('Cookie'));
};

export const getUserId = async (request: Request) => {
  const session = await getUserSession(request);
  const userId = session.get('userId');

  if (!userId || typeof userId !== 'string') return null;
  return userId;
};

export const requireUserId = async (
  request: Request,
  redirectUrl: string = new URL(request.url).pathname,
) => {
  const session = await getUserSession(request);
  const userId = session.get('userId');
  if (!userId || typeof userId !== 'string')
    throw redirect(`/login?redirectTo=${redirectUrl}`);

  return userId;
};

export const getUser = async (request: Request) => {
  const userId = await getUserId(request);
  if (!userId) return null;

  const user = await db.user.findUnique({
    select: { id: true, username: true },
    where: { id: userId },
  });
  if (!user) throw logout(request);

  return user;
};

export const logout = async (request: Request) => {
  const session = await getUserSession(request);

  return redirect('/login', {
    headers: {
      'Set-Cookie': await storage.destroySession(session),
    },
  });
};
