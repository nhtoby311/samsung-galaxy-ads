import { useAppStore } from "../store";
import { useColorTransition } from "../3D/TransitionMaterial/useColorTransition";

const COLORS = [
  { label: "Lavender", value: "#8977c1" },
  { label: "Midnight", value: "#1a1a2e" },
  { label: "Sage", value: "#7a9e7e" },
  { label: "Coral", value: "#e07a5f" },
  { label: "Ice", value: "#b8d8e8" },
  { label: "Sand", value: "#c9a96e" },
];

export function ColorPicker() {
  const currentPhoneColor = useAppStore((s) => s.currentPhoneColor);
  const { transitionTo, isTransitioning } = useColorTransition();

  return (
    <div
      style={{
        position: "fixed",
        bottom: 32,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: 12,
        padding: "12px 20px",
        borderRadius: 40,
        background: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(12px)",
        zIndex: 100,
      }}
    >
      {COLORS.map((c) => {
        const isActive = currentPhoneColor === c.value;
        return (
          <button
            key={c.value}
            title={c.label}
            onClick={() => transitionTo(c.value)}
            disabled={isActive || isTransitioning}
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: c.value,
              border: isActive ? "3px solid white" : "2px solid transparent",
              cursor: isActive ? "default" : "pointer",
              opacity: isTransitioning && !isActive ? 0.5 : 1,
              transition: "border 0.2s, opacity 0.2s",
              outline: "none",
              padding: 0,
            }}
          />
        );
      })}
    </div>
  );
}
