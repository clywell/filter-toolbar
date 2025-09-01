import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../core/utils';

// Basic Popover component
export interface PopoverProps {
    children: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function Popover({ children, open: controlledOpen, onOpenChange }: PopoverProps) {
    const [internalOpen, setInternalOpen] = useState(false);
    const isControlled = controlledOpen !== undefined;
    const isOpen = isControlled ? controlledOpen : internalOpen;

    const handleOpenChange = (newOpen: boolean) => {
        if (!isControlled) {
            setInternalOpen(newOpen);
        }
        onOpenChange?.(newOpen);
    };

    return (
        <div className="filter-popover" data-open={isOpen}>
            {React.Children.map(children, child => {
                if (React.isValidElement(child)) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    return React.cloneElement(child as any, {
                        isOpen,
                        onOpenChange: handleOpenChange
                    });
                }
                return child;
            })}
        </div>
    );
}

export interface PopoverTriggerProps {
    children: React.ReactNode;
    asChild?: boolean;
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function PopoverTrigger({ children, asChild, isOpen, onOpenChange }: PopoverTriggerProps) {
    const handleClick = () => {
        onOpenChange?.(!isOpen);
    };

    if (asChild && React.isValidElement(children)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return React.cloneElement(children as any, {
            onClick: handleClick
        });
    }

    return (
        <button onClick={handleClick} className="filter-popover__trigger">
            {children}
        </button>
    );
}

export interface PopoverContentProps {
    children: React.ReactNode;
    align?: 'start' | 'center' | 'end';
    side?: 'top' | 'bottom' | 'left' | 'right';
    className?: string;
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function PopoverContent({
    children,
    align = 'center',
    side = 'bottom',
    className,
    isOpen,
    onOpenChange
}: PopoverContentProps) {
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: globalThis.MouseEvent) => {
            const target = event.target as globalThis.Node | null;
            if (contentRef.current && target && !contentRef.current.contains(target)) {
                onOpenChange?.(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen, onOpenChange]);

    if (!isOpen) return null;

    return (
        <div
            ref={contentRef}
            className={cn(
                'filter-popover__content',
                `filter-popover__content--${side}`,
                `filter-popover__content--${align}`,
                className
            )}
        >
            {children}
        </div>
    );
}