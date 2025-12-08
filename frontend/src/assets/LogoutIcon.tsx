import SVGIcon, { type IconProps } from "./SVGIcon";

export default function LogoutIcon({
  className = "",
  viewBox = "0 0 24 24",
  onClick = () => {}
}: IconProps) {
  return (
    <SVGIcon
      className={className}
      testID="logout-icon"
      viewBox={viewBox}
      onClick={onClick}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
      />
    </SVGIcon>
  );
}
