import type { HistoryItem } from "../services/data";

interface HistoryCardProps {
  item: HistoryItem;
}

export default function HistoryCard({ item }: HistoryCardProps) {
  // Formatação da data para pt-BR (Ex: 26 de nov às 14:30)
  const formattedDate = new Date(item.shown_at).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  });

  return (
    <div className="min-w-[85%] md:min-w-[30%] h-64 relative rounded-xl overflow-hidden shadow-lg border border-cinemind-white/10 snap-center group shrink-0 bg-black transition-all duration-300 hover:border-cinemind-pink/50">
      {item.thumbnail_url ? (
        <img
          src={item.thumbnail_url}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-40"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-cinemind-white/20 font-cinemind-sans text-4xl">
          Imagem não encontrada
        </div>
      )}

      <div className="absolute inset-0 bg-linear-to-t from-cinemind-dark via-transparent to-transparent" />

      <div className="absolute bottom-0 p-4 w-full flex flex-col items-start gap-1">
        <span className="bg-cinemind-blue text-cinemind-white font-cinemind-sans text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest shadow-sm mb-1">
          {item.mood_name}
        </span>

        <h3 className="text-cinemind-white font-cinemind-sans text-2xl font-bold leading-tight drop-shadow-md line-clamp-2">
          {item.title}
        </h3>

        <div
          className="
            grid grid-rows-[0] opacity-0 
            group-hover:grid-rows-1 group-hover:opacity-100 group-active:grid-rows-1 group-active:opacity-100
            transition-all duration-500 ease-in-out
          "
        >
          <div className="overflow-hidden">
            <p className="text-cinemind-yellow font-cinemind-serif text-base italic font-bold mt-2 flex items-center gap-2">
              Recomendado em: {formattedDate}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
