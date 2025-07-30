"use client";

import RegistrationFirstStep from "@/components/regPages/firstStep";
import RegistrationSecondStep from "@/components/regPages/secondStep";
import { useState } from "react";
import { RegAllStep } from "@/utils/types";
import RegistrationLastStep from "@/components/regPages/lastStep";

function SignUpClient() {
  const [step, setStep] = useState<"one" | "two" | "end">("one");
  const [data, setData] = useState<RegAllStep>({});

  const renderStep = () => {
    switch (step) {
      case "two":
        return (
          <RegistrationSecondStep
            setStep={setStep}
            data={data}
            setData={setData}
          />
        );
      case "end":
        return <RegistrationLastStep setStep={setStep} data={data} />;
      default:
        return (
          <RegistrationFirstStep
            setStep={setStep}
            data={data}
            setData={setData}
          />
        );
    }
  };

  return <>{renderStep()}</>;
}

export default SignUpClient;
