import { GrCircleAlert } from 'react-icons/gr';

interface AlertProps {
  msg: string;
}
const Alert = (props: AlertProps) => {
  return (
    <div className="flex rounded-md border-[2px] border-[#fe007a] p-[10px] text-[#fe007a]">
      <GrCircleAlert color="#fe007a" fill="#fe007a" />
      <span className="ml-2">{props.msg}</span>
    </div>
  );
};

export { Alert };
