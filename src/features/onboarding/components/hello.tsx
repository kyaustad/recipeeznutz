import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
export function Hello() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.75, ease: "easeInOut" }}
      className="flex flex-col items-center justify-center min-h-[90dvh] p-16"
    >
      <Card className="p-8 w-full max-w-md h-full min-h-48 flex flex-col items-center justify-center">
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2.5, delay: 0.25, ease: "easeInOut" }}
          className="text-7xl font-lobster"
        >
          Hello!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2.5, delay: 0.5, ease: "easeInOut" }}
          className="text-base  text-muted-foreground"
        >
          Welcome to <span className="font-bold">RecipeezNutz</span>!
        </motion.p>
      </Card>
    </motion.div>
  );
}
