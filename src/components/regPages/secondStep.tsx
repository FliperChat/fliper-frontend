import { RegAllStep } from "@/utils/types";
import { Dispatch, SetStateAction } from "react";

function RegistrationSecondStep({
  setStep,
  data,
  setData,
}: {
  setStep: (step: "one" | "end") => void;
  data: RegAllStep;
  setData: Dispatch<SetStateAction<RegAllStep>>;
}) {
  return <>Register2</>;
}

export default RegistrationSecondStep;
