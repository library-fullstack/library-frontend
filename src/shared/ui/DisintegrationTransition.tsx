import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DisintegrationTransitionProps {
  children: React.ReactNode;
  uniqueKey: string;
}

// đống hiệu ứng
export default function DisintegrationTransition({
  children,
  uniqueKey,
}: DisintegrationTransitionProps): React.ReactElement {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={uniqueKey}
        initial={{
          opacity: 0,
          y: 10,
          scale: 0.98,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        exit={{
          opacity: 0,
          y: -10,
          scale: 0.98,
        }}
        transition={{
          duration: 0.25,
          ease: [0.25, 0.1, 0.25, 1],
        }}
        style={{
          width: "100%",
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
