import "./styles.css";

type ButtonProps = {
  placeholder: string | JSX.Element;
  type?: ButtonType;
  className?: string;
  [key: string]: any;
};

export enum ButtonType {
  Button = "button",
  Submit = "submit",
  Reset = "reset",
}

const Button = ({
  placeholder,
  type = ButtonType.Button,
  className = "",
  ...props
}: ButtonProps) => {
  return (
    <button type={type} className={"btn" + ` ${className}`} {...props}>
      {placeholder}
    </button>
  );
};

const PrimaryButton = ({ placeholder, type, ...props }: ButtonProps) => (
  <Button
    placeholder={placeholder}
    type={type}
    className="btn-primary"
    {...props}
  />
);

const SecondaryButton = ({ placeholder, type, ...props }: ButtonProps) => (
  <Button
    placeholder={placeholder}
    type={type}
    className="btn-secondary"
    {...props}
  />
);

export { PrimaryButton, SecondaryButton, Button };
