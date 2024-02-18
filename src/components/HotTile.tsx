import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone, faMicrophoneSlash, faXmark } from "@fortawesome/free-solid-svg-icons";
import { twJoin } from "tailwind-merge";

const bgMap = [
  "bg-primary-50",
  "bg-primary-100",
  "bg-primary-200",
  "bg-primary-300",
  "bg-primary-400",
  "bg-primary-500",
  "bg-primary-600",
  "bg-primary-700",
  "bg-primary-800",
  "bg-primary-900",
];

function HotTile({
  tg,
  active,
  label,
  activePercent,
  onClick = () => {},
}: {
  tg: number;
  active: boolean;
  activePercent: number;
  label?: string;
  onClick?: () => void;
}) {
  const [hover, setHover] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseOver={() => setHover(true)}
      onMouseOut={() => setHover(false)}
      className={twJoin(
        "p-2 flex justify-between gap-x-2 border rounded-md hover:cursor-pointer transition-colors",
        bgMap[Math.min(Math.floor(activePercent * 10.0), 9)],
        activePercent < 0.4
          ? "text-primary-900 border-primary-400"
          : "text-primary-50 border-primary-900",
      )}
    >
      <div>
        <span className="font-bold">{tg}</span>
        {label && ` - ${label}`}
      </div>
      <div>
        {hover ? (
          <FontAwesomeIcon fixedWidth icon={faXmark} />
        ) : active ? (
          <FontAwesomeIcon fixedWidth icon={faMicrophone} beatFade />
        ) : (
          <FontAwesomeIcon
            fixedWidth
            icon={faMicrophoneSlash}
            className={twJoin(
              "opacity-25",
              activePercent < 0.4 ? "text-primary-900" : "text-primary-50",
            )}
          />
        )}
      </div>
    </div>
  );
}

export default HotTile;
