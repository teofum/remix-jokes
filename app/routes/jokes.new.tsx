import type { ActionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { useActionData } from '@remix-run/react';

import { db } from '~/utils/db.server';
import { badRequest } from '~/utils/request.server';

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

export const action = async ({ request }: ActionArgs) => {
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

  const joke = await db.joke.create({ data: fields });
  return redirect(`/jokes/${joke.id}`);
};

function FormValidationError({
  error,
  id,
}: {
  error?: string | null;
  id?: string;
}) {
  if (!error) return null;

  return (
    <p className="text-invalid" id={id} role="alert">
      {error}
    </p>
  );
}

export default function JokesNewRoute() {
  const actionData = useActionData<typeof action>();

  return (
    <div>
      <p>Add your own hilarious joke</p>
      <form method="post" className="flex flex-col gap-4 w-full">
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
      </form>
    </div>
  );
}
