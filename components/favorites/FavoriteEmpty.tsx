import { Heart } from "lucide-react";

interface FavoriteEmptyProps {
    isSearching: boolean;
    onClearSearch: () => void;
}

export default function FavoriteEmpty({ isSearching, onClearSearch }: FavoriteEmptyProps) {
    return (
        <div className="col-span-1 md:col-span-2 lg:col-span-4 py-24 flex flex-col items-center justify-center border border-dashed border-zinc-800/80 rounded-3xl bg-zinc-900/10">
            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4">
                <Heart className="w-8 h-8 text-zinc-700" />
            </div>
            <h3 className="text-white font-bold text-xl mb-2">Tarif Bulunamadı</h3>
            <p className="text-zinc-500 font-medium text-center max-w-sm">
                {isSearching
                    ? "Aradığınız kriterlere uygun kaydedilmiş tarif bulamadık."
                    : "Henüz burası boş. Keşfet sayfasından beğendiğiniz tarifleri kaydedebilirsiniz."}
            </p>
            {isSearching && (
                <button
                    onClick={onClearSearch}
                    className="mt-6 text-sm font-bold text-orange-500 hover:text-orange-400 transition-colors"
                >
                    Aramayı Temizle
                </button>
            )}
        </div>
    );
}
