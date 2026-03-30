"use client";

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FadeInSlideProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    delay?: number;
    direction?: "left" | "right" | "up" | "down";
    distance?: number;
    duration?: number;
}

export const FadeInSlide = ({
    children,
    delay = 0,
    direction = "left",
    distance = 50,
    duration = 0.8,
    className,
    ...props
}: FadeInSlideProps) => {
    const x = direction === "left" ? -distance : direction === "right" ? distance : 0;
    const y = direction === "up" ? distance : direction === "down" ? -distance : 0;

    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, x, y }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration, delay }}
            {...props}
        >
            {children}
        </motion.div>
    );
};

interface JiggleRotateProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    duration?: number;
    degrees?: number;
}

export const JiggleRotate = ({
    children,
    duration = 3,
    degrees = 5,
    className,
    ...props
}: JiggleRotateProps) => {
    return (
        <motion.div
            className={cn("inline-block", className)}
            animate={{
                rotate: [0, degrees, -degrees, 0],
            }}
            transition={{
                duration,
                repeat: Infinity,
                ease: "easeInOut"
            }}
            {...props}
        >
            {children}
        </motion.div>
    );
};

interface StaggeredItemProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    index: number;
    baseDelay?: number;
    delayStep?: number;
    distance?: number;
}

export const StaggeredItem = ({
    children,
    index,
    baseDelay = 0.5,
    delayStep = 0.2,
    distance = 20,
    className,
    ...props
}: StaggeredItemProps) => {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, x: -distance }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delayStep * index + baseDelay }}
            {...props}
        >
            {children}
        </motion.div>
    );
};

interface SlideInOutFormProps extends HTMLMotionProps<"form"> {
    children: React.ReactNode;
    stateKey: string;
    slideDirection?: "left" | "right";
    distance?: number;
    duration?: number;
}

export const SlideInOutForm = ({
    children,
    stateKey,
    slideDirection = "left",
    distance = 20,
    duration = 0.3,
    className,
    ...props
}: SlideInOutFormProps) => {
    const xOffset = slideDirection === "left" ? -distance : distance;

    return (
        <motion.form
            key={stateKey}
            initial={{ opacity: 0, x: xOffset }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -xOffset }}
            transition={{ duration }}
            className={className}
            {...props}
        >
            {children}
        </motion.form>
    );
};

interface ScaleInOutProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    duration?: number;
    initialScale?: number;
}

export const ScaleInOut = ({
    children,
    duration = 0.15,
    initialScale = 0.7,
    className,
    ...props
}: ScaleInOutProps) => {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, scale: initialScale }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: initialScale - 0.2 }}
            transition={{ duration }}
            {...props}
        >
            {children}
        </motion.div>
    );
};

interface WidthExpandProps extends HTMLMotionProps<"div"> {
    pct: number;
    delay?: number;
    duration?: number;
}

export const WidthExpand = ({ pct, delay = 0.4, duration = 0.7, className, ...props }: WidthExpandProps) => {
    return (
        <motion.div
            className={className}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ delay, duration, ease: "easeOut" }}
            {...props}
        />
    );
};

interface FadeUpCardProps extends HTMLMotionProps<"div"> {
    index?: number;
}

export const FadeUpCard = ({ children, index = 0, className, ...props }: FadeUpCardProps) => {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export const TapButton = ({ children, className, ...props }: HTMLMotionProps<"button">) => {
    return (
        <motion.button
            className={className}
            whileTap={{ scale: 0.85 }}
            {...props}
        >
            {children}
        </motion.button>
    );
};

interface SpinAnimationProps extends HTMLMotionProps<"div"> {
    isSpinning: boolean;
}

export const SpinAnimation = ({ children, isSpinning, className, ...props }: SpinAnimationProps) => {
    return (
        <motion.div
            className={className}
            animate={isSpinning ? { rotate: 360 } : {}}
            transition={isSpinning ? { repeat: Infinity, duration: 1, ease: 'linear' } : {}}
            {...props}
        >
            {children}
        </motion.div>
    );
};

interface InteractiveCardProps extends HTMLMotionProps<"div"> {
    withTap?: boolean;
}

export const InteractiveCard = ({ children, withTap = false, className, ...props }: InteractiveCardProps) => {
    return (
        <motion.div
            className={className}
            whileHover={{ scale: 1.02 }}
            whileTap={withTap ? { scale: 0.97 } : undefined}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export { AnimatePresence, motion } from 'framer-motion';
