import { json } from '@remix-run/node';
import {
  Link,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from '@remix-run/react';
import ErrorMessage from '~/components/ErrorMessage';
import { db } from '~/utils/db.server';
import { notFound } from '~/utils/request.server';

export const loader = async () => {
  const count = await db.joke.count();
  const randomRowNumber = Math.floor(Math.random() * count);

  const [randomJoke] = await db.joke.findMany({
    select: { id: true, name: true, content: true, jokester: true },
    skip: randomRowNumber,
    take: 1,
  });
  if (!randomJoke) throw notFound({ error: 'There are no jokes.' });

  randomJoke.jokester.passwordHash = 'nope'; // Don't leak this!!

  return json({
    joke: randomJoke,
  });
};

export default function JokesIndexRoute() {
  const { joke } = useLoaderData<typeof loader>();

  return (
    <div>
      <p>Here's a random joke:</p>
      <p className="mt-2 mb-4">{joke.content}</p>
      <p>Uploaded by {joke.jokester.username}</p>
      <Link to={joke.id}>"{joke.name}" Permalink</Link>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <div>
        <p className="mb-4">There are no jokes. So sad :(</p>
        <Link to="new" className="as-button">Add your own</Link>
      </div>
    );
  }

  return <ErrorMessage error={error} />;
}
