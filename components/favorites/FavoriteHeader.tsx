import { Search, ListFilter, ChevronDown } from "lucide-react";

interface FavoriteHeaderProps {
    totalCount: number;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    sortBy: string;
    setSortBy: (sort: any) => void;
}

const sortOptions = [
    { id: "newest_saved", label: "En Yakın Zamanda Eklenen" },
    { id: "oldest_saved", label: "En Eskiler" },
    { id: "alfabetik", label: "A-Z" },
    { id: "alfabetik_ters", label: "Z-A" }
];

export default function FavoriteHeader({
    totalCount,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy
}: FavoriteHeaderProps) {
    const activeLabel = sortOptions.find(opt => opt.id === sortBy)?.label || "Sırala";

    return (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
                <h1 className="text-3xl md:text-4xl font-black text-white capitalize mb-2">
                    Favori Tariflerim
                </h1>
                <p className="text-zinc-400 font-medium">{totalCount} tarif kaydedildi</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Tariflerde ara..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full sm:w-64 bg-zinc-900/50 border border-zinc-800/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 transition-all placeholder:text-zinc-600"
                    />
                </div>

                <div className="relative group">
                    <button className="h-10 px-4 bg-zinc-900/50 border border-zinc-800/80 rounded-xl text-sm font-bold text-zinc-300 flex items-center gap-2 hover:border-zinc-700 hover:text-white transition-colors">
                        <ListFilter className="w-4 h-4" />
                        <span className="truncate max-w-[100px] sm:max-w-none">
                            {sortBy === "newest_saved" ? "En Yeni" : sortBy === "oldest_saved" ? "En Eski" : activeLabel}
                        </span>
                        <ChevronDown className="w-4 h-4 text-zinc-500 ml-1" />
                    </button>

                    {/* Dropdown menu */}
                    <div className="absolute right-0 top-full mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all origin-top-right z-20">
                        <div className="p-1">
                            {sortOptions.map(option => (
                                <button
                                    key={option.id}
                                    onClick={() => setSortBy(option.id as any)}
                                    className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg transition-colors ${sortBy === option.id ? "bg-orange-500/10 text-orange-400" : "text-zinc-300 hover:bg-zinc-800"
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
