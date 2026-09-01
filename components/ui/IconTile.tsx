import { Icon, type IconName } from "@/components/ui/Icon";

type Tone = "green" | "sky" | "coral" | "lavender";

const TONES: Record<Tone, string> = {
  green: "bg-green-soft",
  sky: "bg-sky-soft",
  coral: "bg-coral-soft",
  lavender: "bg-lavender-soft",
};

const SIZES = {
  sm: "size-10",
  md: "size-12",
  lg: "size-14",
} as const;

export function IconTile({
  icon,
  tone = "green",
  size = "md",
  className = "",
}: {
  icon: IconName;
  tone?: Tone;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  return (
    <span className={`tile ${TONES[tone]} ${SIZES[size]} ${className}`.trim()}>
      <Icon
        name={icon}
        className={size === "lg" ? "size-6" : "size-5"}
        strokeWidth={2.25}
      />
    </span>
  );
}
