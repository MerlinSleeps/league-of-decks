"use client";

import Image from 'next/image';
import { cn } from '@/lib/utils';

interface CardImageProps {
    src?: string;
    alt: string;
    className?: string;
}

export function CardImage({ src, alt, className }: CardImageProps) {

    const isExternal = src?.startsWith('http');

    if (src && isExternal) {
        return (
            <div className={cn("relative overflow-hidden bg-gray-800", className)}>
                <Image
                    src={src}
                    alt={alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 20vw"
                />
            </div>
        );
    }

    return (
        <div className={cn(
            "flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800 border border-gray-600 text-gray-400 p-4 text-center text-xs font-bold uppercase tracking-widest select-none",
            className
        )}>
            {alt}
        </div>
    );
}