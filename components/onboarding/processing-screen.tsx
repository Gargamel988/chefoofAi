import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export const ProcessingScreen = () => {
    return (
        <div className="w-full h-[calc(100vh-88px)] max-h-[820px] min-h-[560px] flex flex-col items-center justify-center relative">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center text-center space-y-6"
            >
                <div className="relative w-24 h-24 flex items-center justify-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                        className="absolute inset-0 rounded-full border-t-2 border-r-2 border-orange-500/80"
                    />
                    <div className="absolute inset-2 bg-orange-500/20 blur-xl rounded-full" />
                    <Sparkles className="w-10 h-10 text-orange-400" />
                </div>

                <div className="space-y-2">
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-2xl font-black text-white"
                    >
                        Menün Hazırlanıyor...
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-sm text-gray-400 max-w-xs mx-auto"
                    >
                        Hedeflerin ve profilin yapay zeka tarafından analiz ediliyor. ✨
                    </motion.p>
                </div>
            </motion.div>
        </div>
    );
};
