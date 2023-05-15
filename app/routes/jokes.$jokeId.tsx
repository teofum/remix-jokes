import type { ActionArgs, LoaderArgs, V2_MetaFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, Link, useLoaderData, useRouteError } from '@remix-run/react';
import ErrorMessage from '~/components/ErrorMessage';
import { db } from '~/utils/db.server';
import { badRequest, forbidden, notFound } from '~/utils/request.server';
import { getUser, requireUserId } from '~/utils/session.server';

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  const { description, title } = data
    ? {
        description: `Enjoy the "${data.joke.name}" joke and much more`,
        title: `"${data.joke.name}" joke`,
      }
    : { description: 'No joke found', title: 'This is no joke' };

  return [
    { name: 'description', content: description },
    { name: 'twitter:description', content: description },
    { title },
  ];
};

export const loader = async ({ request, params }: LoaderArgs) => {
  const user = await getUser(request);
  const joke = await db.joke.findUnique({
    select: { id: true, name: true, content: true, jokester: true },
    where: { id: params.jokeId },
  });

  if (!joke)
    throw notFound({
      error: "What's really funny and doesn't exist? This joke.",
    });

  joke.jokester.passwordHash = 'nope'; // Don't leak this!!

  return json({ joke, user });
};

export const action = async ({ request, params }: ActionArgs) => {
  const form = await request.formData();
  if (form.get('intent') !== 'delete')
    throw badRequest({ error: `Unsupported intent ${form.get('intent')}` });

  const userId = await requireUserId(request);
  const joke = await db.joke.findUnique({
    select: { id: true, jokester: true },
    where: { id: params.jokeId },
  });

  if (!joke)
    throw notFound({ error: "Can't delete me if I don't exist, haha!" });

  if (joke.jokester.id !== userId)
    throw forbidden({ error: "Pssh, nice try. That's not your joke" });

  await db.joke.delete({ where: { id: joke.id } });
  return redirect('/jokes');
};

export default function JokeRoute() {
  const { joke, user } = useLoaderData<typeof loader>();

  const loggedUserIsOwner = joke.jokester.id === user?.id;

  return (
    <div>
      <div className="flex flex-row items-center">
        <h1 className="font-display text-4xl text-link">{joke.name}</h1>

        {loggedUserIsOwner && (
          <Form className="ml-auto" method="post">
            <button name="intent" type="submit" value="delete">
              Delete
            </button>
          </Form>
        )}
      </div>
      <p className="mt-2 mb-4">{joke.content}</p>
      <p>
        Uploaded by{' '}
        <Link to={`/user/${joke.jokester.id}`}>{joke.jokester.username}</Link>
      </p>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  return <ErrorMessage error={error} />;
}
