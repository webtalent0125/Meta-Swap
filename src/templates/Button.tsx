type ButtonProps = {
  label: string;
  default: boolean;
  outlinedef: boolean;
  primary: boolean;
  outlinePri: boolean;
  secondary: boolean;
  outlineSec: boolean;
};

const Button = (props: ButtonProps) => {
  if (props.outlinedef) {
    return (
      <button className="ab-btn btn-outline-default">{props.label}</button>
    );
  }
  if (props.primary) {
    return <button className="ab-btn btn-primay">{props.label}</button>;
  }
  if (props.outlinePri) {
    return (
      <button className="ab-btn btn-primary-outline"> {props.label}</button>
    );
  }
  if (props.secondary) {
    return <button className="ab-btn btn-secondary">{props.label}</button>;
  }
  if (props.outlineSec) {
    return (
      <button className="ab-btn btn-secondary-outline"> {props.label}</button>
    );
  }
  return <button className="ab-btn btn-default"> {props.label}</button>;
};
export { Button };
