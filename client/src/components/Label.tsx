export enum LabelTextSize {
  ExtraSmall = "text-xs",
  Small = "text-sm",
}

export default function Label({
  htmlFor,
  placeholder,
  textSize = LabelTextSize.Small,
}: {
  htmlFor?: string;
  placeholder: string;
  textSize?: LabelTextSize;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={
        "inline-block text-gray-800 font-bold uppercase " + textSize.valueOf()
      }
    >
      {placeholder}
    </label>
  );
}
