"use client"

import { motion } from "framer-motion"
import { days } from "./types"

interface DaySelectorProps {
    selectedDay: string
    onSelectDay: (day: string) => void
}

export function DaySelector({ selectedDay, onSelectDay }: DaySelectorProps) {
    return (
        <div className="relative group">
            <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-zinc-800 to-transparent" />
            <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide -mx-2 px-2 snap-x">
                {days.map((day) => {
                    const isActive = selectedDay === day
                    return (
                        <motion.button
                            key={day}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onSelectDay(day)}
                            className={`relative cursor-pointer flex-none snap-center py-4 px-8 rounded-2xl transition-all duration-500 group/btn ${isActive ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                                }`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeDay"
                                    className="absolute inset-0 bg-white/5 border border-white/10 rounded-2xl shadow-inner-white backdrop-blur-xl"
                                />
                            )}
                            <div className="relative z-10 flex flex-col items-center gap-1">
                                <span className="text-[10px] font-black tracking-widest uppercase opacity-50">{day.slice(0, 3)}</span>
                                <span className="text-lg font-black">{day}</span>
                                {isActive && (
                                    <motion.div
                                        layoutId="activeIndicator"
                                        className="w-1 h-1 rounded-full bg-orange-500 mt-1 shadow-[0_0_10px_rgba(249,115,22,0.8)]"
                                    />
                                )}
                            </div>
                        </motion.button>
                    )
                })}
            </div>
        </div>
    )
}
