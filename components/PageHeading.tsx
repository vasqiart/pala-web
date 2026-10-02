type Props = {
  title: string;
  subtitle?: string;
};

export default function PageHeading({ title, subtitle }: Props) {
  return (
    <header className="px-4 pb-6 pt-4 md:px-6 md:pt-6">
      <h1 className="text-xl font-semibold text-gray-800 md:text-2xl">
        {title}
      </h1>
      {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
    </header>
  );
}
