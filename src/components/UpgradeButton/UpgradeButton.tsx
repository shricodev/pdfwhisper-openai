"use client";

import { useContext, useEffect, useState } from "react";

import axios from "axios";
import { ArrowRight, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

import { UserDataContext } from "../Providers/UserDataContext";

import { toast } from "@/hooks/use-toast";

import { TKhaltiResponse } from "@/types/subscription";

import { Button } from "../ui/Button";

const UpgradeButton = () => {
  const { email, id } = useContext(UserDataContext);
  const [isDataFetched, setIsDataFetched] = useState<boolean>(false);

  useEffect(() => {
    if (email && id) {
      setIsDataFetched(true);
    }
  }, [email, id]);

  const { data, mutate: createSubscription } = useMutation({
    mutationFn: async () => {
      const payload = {
        customer_info: {
          email,
          name: id,
        },
      };
      const { data } = await axios.post("/api/payment", payload);
      return data as TKhaltiResponse;
    },
    onSuccess: (data) => {},
    onError: () => {
      return toast({
        title: "There was a problem creating your subscription",
        description: "Please refresh this page and try again later",
        variant: "destructive",
      });
    },
  });

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
