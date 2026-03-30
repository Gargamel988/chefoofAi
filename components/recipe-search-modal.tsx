import { motion, AnimatePresence } from "framer-motion"
import { Search, ChevronRight } from "lucide-react"

interface RecipeSearchModalProps {
    isOpen: boolean
    onClose: () => void
    onSelectRecipe: (recipe: any) => void
}

export function RecipeSearchModal({ isOpen, onClose, onSelectRecipe }: RecipeSearchModalProps) {
    if (!isOpen) return null

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-100 flex items-start justify-center pt-[10vh] px-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/90 backdrop-blur-md"
                />
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden shadow-edge relative z-50"
                >
                    <div className="p-4 border-b border-white/5 flex items-center gap-4">
                        <Search className="w-6 h-6 text-zinc-500" />
                        <input
                            autoFocus
                            placeholder="Favori tariflerini veya kaydedilenleri ara..."
                            className="flex-1 bg-transparent border-none outline-none text-xl font-medium text-white placeholder:text-zinc-700 h-14"
                        />
                        <div className="flex gap-1">
                            <kbd className="px-2 py-1 rounded bg-zinc-800 text-[10px] text-zinc-500 font-black border border-white/5">ESC</kbd>
                        </div>
                    </div>

                    <div className="p-4 max-h-[450px] overflow-y-auto custom-scrollbar">
                        <div className="px-3 mb-4 text-[10px] font-black uppercase tracking-widest text-orange-500/80">Popüler Kaydedilenler</div>
                        <div className="space-y-1">
                            {[
                                { title: "Izgara Somon ve Kuşkonmaz", cal: 420, time: 20, difficulty: "Kolay", color: "from-orange-500" },
                                { title: "Kinoa Salatası (Bol Yeşillikli)", cal: 310, time: 15, difficulty: "Kolay", color: "from-emerald-500" },
                                { title: "Fırınlanmış Bademli Brüksel Lahanası", cal: 280, time: 25, difficulty: "Orta", color: "from-amber-500" },
                                { title: "Yabani Mantarlı Risotto", cal: 540, time: 45, difficulty: "Zor", color: "from-rose-500" },
                            ].map((recipe, i) => (
                                <button
                                    key={i}
                                    onClick={() => onSelectRecipe(recipe)}
                                    className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-all text-left group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-2 h-2 rounded-full bg-linear-to-tr ${recipe.color} to-transparent`} />
                                        <div>
                                            <div className="font-bold text-zinc-200 group-hover:text-white transition-colors">{recipe.title}</div>
                                            <div className="flex gap-4 mt-1">
                                                <span className="text-[10px] font-black tracking-widest text-zinc-600 uppercase">{recipe.cal} KKAL</span>
                                                <span className="text-[10px] font-black tracking-widest text-zinc-600 uppercase">{recipe.time} DK</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Seçmek için tıkla</span>
                                        <ChevronRight className="w-4 h-4 text-orange-500" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-4 bg-black/40 border-t border-white/5 flex items-center justify-between">
                        <div className="flex gap-4">
                            <div className="flex items-center gap-1.5 text-[9px] font-bold text-zinc-600">
                                <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" /> ↑↓ Gezin
                            </div>
                            <div className="flex items-center gap-1.5 text-[9px] font-bold text-zinc-600">
                                <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" /> ↵ Seç
                            </div>
                        </div>
                        <span className="text-[9px] font-black text-orange-500 uppercase tracking-[0.2em]">Cheefood Premium</span>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
