import "./styles.css";
import { Link } from "react-router-dom";

export default function AnchorButton({
  to,
  placeholder,
  ...props
}: {
  to: string;
  placeholder: string;
  [key: string]: any;
}) {
  return (
    <Link to={to} className="btn btn-secondary" {...props}>
      {placeholder}
    </Link>
  );
}
