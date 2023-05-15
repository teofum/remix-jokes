import { Form, Link } from '@remix-run/react';

interface Props {
  joke: {
    name: string;
    content: string;
    jokester: { id: string; username: string };
  };
  loggedUserIsOwner?: boolean;
  canDelete?: boolean;
}

export default function Joke({
  joke,
  loggedUserIsOwner = false,
  canDelete = true,
}: Props) {
  return (
    <div>
      <div className="flex flex-row items-center">
        <h1 className="font-display text-4xl text-link">{joke.name}</h1>

        {loggedUserIsOwner && canDelete && (
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
