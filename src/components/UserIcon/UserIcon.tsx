import { AvatarProps } from "@radix-ui/react-avatar";
import { Avatar, AvatarFallback } from "../ui/Avatar";
import { User2 } from "lucide-react";
import { Button, buttonVariants } from "../ui/Button";

interface UserAvatarProps extends AvatarProps {}

const UserIcon = (props: UserAvatarProps) => {
  return (
    <Avatar {...props}>
      {/* for screenreaders */}
      <span className="sr-only">User Profile Icon</span>
      <div className="relative flex aspect-square h-full w-full">
        <User2 className="relative h-6 w-6" />
      </div>
    </Avatar>
  );
};

export default UserIcon;
