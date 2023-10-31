import type { ComponentType } from "react";

import dynamic from "next/dynamic";

// These are imported dynamically to get rid of a hanko bug.
// ReferenceError: CustomEvent is not defined
const HankoProfile = dynamic(
  () => import("@/components/HankoProfile/HankoProfile"),
  {
    ssr: false,
  },
);

const LogoutButton = dynamic(
  () => import("@/components/HankoLogout/LogoutBotton"),
  {
    ssr: false,
  },
);

interface Props {}

const Page: ComponentType<Props> = (props) => {
  return (
    <div className="mx-auto flex w-fit flex-col justify-center space-y-6 px-6">
      <HankoProfile />
      <LogoutButton />
    </div>
  );
};

export default Page;
