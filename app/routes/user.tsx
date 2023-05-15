import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, Link, Outlet, useLoaderData } from '@remix-run/react';
import Container from '~/components/Container';
import { getUser } from '~/utils/session.server';

export const loader = async ({ request }: LoaderArgs) => {
  const user = await getUser(request);
  return json({ user });
};

export default function UsersRoute() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen">
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
              <Form method="post" action="/logout">
                <button type="submit">Log out</button>
              </Form>
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
          <div className="flex-1">
            <Outlet />
          </div>
        </Container>
      </main>
    </div>
  );
}
