"use client"
import { motion } from "framer-motion";

export const SlidePane = ({
    children,
    direction,
}: {
    children: React.ReactNode;
    direction: 1 | -1;
}) => (
    <motion.div
        custom={direction}
        initial={{ opacity: 0, x: direction * 60, scale: 0.96 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: direction * -60, scale: 0.96 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 flex flex-col justify-center px-6 py-5 overflow-hidden"
    >
        {children}
    </motion.div>
);
