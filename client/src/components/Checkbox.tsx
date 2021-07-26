export default function Checkbox({
  checked,
  onChange,
}: {
  checked?: boolean;
  onChange: (newValue: boolean) => void;
}) {
    const props: any = {};

    if (checked !== null){
        props["checked"] = checked;
    }

  return (
    <input
      type="checkbox"
      onChange={({ target }) => onChange(target.checked)}
      {...props}
    />
  );
}
