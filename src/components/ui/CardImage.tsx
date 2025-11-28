"use client";

import { useState } from 'react';
import Image from 'next/image';

interface CardImageProps {
    src?: string;
    alt: string;
}

export function CardImage({ src, alt }: CardImageProps) {
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