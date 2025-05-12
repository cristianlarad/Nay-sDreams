import logo from "../../../public/logo.webp";
import { Title } from "../ui/Title";

interface LogoProps {
  className?: string;
}

export const Logo = ({ className }: LogoProps) => (
  <div className="flex space-x-2 items-center">
    <img src={logo} alt="" width={45} height={45} className={className} />
    <Title text="Nay's Dreams" className=" hidden md:block" size="small" />
  </div>
);
