"use client";

import RegistrationFirstStep from "@/components/regPages/firstStep";
import RegistrationSecondStep from "@/components/regPages/secondStep";
import { useState } from "react";
import RegistrationLastStep from "./lastStep";
import { RegAllStep } from "@/utils/types";

function SignUpMain() {
  const [step, setStep] = useState<"one" | "two" | "end">("one");
  const [data, setData] = useState<RegAllStep>({});

  if (step === "two")
    return (
      <RegistrationSecondStep setStep={setStep} data={data} setData={setData} />
    );
  else if (step === "end")
    return <RegistrationLastStep setStep={setStep} data={data} />;
  else
    return (
      <RegistrationFirstStep setStep={setStep} data={data} setData={setData} />
    );
}

export default SignUpMain;
