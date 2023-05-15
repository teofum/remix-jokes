import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Link, Outlet, useLoaderData } from '@remix-run/react';
import Container from '~/components/Container';
import { db } from '~/utils/db.server';
import { getUser } from '~/utils/session.server';

export const loader = async ({ request }: LoaderArgs) => {
  const user = await getUser(request);
  return json({
    user,
    jokes: await db.joke.findMany({
      select: { id: true, name: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  });
};

export default function JokesRoute() {
  const { user, jokes } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col min-h-full">
      <header className="py-4 border-b border-b-default">
        <Container className="flex justify-between items-center">
          <h1 className="font-display text-4xl">
            <Link
              to="/"
              title="Remix Jokes"
              aria-label="Remix Jokes"
              className="text-white hover:no-underline hover:text-white"
            >
              <span className="sm:hidden">🤪</span>
              <span className="hidden sm:block">J🤪KES</span>
            </Link>
          </h1>

          {user ? (
            <div className="flex flex-row items-center gap-4">
              <span>Hi {user.username}!</span>
              <form method="post" action="/logout">
                <button type="submit">Log out</button>
              </form>
            </div>
          ) : (
            <Link to="/login" className="button">
              Log in
            </Link>
          )}
        </Container>
      </header>

      <main className="py-8 sm:py-12 flex-full">
        <Container className="flex flex-col sm:flex-row gap-4">
          <div className="w-48 flex-shrink-0 flex flex-col gap-3">
            <Link to=".">Get a random joke</Link>

            <p>Here are a few more jokes to check out:</p>

            <ul>
              {jokes.map((joke) => (
                <li key={joke.id} className="list-disc list-inside">
                  <Link to={joke.id}>{joke.name}</Link>
                </li>
              ))}
            </ul>

            <Link to="new" className="as-button">
              Add your own
            </Link>
          </div>

          <div className="flex-1">
            <Outlet />
          </div>
        </Container>
      </main>
    </div>
  );
}
