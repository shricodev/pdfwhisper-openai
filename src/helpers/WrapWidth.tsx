import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  children: React.ReactNode;
}

const WrapWidth = ({ className, children }: Props) => {
  return (
    <div
      className={
        (cn("mx-auto w-full max-w-screen-xl px-2.5 md:px-20"), className)
      }
    >
      {children}
    </div>
  );
};

export default WrapWidth;
