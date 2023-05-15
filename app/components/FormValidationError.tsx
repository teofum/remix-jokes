export default function FormValidationError({
  error,
  id,
}: {
  error?: string | null;
  id?: string;
}) {
  if (!error) return null;

  return (
    <p className="text-invalid text-sm" id={id} role="alert">
      {error}
    </p>
  );
}