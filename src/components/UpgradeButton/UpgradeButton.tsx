"use client";

import { useEffect, useState } from "react";

import axios from "axios";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

import { toast } from "@/hooks/use-toast";

import { TKhaltiResponse } from "@/types/subscription";

import { Button, buttonVariants } from "../ui/Button";

interface Props {
  isSubscribed: boolean;
}

const UpgradeButton = ({ isSubscribed }: Props) => {
  // TODO: Change these with the actual values.
  const email = "",
    id = "";
  const [isDataFetched, setIsDataFetched] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (email && id) {
      setIsDataFetched(true);
    }
  }, [email, id]);

  const { mutate: createSubscription } = useMutation({
    mutationFn: async () => {
      const payload = {
        customer_info: {
          email,
          name: id,
        },
      };
      const {
        data: { data },
      } = await axios.post("/api/payment", payload);
      return data as TKhaltiResponse;
    },
    onSuccess: ({ payment_url }) => {
      router.push(payment_url);
    },
    onError: (error) => {
      return toast({
        title: "There was a problem creating your subscription",
        description: "Please refresh this page and try again later",
        variant: "destructive",
      });
    },
  });

  if (isSubscribed) {
    return (
      <Button
        className={buttonVariants({
          className: "w-full",
        })}
        disabled
      >
        Already Subscribed
        <ArrowRight className="ml-1.5 h-5 w-5" />
      </Button>
    );
  }

  return (
    <Button
      className="w-full"
      disabled={!isDataFetched}
      onClick={() => {
        createSubscription();
      }}
    >
      {isDataFetched ? (
        <>
          Upgrade Now
          <ArrowRight className="ml-1.5 h-5 w-5" />
        </>
      ) : (
        <Loader2 className="h-6 w-6 animate-spin text-zinc-200" />
      )}
    </Button>
  );
};

export default UpgradeButton;
