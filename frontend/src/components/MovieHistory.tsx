import type { HistoryItem } from "../services/data";
import HistoryCard from "./HistoryCard";

interface MovieHistoryProps {
  className?: string;
  items?: HistoryItem[];
}

export default function MovieHistory({
  className = "",
  items = []
}: MovieHistoryProps) {
  return (
    <div className={className}>
      {items.length > 0 ? (
        <div className="flex overflow-x-auto gap-4 p-4 snap-center snap-mandatory w-full h-full items-center scrollbar">
          {items.map(item => (
            <HistoryCard
              key={item.id}
              item={item}
            />
          ))}
        </div>
      ) : (
        <p className="flex text-center text-cinemind-white font-cinemind-serif italic">
          Não conseguimos achar nenhuma recomendação ainda.
        </p>
      )}
    </div>
  );
}
