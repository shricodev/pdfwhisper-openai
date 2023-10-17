import HankoProfile from "@/components/HankoProfile/HankoProfile";
import { LogoutBtn } from "@/components/HankoLogout/LogoutBotton";

type Props = {};

const page = (props: Props) => {
  return (
    <div className="mx-auto w-fit flex flex-col justify-center space-y-6 px-6">
      <HankoProfile />
      <LogoutBtn />
    </div>
  );
};

export default page;
