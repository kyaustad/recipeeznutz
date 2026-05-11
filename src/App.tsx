import { motion } from "motion/react";
import { OnboardingManager } from "./features/onboarding/components/onboarding-manager";
import { useState } from "react";
import { Dashboard } from "./features/dashboard/components/dashboard";
export default function App() {
  const [onboardingComplete, setOnboardingComplete] = useState<boolean>(
    localStorage.getItem("onboardingComplete") === "true",
  );
  return (
    <motion.div className="flex min-h-0 flex-1 flex-col">
      <motion.div
        className="flex min-h-0 flex-1 flex-col"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {!onboardingComplete ? (
          <OnboardingManager
            onOnboardingCompleted={() => setOnboardingComplete(true)}
          />
        ) : (
          <Dashboard></Dashboard>
        )}
      </motion.div>
    </motion.div>
  );
}
