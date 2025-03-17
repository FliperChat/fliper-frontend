"use client";

import RegistrationFirstStep from "@/components/regPages/firstStep";
import RegistrationSecondStep from "@/components/regPages/secondStep";
import { useState } from "react";
import RegistrationLastStep from "./lastStep";

function SignUpMain() {
  const [step, setStep] = useState<"one" | "two" | "end">("one");

  if (step === "two") return <RegistrationSecondStep setStep={setStep} />;
  else if (step === "end") return <RegistrationLastStep setStep={setStep} />;
  else return <RegistrationFirstStep setStep={setStep} />;
}

export default SignUpMain;
