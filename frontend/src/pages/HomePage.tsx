import ClosedLockIcon from "../assets/ClosedLockIcon";

export default function Home() {
  const x = [
    "Alegria",
    "Relaxamento",
    "Tristeza",
    "Medo/Tensão",
    "Curiosidade"
  ];

  return (
    <div
      className="
        w-screen h-screen select-none
        bg-linear-to-t from-cinemind-dark to-cinemind-light
        grid grid-rows-10 grid-cols-3
        place-content-center-safe place-items-center-safe
      "
    >
      <div
        className="
          flex grow place-content-center-safe place-items-center-safe
          row-start-1 row-span-1 col-start-2 w-full h-full
          font-cinemind-serif text-cinemind-white italic
        "
      >
        CineMind
      </div>
      <div
        className="
          flex grow place-content-center-safe place-items-center-safe
          row-start-2 row-span-8 col-start-1 col-span-3 w-full h-full
        "
      >
        <div className="size-160 relative">
          <ClosedLockIcon
            className="
              w-4/10 h-4/10 left-3/10 top-3/10 absolute 
              bg-cinemind-pink rounded-full 
              fill-none stroke-cinemind-white stroke-1
              z-10
            "
          />
          {x.map((value, index) => {
            return (
              <button
                className="
                  w-1/5 h-1/5 left-2/5 top-2/5 absolute
                  align-middle text-center z-0
                "
                style={{
                  rotate: `${(360 / x.length) * index}deg`
                }}
              >
                <p
                  className="
                      w-full h-full flex place-items-center place-content-center
                    bg-cinemind-blue rounded-full
                    text-cinemind-white font-cinemind-sans text-lg
                      animate-moveout
                    "
                  style={{
                    rotate: `${-(360 / x.length) * index}deg`
                  }}
                >
                  {value}
                </p>
              </button>
            );
          })}
        </div>
      </div>
      <div
        className="flex grow place-content-center-safe place-items-center-safe
                   row-start-10 row-span-8 col-start-2 w-full h-full
                  bg-cinemind-pink"
      >
        +
      </div>
    </div>
  );
}
