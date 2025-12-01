"use client"

import * as React from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { Card } from '@/types/card';

interface CardSearchProps {
    value: string
    onChange: (value: string) => void
    onSearch: (value: string) => void
    variant?: "hero" | "default"
    placeholder?: string
    className?: string
}

export function CardSearch({
    value,
    onChange,
    onSearch,
    variant = "default",
    placeholder = "Search...",
    className,
}: CardSearchProps) {
    const [suggestions, setSuggestions] = React.useState<Card[]>([])
    const [showSuggestions, setShowSuggestions] = React.useState(false)

    React.useEffect(() => {
        const fetchSuggestions = async () => {
            if (value.length < 2) {
                setSuggestions([])
                return
            }

            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(value)}`)
                if (res.ok) {
                    const data = await res.json()
                    setSuggestions(data)
                }
            } catch (error) {
                console.error("Failed to fetch suggestions", error)
            }
        }

        const timeoutId = setTimeout(fetchSuggestions, 300)
        return () => clearTimeout(timeoutId)
    }, [value])

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            onSearch(value)
            setShowSuggestions(false)
        }
    }

    return (
        <div className={cn("relative w-full", className)}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                value={value}
                onChange={(e) => {
                    onChange(e.target.value)
                    setShowSuggestions(true)
                }}
                onKeyDown={handleKeyDown}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder={placeholder}
                className={cn(
                    "pl-10",
                    variant === "hero" && "h-12 text-lg bg-gray-900/90 border-gray-700"
                )}
            />
            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-800 rounded-lg shadow-xl overflow-hidden z-50">
                    {suggestions.map((card) => (
                        <div
                            key={card.id}
                            className="flex items-center px-4 py-3 hover:bg-gray-800 transition-colors cursor-pointer"
                            onClick={() => {
                                onChange(card.name)
                                onSearch(card.name)
                                setShowSuggestions(false)
                            }}
                        >
                            <span className="text-gray-200">{card.name}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
