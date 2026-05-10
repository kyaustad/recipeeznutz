import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { BadgeCheck } from "lucide-react";
import { ANIM } from "@/lib/utils";

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
          <li>{`Recipes can include a: `}</li>
          <ul className="list-decimal ml-10 text-sm">
            <li>Name</li>
            <li>{`Category (e.g. Appetizer, Entrée, Dessert, etc.)`}</li>
            <li>{`Ingredients`}</li>
            <li>{`Steps or Directions`}</li>
            <li>{`Images`}</li>
            <li>{`Notes`}</li>
          </ul>
          <li>
            {`You can export your collective recipe book to the plaintext`}{" "}
            <span className="font-bold italic">.NutBook</span>
            {` format for external backup or to share with others.`}
          </li>
          <li>
            {`Import other peoples `}
            <span className="italic font-bold">.NutBook</span>
            {`s and add to or overwrite your existing collection`}
          </li>
        </motion.ul>
      </Card>
    </motion.div>
  );
}

export function GetStarted() {
  return (
    <motion.div
      initial={ANIM.initial}
      animate={ANIM.animate}
      transition={ANIM.transition.top}
      className="flex flex-col items-center justify-center p-16"
    >
      <Card className="p-8 w-full max-w-md min-w-96 h-full min-h-48 flex flex-col items-center justify-center">
        <motion.div
          initial={ANIM.initial}
          animate={ANIM.animate}
          transition={ANIM.transition.mid}
          className="max-w-[64px] aspect-square mt-8 mb-8"
        >
          <BadgeCheck className="size-16 p-0 mb-6 text-emerald-500"></BadgeCheck>
        </motion.div>
        <motion.p
          initial={ANIM.initial}
          animate={ANIM.animate}
          transition={ANIM.transition.bottom}
          className="text-base line-clamp-4 text-wrap text-muted-foreground"
        >
          {`Get started creating your NutBook now!`}
        </motion.p>
      </Card>
    </motion.div>
  );
}
