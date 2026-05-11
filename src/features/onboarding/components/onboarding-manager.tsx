import {
  Description,
  Features,
  Hello,
  GetStarted,
} from "./onboarding-components";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { ANIM } from "@/lib/utils";
import { motion } from "motion/react";

export function OnboardingManager({
  onOnboardingCompleted,
}: {
  onOnboardingCompleted: () => void;
}) {
  const [stage, setStage] = useState(1);

  const getStageComponent = () => {
    if (stage === 1) {
      return <Hello></Hello>;
    } else if (stage === 2) {
      return <Description></Description>;
    } else if (stage === 3) {
      return <Features></Features>;
    } else if (stage === 4) {
      return <GetStarted></GetStarted>;
    } else {
      return <div className="min-h-48"></div>;
    }
  };

  const completeOnboarding = () => {
    localStorage.setItem("onboardingComplete", "true");
    onOnboardingCompleted();
  };

  return (
    <div className="flex min-h-0 min-w-full flex-1 flex-col items-center justify-between overflow-y-auto py-4">
      {getStageComponent()}
      <motion.div
        initial={ANIM.initial}
        animate={ANIM.animate}
        transition={ANIM.transition.top}
        className={
          "w-md flex flex-row justify-between px-16 bg-primary-foreground/20 p-10 rounded-xl"
        }
      >
        <Button
          size="lg"
          variant="outline"
          disabled={stage === 1}
          onClick={(_e) => setStage(stage - 1)}
        >
          Previous
        </Button>
        {stage < 4 ? (
          <Button
            size="lg"
            variant="default"
            disabled={stage === 8}
            onClick={(_e) => setStage(stage + 1)}
          >
            Next
          </Button>
        ) : (
          <Button
            size="lg"
            variant="default"
            disabled={stage === 8}
            onClick={(_e) => completeOnboarding()}
          >
            <Check></Check>Finish
          </Button>
        )}
      </motion.div>
    </div>
  );
}
