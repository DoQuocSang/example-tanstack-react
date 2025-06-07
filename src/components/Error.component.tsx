interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <span className="text-lg font-medium text-red-500">Error: {message}</span>
  );
}
