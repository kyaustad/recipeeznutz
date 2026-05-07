import ComponentShowcase from "./components/custom/component-showcase";
import { motion } from "motion/react";

export default function App() {
  return (
    <motion.div>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ComponentShowcase />
      </motion.div>
    </motion.div>
  );
}
