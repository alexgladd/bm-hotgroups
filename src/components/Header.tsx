import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faTowerBroadcast,
  faInfoCircle,
  faNewspaper,
  faCoffee,
} from "@fortawesome/free-solid-svg-icons";
import { twJoin } from "tailwind-merge";

const menuItems = [
  {
    icon: faInfoCircle,
    label: "About",
    url: "https://www.brandmeisteractivity.live/",
  },
  {
    icon: faNewspaper,
    label: "News",
    url: "https://www.brandmeisteractivity.live/#news",
  },
  {
    icon: faCoffee,
    label: "Support",
    url: "https://www.brandmeisteractivity.live/#support",
  },
];

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="px-4 flex items-center fixed top-0 w-screen h-16 bg-primary text-light z-50">
      <h1 className="text-base md:text-xl lg:text-2xl flex-auto flex-shrink-0 tracking-wide md:tracking-wider">
        <FontAwesomeIcon icon={faTowerBroadcast} />
        <span className="ml-2 font-bold">Brandmeister Top Activity</span>
      </h1>
      <button
        type="button"
        className="p-2 flex flex-col justify-center md:hidden"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <FontAwesomeIcon
          icon={faBars}
          className={
            menuOpen
              ? "size-6 transition-transform rotate-90"
              : "size-6 transition-transform"
          }
        />
      </button>
      <div className="absolute top-0 bottom-0 left-0 right-0 -z-10 bg-primary md:hidden"></div>
      <nav
        role="navigation"
        className={twJoin(
          "py-2 md:py-0 absolute md:static flex flex-col md:flex-row top-16 left-0 right-0 -z-20 bg-primary-500 md:bg-primary text-light transition md:transition-none",
          menuOpen
            ? "translate-y-0 opacity-100"
            : "-translate-y-full md:translate-y-0 opacity-0 md:opacity-100"
        )}
      >
        {menuItems.map((m) => (
          <div>
            <a
              href={m.url}
              target="_blank"
              className="py-2 md:py-0 md:h-16 md:px-4 md:text-lg lg:text-xl flex justify-center md:justify-normal items-center gap-2 hover:bg-primary-600 md:hover:bg-primary-700 active:bg-primary-700 transition-colors"
            >
              <div>
                <FontAwesomeIcon icon={m.icon} fixedWidth />
              </div>
              <div>{m.label}</div>
            </a>
          </div>
        ))}
      </nav>
    </header>
  );
}

export default Header;
