import { motion } from "motion/react";
import { OnboardingManager } from "./features/onboarding/components/onboarding-manager";

export default function App() {
  return (
    <motion.div>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <OnboardingManager />
      </motion.div>
    </motion.div>
  );
}
