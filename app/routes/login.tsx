import type { ActionArgs } from '@remix-run/node';
import { Link, useActionData, useSearchParams } from '@remix-run/react';

import Container from '~/components/Container';
import FormValidationError from '~/components/FormValidationError';
import { db } from '~/utils/db.server';
import { badRequest, serverError, unauthorized } from '~/utils/request.server';
import { createUserSession, login, register } from '~/utils/session.server';

const validateUsername = (username: string) => {
  if (username.length < 3)
    return 'Usernames must be at least 3 characters long';
  if (username.length > 20)
    return 'Usernames must be at most 20 characters long';
  return null;
};

const validatePassword = (password: string) => {
  if (password.length < 6)
    return 'Passwords must be at least 6 characters long';
  return null;
};

export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData();

  const username = form.get('username');
  const password = form.get('password');
  const loginType = form.get('loginType');
  const redirectTo = form.get('redirectTo') || '/jokes';

  // Form validation
  if (
    typeof username !== 'string' ||
    typeof password !== 'string' ||
    typeof loginType !== 'string' ||
    typeof redirectTo !== 'string'
  )
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: 'Form submitted incorrectly (field type mismatch)',
    });

  // Field validation
  const fields = { username, password, loginType, redirectTo };
  const fieldErrors = {
    username: validateUsername(username),
    password: validatePassword(password),
  };

  if (Object.values(fieldErrors).some((error) => error !== null))
    return badRequest({
      fieldErrors,
      fields,
      formError: null,
    });

  switch (loginType) {
    case 'register': {
      const userExists = await db.user.findFirst({
        where: { username },
      });
      if (userExists)
        return badRequest({
          fieldErrors: null,
          fields,
          formError: `User with username ${username} already exists`,
        });

      const user = await register(username, password);
      if (!user)
        return serverError({
          fieldErrors: null,
          fields,
          formError: 'Something went wrong creating a new user',
        });

      return createUserSession(user.id, redirectTo);
    }

    case 'login': {
      const user = await login(username, password);
      if (!user)
        return unauthorized({
          fieldErrors: null,
          fields,
          formError: 'Username/Password combination is incorrect',
        });

      return createUserSession(user.id, redirectTo);
    }

    default: {
      return badRequest({
        fieldErrors: null,
        fields,
        formError: 'Invalid login type',
      });
    }
  }
};

export default function LoginRoute() {
  const actionData = useActionData<typeof action>();
  const [params] = useSearchParams();

  const redirectTo = params.get('redirectTo') ?? undefined;

  return (
    <div className="bg-purple-radial min-h-screen">
      <Container
        className="
          min-h-screen
          flex
          flex-col
          justify-center
          items-center
        "
      >
        <div
          className="
            bg-white
            text-background
            w-96
            max-w-full
            p-4
            rounded-lg
            shadow-md
            sm:p-8
            sm:rounded-xl
          "
        >
          <h1 className="text-center font-display text-4xl sm:text-5xl lg:text-6xl">
            Login
          </h1>

          <form method="post" className="flex flex-col gap-4 w-full mt-4">
            <input type="hidden" name="redirectTo" value={redirectTo} />

            <fieldset className="flex gap-2 justify-center">
              <label>
                <input
                  type="radio"
                  name="loginType"
                  value="login"
                  defaultChecked={actionData?.fields?.loginType !== 'register'}
                />
                Login
              </label>
              <label>
                <input
                  type="radio"
                  name="loginType"
                  value="register"
                  defaultChecked={actionData?.fields?.loginType === 'register'}
                />
                Register
              </label>
            </fieldset>

            <div>
              <label>
                Username
                <input
                  type="text"
                  name="username"
                  className="bg-default bg-opacity-10 text-background"
                  defaultValue={actionData?.fields?.username}
                  aria-invalid={!!actionData?.fieldErrors?.username}
                  aria-errormessage={
                    actionData?.fieldErrors?.username
                      ? 'username-error'
                      : undefined
                  }
                />
              </label>

              <FormValidationError
                error={actionData?.fieldErrors?.username}
                id="username-error"
              />
            </div>

            <div>
              <label>
                Password
                <input
                  type="password"
                  name="password"
                  className="bg-default bg-opacity-10 text-background"
                  defaultValue={actionData?.fields?.password}
                  aria-invalid={!!actionData?.fieldErrors?.password}
                  aria-errormessage={
                    actionData?.fieldErrors?.password
                      ? 'password-error'
                      : undefined
                  }
                />
              </label>

              <FormValidationError
                error={actionData?.fieldErrors?.password}
                id="password-error"
              />
            </div>

            <div>
              <FormValidationError error={actionData?.formError} />
              <button type="submit" className="w-full">
                Log in
              </button>
            </div>
          </form>
        </div>

        <div>
          <ul className="flex gap-2 mt-6">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/jokes">Jokes</Link>
            </li>
          </ul>
        </div>
      </Container>
    </div>
  );
}
