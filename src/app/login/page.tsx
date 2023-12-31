import dynamic from "next/dynamic";
// This is imported dynamically to get rid of a hanko bug.
// ReferenceError: CustomEvent is not defined
const HankoAuth = dynamic(() => import("@/components/HankoAuth/HankoAuth"), {
  ssr: false,
});

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <HankoAuth />
    </div>
  );
}
