import { isRouteErrorResponse } from '@remix-run/react';

interface Props {
  error: unknown;
}

export default function ErrorMessage({ error }: Props) {
  let title = 'Oh shit!';
  let message = 'Something went very, very wrong.';
  let details = 'Unknown error';

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`;
    message = error.data.error ?? 'Unknown error';
    details = JSON.stringify(error.data);
  } else if (error instanceof Error) {
    message = error.message;
    details = error.stack ?? 'No stack trace available';
  }

  return (
    <div className="bg-rose-950 rounded-xl p-8 border-2 border-rose-600">
      <p className="text-4xl font-display">{title}</p>
      <p className="mb-4">{message}</p>
      <details className="cursor-pointer">
        <summary>Error Details</summary>
        <pre className="text-xs whitespace-pre-wrap">{details}</pre>
      </details>
    </div>
  );
}
