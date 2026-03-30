import { WidthExpand } from "@/components/motion";

export function MacroRow({ label, value, pct, color }: { label: string; value: number; pct: number | null; color: string }) {
    const defaultPct = pct === null || isNaN(pct) ? 0 : pct;
    return (
        <div className="flex items-center gap-2.5 text-xs">
            <span className="w-12 text-zinc-500 shrink-0">{label}</span>
            <div className="flex-1 h-1 rounded-full bg-zinc-800 overflow-hidden">
                <WidthExpand
                    pct={defaultPct}
                    className="h-full rounded-full"
                    style={{ background: color }}
                />
            </div>
            <span className="w-8 text-right font-semibold text-zinc-300">{value}g</span>
        </div>
    );
}
