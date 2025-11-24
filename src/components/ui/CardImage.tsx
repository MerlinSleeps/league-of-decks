"use client";

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface CardImageProps {
    src?: string;
    alt: string;
    className?: string;
}

export function CardImage({ src, alt, className }: CardImageProps) {
    const [error, setError] = useState(false);

    const fallbackImage = "/assets/card-back.png";
    const imageSource = (src && !error) ? src : fallbackImage;

    return (
        <Image
            src={imageSource}
            alt={alt}
            fill
            unoptimized
            className="object-cover transition-opacity duration-300 ease-in-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 20vw"
            onError={() => setError(true)}
        />
    );
}