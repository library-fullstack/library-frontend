import * as React from "react";
import { motion } from "framer-motion";
import { Box } from "@mui/material";

interface DisintegrationTransitionProps {
  children: React.ReactNode;
  uniqueKey: string;
}

const generateParticles = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 8 + 3,
    delay: Math.random() * 0.3,
    duration: Math.random() * 1.2 + 0.6,
    color: `rgba(${200 + Math.random() * 55}, ${150 + Math.random() * 80}, ${
      100 + Math.random() * 60
    }, ${0.7 + Math.random() * 0.3})`,
    rotation: Math.random() * 360,
    velocityX: (Math.random() - 0.5) * 200,
    velocityY: Math.random() * 150 + 50,
  }));
};

export default function DisintegrationTransition({
  children,
  uniqueKey,
}: DisintegrationTransitionProps): React.ReactElement {
  const particles = React.useMemo(() => generateParticles(120), []);

  return (
    <motion.div
      key={uniqueKey}
      initial={{
        opacity: 0,
        filter: "blur(10px)",
        scale: 0.98,
      }}
      animate={{
        opacity: 1,
        filter: "blur(0px)",
        scale: 1,
      }}
      exit={{
        opacity: 0,
        filter: "blur(20px)",
        scale: 0.95,
        transition: {
          duration: 1.0,
          ease: [0.76, 0, 0.24, 1],
        },
      }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        width: "100%",
        position: "relative",
      }}
    >
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0 }}
        exit={{
          opacity: 1,
          transition: { duration: 1.2 },
        }}
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 100,
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
              opacity: [0, 1, 0.9, 0.7, 0.5, 0],
              scale: [0, 1.5, 1.3, 1.1, 0.8, 0.2],
              rotate: particle.rotation + (Math.random() * 720 - 360),
              transition: {
                duration: particle.duration,
                delay: particle.delay,
                ease: [0.34, 1.56, 0.64, 1],
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
              }px rgba(255, 200, 150, 0.5)`,
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
            zIndex: 99 - layer,
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
          zIndex: 98,
        }}
      />

      <Box sx={{ position: "relative", zIndex: 50 }}>{children}</Box>
    </motion.div>
  );
}
