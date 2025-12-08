import SVGIcon, { type IconProps } from "./SVGIcon";

export default function XMarkIcon({
  className = "",
  viewBox = "0 0 24 24",
  onClick = () => {}
}: IconProps) {
  return (
    <SVGIcon
      className={className}
      testID="x-mark-icon"
      viewBox={viewBox}
      onClick={onClick}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18 18 6M6 6l12 12"
      />
    </SVGIcon>
  );
}
