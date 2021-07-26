function Badge({
  placeholder,
  className,
}: {
  placeholder: string;
  className?: string;
}) {
  return (
    <span
      className={
        "inline-flex items-center justify-center px-2 py-1 text-sm font-semibold leading-none rounded text-white " +
        className
      }
    >
      {placeholder}
    </span>
  );
}

export function DangerBadge({ placeholder }: { placeholder: string }) {
  return <Badge placeholder={placeholder} className="bg-red-600" />;
}

export function SuccessBadge({ placeholder }: { placeholder: string }) {
  return <Badge placeholder={placeholder} className="bg-green-500" />;
}

export function GeneralBadge({ placeholder }: { placeholder: string }) {
  return <Badge placeholder={placeholder} className="bg-blue-500" />;
}
