// frontend/src/components/Navbar.tsx

import type { JSX } from "react";
import { useNavigate } from "react-router-dom";
import { StorageKeys } from "../utils/constants";
import LogoutIcon from "../assets/LogoutIcon";
import HomeIcon from "../assets/HomeIcon";
import ProfileIcon from "../assets/ProfileIcon";

interface NavBarProps {
  className?: string;
  icons?: () => JSX.Element[];
  selectedIcon?: number;
}

/**
 * Define os ícones e ações padrão da barra de navegação.
 * Ordem dos ícones:
 * 0: Logout
 * 1: Home
 * 2: Profile
 */
const DEFAULT_NAVBAR_ICONS = () => {
  const navigate = useNavigate();

  const goToLoginPage = () => navigate("/login");
  const goToHomePage = () => navigate("/home");
  const goToProfilePage = () => navigate("/profile");

  const logout = () => {
    localStorage.removeItem(StorageKeys.ACCESS_TOKEN);
    goToLoginPage();
  };

  const iconProperties =
    "size-12 rounded-full fill-none stroke-cinemind-white stroke-1 bg-cinemind-dark outline-2 outline-cinemind-light";
  const iconViewBox = "-4 -4 32 32";

  return [
    <LogoutIcon
      key="logout"
      className={iconProperties}
      viewBox={iconViewBox}
      onClick={logout}
    />,

    <HomeIcon
      key="home"
      className={iconProperties}
      viewBox={iconViewBox}
      onClick={goToHomePage}
    />,

    <ProfileIcon
      key="profile"
      className={iconProperties}
      viewBox={iconViewBox}
      onClick={goToProfilePage}
    />
  ];
};

export default function NavBar({
  className = "",
  icons = DEFAULT_NAVBAR_ICONS,
  selectedIcon = 1
}: NavBarProps) {
  return (
    <div className={className}>
      {icons().map((icon, index) => {
        return (
          <div
            key={index}
            className={`transition-transform duration-300 ${
              selectedIcon == index
                ? "scale-150"
                : "cursor-pointer hover:scale-120"
            }`}
          >
            {icon}
          </div>
        );
      })}
    </div>
  );
}
