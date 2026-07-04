'use client'

import { motion, HTMLMotionProps, Variants } from 'framer-motion'

export function MotionDiv({ children, ...props }: HTMLMotionProps<"div">) {
  return <motion.div {...props}>{children}</motion.div>
}

export function MotionTr({ children, ...props }: HTMLMotionProps<"tr">) {
  return <motion.tr {...props}>{children}</motion.tr>
}

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04
    }
  }
}

export const slideUpItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.15, ease: "easeOut" } }
}

export const fadeItem: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.15 } }
}
