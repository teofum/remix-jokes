import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Link, useLoaderData, useRouteError } from '@remix-run/react';
import ErrorMessage from '~/components/ErrorMessage';
import { db } from '~/utils/db.server';
import { notFound } from '~/utils/request.server';

export const loader = async ({ params }: LoaderArgs) => {
  const user = await db.user.findUnique({
    select: { id: true, username: true, jokes: true, createdAt: true },
    where: { id: params.userId },
  });

  if (!user) throw notFound({ error: 'User does not exist' });

  return json({ user });
};

export default function UserRoute() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div>
      <h2 className="font-display text-4xl">{user.username}</h2>
      <p>Member since {new Date(user.createdAt).toLocaleDateString()}</p>

      <p className="mt-4">{user.jokes.length} Jokes</p>
      <ul>
        {user.jokes.map((joke) => (
          <li key={joke.id} className="list-disc list-inside">
            <Link to={`/jokes/${joke.id}`}>{joke.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  return <ErrorMessage error={error} />;
}
