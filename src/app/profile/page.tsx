import dynamic from "next/dynamic";
import type { ComponentType } from "react";

// These are imported dynamically to get rid of a hanko bug.
// ReferenceError: CustomEvent is not defined
const HankoProfile = dynamic(
  () => import("@/components/HankoProfile/HankoProfile"),
  {
    ssr: false,
  }
);
import LogoutButton from "@/components/HankoLogout/LogoutBotton";

type Props = {};

const Page: ComponentType<Props> = (props) => {
  return (
    <div className="mx-auto w-fit flex flex-col justify-center space-y-6 px-6">
      <HankoProfile />
      <LogoutButton />
    </div>
  );
};

export default Page;
