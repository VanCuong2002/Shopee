import React, { useState, useRef, useId } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { arrow, offset, shift, useFloating, FloatingPortal } from '@floating-ui/react-dom-interactions'

interface Props {
    className?: string
    initialOpen?: boolean
    children: React.ReactNode
    renderPopover: React.ReactNode
}

export default function Popover({
    children,
    className = 'flex cursor-pointer items-center gap-1 py-1 hover:text-white/70',
    renderPopover
}: Props) {
    const [open, setOpen] = useState(false)
    const id = useId()
    const arrowRef = useRef<HTMLElement>(null)
    const { x, y, reference, floating, strategy, middlewareData } = useFloating({
        middleware: [offset(6), shift(), arrow({ element: arrowRef })],
        placement: 'bottom-end'
    })

    const showPopover = () => {
        setOpen(true)
    }
    const hiddenPopover = () => {
        setOpen(false)
    }

    return (
        <div ref={reference} className={className} onMouseEnter={showPopover} onMouseLeave={hiddenPopover}>
            {children}
            <FloatingPortal id={id}>
                {open && (
                    <AnimatePresence>
                        <motion.div
                            ref={floating}
                            style={{
                                position: strategy,
                                top: y ?? 0,
                                left: x ?? 0,
                                width: 'max-content',
                                transformOrigin: `${middlewareData.arrow?.x}px top`
                            }}
                            initial={{
                                opacity: 0,
                                transform: 'scale(0)'
                            }}
                            animate={{
                                opacity: 1,
                                transform: 'scale(1)'
                            }}
                            exit={{
                                opacity: 0,
                                transform: 'scale(0)'
                            }}
                            transition={{ duration: 0.2 }}
                        >
                            <span
                                ref={arrowRef}
                                className='absolute z-10 translate-y-[-95%] border-[11px] border-x-transparent border-b-white border-t-transparent'
                                style={{
                                    left: middlewareData.arrow?.x,
                                    top: middlewareData.arrow?.y
                                }}
                            ></span>

                            {renderPopover}
                        </motion.div>
                    </AnimatePresence>
                )}
            </FloatingPortal>
        </div>
    )
}
