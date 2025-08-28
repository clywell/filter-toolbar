import React from 'react';
import { cn } from '../../core/utils';

// Basic button component
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'secondary' | 'ghost' | 'destructive';
    size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'default', size = 'md', ...props }, ref) => {
        return (
            <button
                className={cn(
                    'filter-button',
                    `filter-button--variant-${variant}`,
                    `filter-button--size-${size}`,
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = 'Button';

// Basic input component
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { }

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn('filter-input', className)}
                ref={ref}
                {...props}
            />
        );
    }
);
Input.displayName = 'Input';

// Basic badge component
export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
    ({ className, variant = 'default', ...props }, ref) => {
        return (
            <div
                className={cn(
                    'filter-badge',
                    `filter-badge--variant-${variant}`,
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Badge.displayName = 'Badge';