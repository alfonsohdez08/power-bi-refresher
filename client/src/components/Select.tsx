import Label from "./Label";

export interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  label?: string;
  options: Option[];
  className?: string;
  onOptionSelected: (selectedOption: string) => void;
  [key: string]: any;
}

export default function Select({
  label,
  options,
  className,
  onOptionSelected,
  ...props
}: SelectProps) {
  return (
    <div>
      <div className="mb-2">
        {label ? <Label htmlFor={props.name} placeholder={label} /> : null}
      </div>
      <select
        {...props}
        className={
          "block text-gray-700 appearance-none border px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline " +
          className
        }
        onChange={({ target }) => onOptionSelected(target.value)}
      >
        {options.map((o) => (
          <option key={`${o.label}_${o.value}`} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
