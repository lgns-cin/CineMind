import type { Genre } from "../services/onboardingService";

interface GenreGridProps {
  genres: Genre[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}

export default function GenreGrid({ genres, selectedIds, onToggle }: GenreGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-4xl">
      {genres.map((genre) => {
        const isSelected = selectedIds.includes(genre.id);
        return (
          <button
            key={genre.id}
            onClick={() => onToggle(genre.id)}
            className={`
              p-4 rounded-lg font-cinemind-sans font-semibold text-lg transition-all shadow-md
              ${
                isSelected
                  ? "bg-cinemind-yellow text-cinemind-dark scale-105 ring-2 ring-cinemind-white"
                  : "bg-cinemind-light text-cinemind-white hover:bg-opacity-80"
              }
            `}
          >
            {genre.name}
          </button>
        );
      })}
    </div>
  );
}