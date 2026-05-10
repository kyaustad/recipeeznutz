import { motion } from "motion/react";
import { Card } from "@/components/ui/card";

const ANIM = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: {
    top: { duration: 1.75, ease: "easeInOut" as const },
    mid: { duration: 2.5, delay: 0.5, ease: "easeInOut" as const },
    bottom: { duration: 2.5, delay: 0.5, ease: "easeInOut" as const },
  },
};

export function Hello() {
  return (
    <motion.div
      initial={ANIM.initial}
      animate={ANIM.animate}
      transition={ANIM.transition.top}
      className="flex flex-col items-center justify-center p-16"
    >
      <Card className="p-8 w-full max-w-md min-w-96 h-full min-h-48 flex flex-col items-center justify-center">
        <motion.h1
          initial={ANIM.initial}
          animate={ANIM.animate}
          transition={ANIM.transition.mid}
          className="text-7xl font-lobster"
        >
          Hello!
        </motion.h1>
        <motion.p
          initial={ANIM.initial}
          animate={ANIM.animate}
          transition={ANIM.transition.bottom}
          className="text-base  text-muted-foreground"
        >
          Welcome to <span className="font-bold">RecipeezNutz</span>!
        </motion.p>
      </Card>
    </motion.div>
  );
}

export function Description() {
  return (
    <motion.div
      initial={ANIM.initial}
      animate={ANIM.animate}
      transition={ANIM.transition.top}
      className="flex flex-col items-center justify-center p-16"
    >
      <Card className="p-8 w-full max-w-md min-w-96 h-full min-h-48 flex flex-col items-center justify-center">
        <motion.img
          initial={ANIM.initial}
          animate={ANIM.animate}
          transition={ANIM.transition.mid}
          className="max-w-[64px] aspect-square mt-8 mb-4 dark:invert"
          src="/icon-128x128.png"
        ></motion.img>
        <motion.p
          initial={ANIM.initial}
          animate={ANIM.animate}
          transition={ANIM.transition.bottom}
          className="text-base line-clamp-4 text-wrap text-muted-foreground"
        >
          <span className="font-bold">RecipeezNutz</span>
          {` is a simple, offline, and native application for managing your recipe book allowing you to create, update and store all your recipes in a single place!`}
        </motion.p>
      </Card>
    </motion.div>
  );
}

export function Features() {
  return (
    <motion.div
      initial={ANIM.initial}
      animate={ANIM.animate}
      transition={ANIM.transition.top}
      className="flex flex-col items-center justify-center p-16"
    >
      <Card className="p-8 w-full max-w-md min-w-96 h-full min-h-48 flex flex-col items-center justify-center">
        <motion.img
          initial={ANIM.initial}
          animate={ANIM.animate}
          transition={ANIM.transition.mid}
          className="max-w-[64px] aspect-square mt-8 mb-4 dark:invert"
          src="/new-features.png"
        ></motion.img>
        <motion.ul
          initial={ANIM.initial}
          animate={ANIM.animate}
          transition={ANIM.transition.bottom}
          className="text-base list-disc text-wrap text-muted-foreground"
        >
          <li>{`Create, update and delete recipes from your recipe book.`}</li>
          <li>{`Recipes can include a `}</li>
        </motion.ul>
      </Card>
    </motion.div>
  );
}
