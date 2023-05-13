import type { LinksFunction } from '@remix-run/node';
import { Links, LiveReload, Outlet } from '@remix-run/react';

import styles from './styles/tailwind.css';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Remix: So great, it's funny!</title>
        <Links />
      </head>
      <body className="bg-default text-default min-h-screen">
        <Outlet />
        <LiveReload />
      </body>
    </html>
  );
}
