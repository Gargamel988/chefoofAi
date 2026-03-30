"use client"

import * as React from "react"
import { ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"

interface SelectContextValue {
  value?: string
  onValueChange?: (value: string) => void
  open: boolean
  setOpen: (open: boolean) => void
}

const SelectContext = React.createContext<SelectContextValue | undefined>(undefined)

export function Select({ 
  children, 
  value, 
  onValueChange 
}: { 
  children: React.ReactNode, 
  value?: string, 
  onValueChange?: (value: string) => void 
}) {
  const [open, setOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      <div className="relative w-full" ref={containerRef}>
        {children}
      </div>
    </SelectContext.Provider>
  )
}

export const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const context = React.useContext(SelectContext)
  if (!context) return null

  return (
    <button
      type="button"
      ref={ref}
      onClick={() => context.setOpen(!context.open)}
      className={cn(
        "flex h-11 w-full items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
        context.open && "border-orange-500/50 ring-1 ring-orange-500/50",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className={cn("h-4 w-4 opacity-50 transition-transform duration-200", context.open && "rotate-180")} />
    </button>
  )
})
SelectTrigger.displayName = "SelectTrigger"

export const SelectContent = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  const context = React.useContext(SelectContext)
  if (!context) return null

  return (
    <AnimatePresence>
      {context.open && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 4, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className={cn(
            "absolute z-50 min-w-[8rem] w-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 text-white shadow-2xl backdrop-blur-3xl",
            className
          )}
        >
          <div className="p-1">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export const SelectItem = ({ 
  children, 
  value, 
  className 
}: { 
  children: React.ReactNode, 
  value: string, 
  className?: string 
}) => {
  const context = React.useContext(SelectContext)
  if (!context) return null

  const isSelected = context.value === value

  return (
    <div
      onClick={() => {
        context.onValueChange?.(value)
        context.setOpen(false)
      }}
      className={cn(
        "relative flex w-full cursor-default select-none items-center justify-between rounded-lg py-2 px-3 text-sm outline-none hover:bg-zinc-800/80 transition-colors",
        isSelected && "bg-orange-500/10 text-orange-400 font-bold",
        className
      )}
    >
      {children}
      {isSelected && <Check className="w-4 h-4" />}
    </div>
  )
}

export const SelectValue = ({ placeholder }: { placeholder?: string }) => {
  const context = React.useContext(SelectContext)
  if (!context) return null

  // This is a bit tricky without a proper item lookup, 
  // but for simplicity in this publisher use case:
  return <span>{context.value === "easy" ? "Kolay" : context.value === "medium" ? "Orta" : context.value === "hard" ? "Zor" : placeholder}</span>
}
