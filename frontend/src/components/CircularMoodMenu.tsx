import { useState, type JSX } from "react";
import type { Mood } from "../services/data";

interface CircularMoodMenuProps {
  className?: string;
  centerIcon: JSX.Element;
  moods: Mood[];
  onMoodClick?: (
    event: React.SyntheticEvent<Element, Event>,
    mood: Mood
  ) => void;
}

export default function CircularMoodMenu({
  className = "",
  centerIcon = <></>,
  moods = [],
  onMoodClick = () => {}
}: CircularMoodMenuProps) {
  const [isExpanded, setExpanded] = useState(false);
  const toggle = () => setExpanded(!isExpanded);

  return (
    <div className={className}>
      <div className={`size-160 relative`}>
        <div onClick={toggle}>{centerIcon}</div>
        {moods.map((mood, index) => {
          return (
            <button
              className="
                  w-1/5 h-1/5 left-2/5 top-2/5 absolute
                  align-middle text-center z-0
                "
              style={{
                rotate: `${(360 / moods.length) * index}deg`
              }}
              key={index}
              onClick={event => onMoodClick(event, mood)}
            >
              <p
                className={`
                    w-full h-full flex place-items-center place-content-center
                    bg-cinemind-blue rounded-full cursor-pointer
                    text-cinemind-white font-cinemind-sans text-lg
                    ${isExpanded && "animate-moveout"}
                  `}
                style={{
                  rotate: `${-(360 / moods.length) * index}deg`
                }}
              >
                {mood.name}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
