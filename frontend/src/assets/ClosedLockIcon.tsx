import SVGIcon, { type IconProps } from "./SVGIcon";

export default function ClosedLockIcon({
  className = "",
  viewBox = "0 0 24 24",
  onClick = () => {}
}: IconProps) {
  return (
    <SVGIcon
      className={className}
      testID="closed-lock-icon"
      viewBox={viewBox}
      onClick={onClick}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
      />
    </SVGIcon>
  );
}
