import { motion } from "motion/react";
import { Hello } from "./features/onboarding/components/hello";

export default function App() {
  return (
    <motion.div>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Hello />
      </motion.div>
    </motion.div>
  );
}
