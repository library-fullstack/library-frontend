import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Box } from "@mui/material";

interface DisintegrationTransitionProps {
  children: React.ReactNode;
  uniqueKey: string;
}

// hiệu ứng ở auth
const generateParticles = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 8 + 3,
    delay: Math.random() * 0.3,
    duration: Math.random() * 1 + 0.8,
    color: `rgba(${180 + Math.random() * 75}, ${130 + Math.random() * 90}, ${
      90 + Math.random() * 70
    }, ${0.7 + Math.random() * 0.3})`,
    rotation: Math.random() * 360,
    velocityX: (Math.random() - 0.5) * 150,
    velocityY: Math.random() * 80 + 40,
  }));
};

export default function DisintegrationTransition({
  children,
  uniqueKey,
}: DisintegrationTransitionProps): React.ReactElement {
  const particles = React.useMemo(() => generateParticles(120), []);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={uniqueKey}
        initial={{
          opacity: 0,
          x: 80,
          filter: "blur(15px) brightness(0.4) saturate(0.5)",
          scale: 0.95,
        }}
        animate={{
          opacity: 1,
          x: 0,
          filter: "blur(0px) brightness(1) saturate(1)",
          scale: 1,
        }}
        exit={{
          opacity: [1, 0.8, 0.4, 0],
          x: -80,
          filter: "blur(25px) brightness(0.3) saturate(0.2) contrast(0.8)",
          scale: [1, 0.95, 0.85, 0.75],
          transition: {
            duration: 1.2,
            ease: [0.65, 0, 0.35, 1],
            times: [0, 0.3, 0.7, 1],
          },
        }}
        transition={{
          duration: 0.75,
          ease: [0.22, 1, 0.36, 1],
          delay: 0.15,
        }}
        style={{
          width: "100%",
          position: "relative",
        }}
      >
        <Box
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 1,
            transition: { duration: 1.2 },
          }}
          sx={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 10,
            overflow: "visible",
          }}
        >
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{
                x: `${particle.x}%`,
                y: `${particle.y}%`,
                opacity: 0,
                scale: 0,
                rotate: particle.rotation,
              }}
              animate={{
                x: `${particle.x}%`,
                y: `${particle.y}%`,
                opacity: 0,
                scale: 0,
                rotate: particle.rotation,
              }}
              exit={{
                x: `${particle.x + particle.velocityX}%`,
                y: `${particle.y + particle.velocityY}%`,
                opacity: [0, 1, 0.9, 0.7, 0.4, 0],
                scale: [0, 1.2, 1.5, 1.2, 0.8, 0.2],
                rotate: particle.rotation + (Math.random() * 720 - 360),
                transition: {
                  duration: particle.duration,
                  delay: particle.delay,
                  ease: [0.25, 0.46, 0.45, 0.94],
                },
              }}
              style={{
                position: "absolute",
                width: particle.size,
                height: particle.size,
                borderRadius:
                  Math.random() > 0.3 ? "50%" : `${Math.random() * 40}%`,
                background: particle.color,
                boxShadow: `0 0 ${particle.size * 3}px ${particle.color}, 0 0 ${
                  particle.size * 1.5
                }px rgba(255, 200, 150, 0.4)`,
              }}
            />
          ))}
        </Box>

        {[0, 1, 2].map((layer) => (
          <Box
            key={layer}
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0 }}
            exit={{
              opacity: [0, 0.3 - layer * 0.1, 0.15, 0],
              x: [-30 - layer * 20, -180 - layer * 30],
              transition: {
                duration: 0.8 + layer * 0.1,
                delay: layer * 0.05,
              },
            }}
            sx={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background: `
                linear-gradient(
                  ${90 + layer * 10}deg,
                  transparent 0%,
                  rgba(255, 200, 150, ${0.08 - layer * 0.02}) 15%,
                  rgba(255, 180, 120, ${0.12 - layer * 0.03}) 35%,
                  rgba(200, 150, 100, ${0.1 - layer * 0.02}) 55%,
                  rgba(255, 200, 150, ${0.08 - layer * 0.02}) 75%,
                  transparent 100%
                )
              `,
              filter: `blur(${25 + layer * 5}px)`,
              zIndex: 9 - layer,
            }}
          />
        ))}

        <Box
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0 }}
          exit={{
            opacity: [0, 0.2, 0.15, 0],
            transition: { duration: 0.5, times: [0, 0.3, 0.7, 1] },
          }}
          sx={{
            position: "absolute",
            inset: "-20px",
            pointerEvents: "none",
            background: `
              radial-gradient(circle at 20% 30%, rgba(255, 150, 80, 0.15) 0%, transparent 40%),
              radial-gradient(circle at 80% 70%, rgba(255, 180, 100, 0.12) 0%, transparent 35%),
              radial-gradient(circle at 50% 50%, rgba(200, 120, 60, 0.1) 0%, transparent 50%)
            `,
            filter: "blur(15px)",
            zIndex: 8,
          }}
        />

        <Box sx={{ position: "relative", zIndex: 1 }}>{children}</Box>
      </motion.div>
    </AnimatePresence>
  );
}
