import { Download, Info, Share2, ShoppingCart } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";

type ShoppingModalProps = {
    showShoppingModal: boolean;
    setShowShoppingModal: Dispatch<SetStateAction<boolean>>;
};

export function ShoppingModal({
    showShoppingModal, setShowShoppingModal
}: ShoppingModalProps) {

    const bgCard = "bg-zinc-900 border-zinc-800";

    return (
        <Dialog open={showShoppingModal} onOpenChange={setShowShoppingModal}>
            <DialogContent className="w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[85vh] p-0 gap-0 bg-zinc-900 border-zinc-800">
                <DialogHeader className="p-5 pb-4 bg-zinc-900 border-b border-zinc-800">
                    <DialogTitle className="text-xl font-black flex items-center gap-2"><ShoppingCart className="w-6 h-6 text-orange-500" /> Alışveriş Listesi</DialogTitle>
                    <DialogDescription className="hidden">Haftalık alışveriş listeniz</DialogDescription>
                </DialogHeader>
                <div className="p-1 border-y border-orange-500/20 bg-orange-500/5 px-5 py-3">
                    <p className="text-xs text-orange-500 font-bold flex items-center gap-1.5"><Info className="w-3.5 h-3.5" /> Bu liste planına uygun olarak otomatik oluşturulmuştur.</p>
                </div>

                <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
                    <div>
                        <h4 className="text-xs font-black uppercase tracking-widest mb-3 text-green-500 flex items-center gap-2">Sebze & Meyve</h4>
                        <div className="space-y-2">
                            {["Domates (1 kg)", "Salatalık (500g)", "Marul (1 bağ)", "Limon (3 adet)", "Kırmızı Biber (500g)"].map(item => (
                                <label key={item} className={`group flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer hover:border-orange-500/50 transition-colors bg-zinc-800/30 border-zinc-800`}>
                                    <input type="checkbox" className="w-5 h-5 rounded border-zinc-600 text-orange-500 focus:ring-orange-500 bg-transparent form-checkbox" />
                                    <span className="font-bold text-sm group-hover:text-orange-500 transition-colors">{item}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h4 className="text-xs font-black uppercase tracking-widest mb-3 text-rose-500 flex items-center gap-2">Kasap & Şarküteri</h4>
                        <div className="space-y-2">
                            {["Tavuk Göğsü (1 kg)", "Kıyma (500g)", "Yumurta (30'lu)", "Beyaz Peynir (500g)"].map(item => (
                                <label key={item} className={`group flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer hover:border-orange-500/50 transition-colors bg-zinc-800/30 border-zinc-800`}>
                                    <input type="checkbox" className="w-5 h-5 rounded border-zinc-600 text-orange-500 focus:ring-orange-500 bg-transparent form-checkbox" />
                                    <span className="font-bold text-sm group-hover:text-orange-500 transition-colors">{item}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h4 className="text-xs font-black uppercase tracking-widest mb-3 text-amber-500 flex items-center gap-2">Kuru Gıda & Diğer</h4>
                        <div className="space-y-2">
                            {["Zeytinyağı (1 L)", "Yulaf Ezmesi (500g)", "Tam Buğday Makarna (1 paket)"].map(item => (
                                <label key={item} className={`group flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer hover:border-orange-500/50 transition-colors bg-zinc-800/30 border-zinc-800`}>
                                    <input type="checkbox" className="w-5 h-5 rounded border-zinc-600 text-orange-500 focus:ring-orange-500 bg-transparent form-checkbox" />
                                    <span className="font-bold text-sm group-hover:text-amber-500 transition-colors">{item}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={`p-4 border-t flex flex-col sm:flex-row gap-3 border-zinc-800 bg-zinc-900`}>
                    <Button variant="outline" className={`flex-1 flex justify-center items-center gap-2 py-6 rounded-2xl font-black text-sm border transition-colors shadow-sm border-zinc-700 bg-zinc-900 text-white hover:bg-zinc-800`}>
                        <Download className="w-4 h-4" /> PDF Olarak İndir
                    </Button>
                    <Button className="flex-1 flex justify-center items-center gap-2 py-6 rounded-2xl font-black text-sm bg-[#25D366] hover:bg-[#20b858] text-white transition-colors shadow-md shadow-[#25D366]/20">
                        <Share2 className="w-4 h-4" /> Paylaş
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
