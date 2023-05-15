import type { LinksFunction, V2_MetaFunction } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  useRouteError,
} from '@remix-run/react';

import styles from './styles/tailwind.css';
import ErrorMessage from './components/ErrorMessage';
import type { PropsWithChildren } from 'react';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }];
export const meta: V2_MetaFunction = () => {
  const description = 'Learn Remix and laugh at the same time!';

  return [
    { name: 'description', content: description },
    { name: 'twitter:description', content: description },
    { title: "Remix: So great, it's funny!" },
  ];
};

function Document({ children, title }: PropsWithChildren<{ title?: string }>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="keywords" content="Remix,jokes" />
        <meta
          name="twitter:image"
          content="https://remix-jokes.lol/social.png"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@remix_run" />
        <meta name="twitter:site" content="@remix_run" />
        <meta name="twitter:title" content="Remix Jokes" />
        <Meta />
        {title ? <title>{title}</title> : null}
        <Links />
      </head>
      <body className="bg-default text-default min-h-screen">
        {children}
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  return (
    <Document>
      <ErrorMessage error={error} />
    </Document>
  );
}
