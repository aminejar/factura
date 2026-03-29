interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export default function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold text-purple-900 mb-2">{title}</h1>
      <p className="text-purple-600">{subtitle}</p>
    </div>
  );
}