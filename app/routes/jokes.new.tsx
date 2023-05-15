import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import {
  Form,
  Link,
  isRouteErrorResponse,
  useActionData,
  useLoaderData,
  useNavigation,
  useRouteError,
} from '@remix-run/react';
import ErrorMessage from '~/components/ErrorMessage';

import FormValidationError from '~/components/FormValidationError';
import Joke from '~/components/Joke';
import { db } from '~/utils/db.server';
import { badRequest, unauthorized } from '~/utils/request.server';
import { getUser, requireUserId } from '~/utils/session.server';

const validateJokeName = (name: string) => {
  if (name.length < 3) return "The joke's name is too short";
  if (name.length > 40) return "The joke's name is too long";
  return null;
};

const validateJokeContent = (content: string) => {
  if (content.length < 10) return "The joke's content is too short";
  if (content.length > 140) return "The joke's content is too long";
  return null;
};

export const loader = async ({ request }: LoaderArgs) => {
  const user = await getUser(request);
  if (!user)
    throw unauthorized({ error: 'You must be logged in to create a joke.' });

  return json({ user });
};

export const action = async ({ request }: ActionArgs) => {
  const userId = await requireUserId(request);
  const form = await request.formData();

  const name = form.get('name');
  const content = form.get('content');

  // Form validation
  if (typeof name !== 'string' || typeof content !== 'string')
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: 'Form submitted incorrectly (field type mismatch)',
    });

  // Field validation
  const fields = { name, content };
  const fieldErrors = {
    name: validateJokeName(name),
    content: validateJokeContent(content),
  };

  if (Object.values(fieldErrors).some((error) => error !== null))
    return badRequest({
      fieldErrors,
      fields,
      formError: null,
    });

  const joke = await db.joke.create({
    data: { ...fields, jokesterId: userId },
  });
  return redirect(`/jokes/${joke.id}`);
};

export default function JokesNewRoute() {
  const { user } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  if (navigation.formData) {
    const content = navigation.formData.get('content');
    const name = navigation.formData.get('name');
    if (
      typeof content === 'string' &&
      typeof name === 'string' &&
      !validateJokeContent(content) &&
      !validateJokeName(name)
    )
      return (
        <Joke
          joke={{ name, content, jokester: user }}
          loggedUserIsOwner={true}
          canDelete={false}
        />
      );
  }

  return (
    <div>
      <p>Add your own hilarious joke</p>
      <Form method="post" className="flex flex-col gap-4 w-full">
        <div>
          <label>
            Name:{' '}
            <input
              type="text"
              name="name"
              defaultValue={actionData?.fields?.name}
              aria-invalid={!!actionData?.fieldErrors?.name}
              aria-errormessage={
                actionData?.fieldErrors?.name ? 'name-error' : undefined
              }
            />
          </label>

          <FormValidationError
            error={actionData?.fieldErrors?.name}
            id="name-error"
          />
        </div>

        <div>
          <label>
            Content:{' '}
            <textarea
              rows={3}
              name="content"
              defaultValue={actionData?.fields?.content}
              aria-invalid={!!actionData?.fieldErrors?.content}
              aria-errormessage={
                actionData?.fieldErrors?.content ? 'content-error' : undefined
              }
            />
          </label>

          <FormValidationError
            error={actionData?.fieldErrors?.content}
            id="content-error"
          />
        </div>

        <div>
          <FormValidationError error={actionData?.formError} />
          <button type="submit">Add</button>
        </div>
      </Form>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 401) {
    return (
      <div>
        <h2 className="font-display text-4xl">Sign in to continue</h2>
        <p className="mt-2 mb-4">You must be logged in to add new jokes.</p>

        <Link to="/login?redirectTo=/jokes/new" className="as-button">
          Log in
        </Link>
      </div>
    );
  }

  return <ErrorMessage error={error} />;
}
