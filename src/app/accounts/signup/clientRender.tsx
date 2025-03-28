"use client";

import RegistrationFirstStep from "@/components/regPages/firstStep";
import RegistrationSecondStep from "@/components/regPages/secondStep";
import { useState } from "react";
import { RegAllStep } from "@/utils/types";
import RegistrationLastStep from "@/components/regPages/lastStep";

function SignUpClient() {
  const [step, setStep] = useState<"one" | "two" | "end">("one");
  const [data, setData] = useState<RegAllStep>({});

  return (
    <>
      {step === "two" ? (
        <RegistrationSecondStep
          setStep={setStep}
          data={data}
          setData={setData}
        />
      ) : step === "end" ? (
        <RegistrationLastStep setStep={setStep} data={data} />
      ) : (
        <RegistrationFirstStep
          setStep={setStep}
          data={data}
          setData={setData}
        />
      )}
    </>
  );
}

export default SignUpClient;
