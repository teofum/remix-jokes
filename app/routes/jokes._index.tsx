import { json } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { db } from '~/utils/db.server';

export const loader = async () => {
  const count = await db.joke.count();
  const randomRowNumber = Math.floor(Math.random() * count);
  const [randomJoke] = await db.joke.findMany({
    select: { id: true, name: true, content: true },
    skip: randomRowNumber,
    take: 1,
  });

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
      <Link to={joke.id}>"{joke.name}" Permalink</Link>
    </div>
  );
}
