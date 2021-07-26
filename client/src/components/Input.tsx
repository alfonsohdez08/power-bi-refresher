import Label from "./Label";

interface InputProps {
  label?: string;
  className?: string;
  [key: string]: any;
}

export default function Input({ label, className, ...props }: InputProps) {
  return (
    <>
      {label ? <Label htmlFor={props.name} placeholder={label} /> : null}
      <input
        {...props}
        className={
          "shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline " +
          className
        }
      />
    </>
  );
}
