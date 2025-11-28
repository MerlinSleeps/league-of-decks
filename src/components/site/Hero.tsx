"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search, Layers, Library } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Hero() {
    const router = useRouter()
    const [query, setQuery] = React.useState("")

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (query.trim()) {
            router.push(`/cards?name=${encodeURIComponent(query)}`)
        }
    }

    return (
        <section className="relative overflow-hidden min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-12">
            {/* Background Gradient Blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-7xl z-[-1] pointer-events-none opacity-20">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="container flex flex-col items-center text-center gap-8 z-10">
                {/* Badge */}
                <div className="inline-flex items-center rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-sm font-medium text-cyan-300 backdrop-blur-sm">
                    <span className="flex h-2 w-2 rounded-full bg-cyan-400 mr-2 animate-pulse"></span>
                    Updated for Nov 2025 Patch
                </div>

                {/* Main Heading */}
                <h1 className="text-4xl font-extrabold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1] max-w-4xl">
                    Master the Rift with <br className="hidden sm:inline" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                        Runic Library
                    </span>
                </h1>

                {/* Subtitle */}
                <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
                    The ultimate deck builder and collection manager for Riftbound.
                    Search thousands of cards, craft the perfect strategy, and share it with the world.
                </p>

                {/* Search Bar */}
                <div className="w-full max-w-md mt-4 relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
                    <form onSubmit={handleSearch} className="relative flex w-full items-center">
                        <Input
                            type="text"
                            placeholder="Search for a champion or card..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="pr-24 h-12 bg-gray-950/80 border-gray-800 backdrop-blur-xl text-lg shadow-xl"
                        />
                        <Button
                            type="submit"
                            size="sm"
                            className="absolute right-1 top-1 bottom-1 bg-cyan-600 hover:bg-cyan-700 text-white"
                        >
                            <Search className="mr-2 h-4 w-4" />
                            Search
                        </Button>
                    </form>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
                    <Link href="/build">
                        <Button size="lg" className="h-12 px-8 text-base">
                            <Layers className="mr-2 h-5 w-5" />
                            Build a Deck
                        </Button>
                    </Link>
                    <Link href="/cards">
                        <Button size="lg" variant="outline" className="h-12 px-8 text-base border-gray-700 bg-gray-950/50 hover:bg-gray-900">
                            <Library className="mr-2 h-5 w-5" />
                            Browse Cards
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}