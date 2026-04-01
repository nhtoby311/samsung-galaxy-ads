import styled from "styled-components";
import EyeLock from "./SVG/EyeLock";
import EyeUnlock from "./SVG/EyeUnlock";
import Magic from "./SVG/Magic";
import Paint from "./SVG/Paint";
import { useState } from "react";
import BackArrow from "./SVG/BackArrow";
import { ColorPicker } from "./ColorPicker";
import { motion, AnimatePresence } from "motion/react";
import { useAppStore } from "../store";

const groupVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
  exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, x: 8, transition: { duration: 0.15 } },
};

export default function DynamicIsland() {
  const [menuState, setMenuState] = useState<"default" | "colorsPicker">(
    "default",
  );
  const isPrivacyDisplay = useAppStore((s) => s.isPrivacyDisplay);
  const togglePrivacyDisplay = useAppStore((s) => s.togglePrivacyDisplay);
  const isVideoPlaying = useAppStore((s) => s.isVideoPlaying);
  const setIsVideoPlaying = useAppStore((s) => s.setIsVideoPlaying);

  return (
    <Container
      layout
      transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {menuState === "default" ? (
          <Group
            key="default"
            variants={groupVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <MotionSVGContainer
              layout
              variants={itemVariants}
              onClick={() => setMenuState("colorsPicker")}
            >
              <Paint />
            </MotionSVGContainer>

            <MotionSVGContainer
              layout
              variants={itemVariants}
              onClick={togglePrivacyDisplay}
            >
              {isPrivacyDisplay ? <EyeLock /> : <EyeUnlock />}
            </MotionSVGContainer>

            <StyledMagicMotionSVGContainer
              layout
              variants={itemVariants}
              onClick={() => setIsVideoPlaying(true)}
              disabled={isVideoPlaying}
              $isPlaying={isVideoPlaying}
            >
              <Magic />
            </StyledMagicMotionSVGContainer>
          </Group>
        ) : (
          <Group
            key="colorsPicker"
            variants={groupVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <MotionSVGContainer
              layout
              variants={itemVariants}
              onClick={() => setMenuState("default")}
            >
              <BackArrow />
            </MotionSVGContainer>
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { duration: 0.3, delay: 0.25 },
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.06 }}
            >
              <ColorPicker />
            </motion.div>
          </Group>
        )}
      </AnimatePresence>
    </Container>
  );
}

const Container = styled(motion.div)`
  pointer-events: all;
  position: relative;
  display: flex;
  padding: 17px 22px;
  background: rgba(0, 0, 0, 0.52);
  border-radius: 41px;
`;

const Group = styled(motion.div)`
  display: flex;
  gap: 20px;
  align-items: center;
`;

const MotionSVGContainer = styled(motion.button)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 5px;
  cursor: pointer;
  border: none;
  background: none;
`;

const StyledMagicMotionSVGContainer = styled(MotionSVGContainer)<any>`
  & svg {
    opacity: ${(props: { $isPlaying: boolean }) =>
      props.$isPlaying ? 0.4 : 1};
    transition: opacity 0.3s;
  }
`;
