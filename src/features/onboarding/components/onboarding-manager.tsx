import { Description, Features, Hello } from "./onboarding-components";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function OnboardingManager() {
  const [stage, setStage] = useState(1);

  const getStageComponent = () => {
    if (stage === 1) {
      return <Hello></Hello>;
    } else if (stage === 2) {
      return <Description></Description>;
    } else if (stage === 3) {
      return <Features></Features>;
    } else {
      return <div className="min-h-48"></div>;
    }
  };

  return (
    <div className="min-w-full min-h-[90vh] flex flex-col items-center justify-center">
      {getStageComponent()}
      <div className={"w-md flex flex-row justify-between px-16"}>
        <Button
          size="lg"
          variant="outline"
          disabled={stage === 1}
          onClick={(e) => setStage(stage - 1)}
        >
          Previous
        </Button>
        <Button
          size="lg"
          variant="default"
          disabled={stage === 8}
          onClick={(e) => setStage(stage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
