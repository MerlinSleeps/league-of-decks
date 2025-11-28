"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Hero() {
    const router = useRouter()
    const [query, setQuery] = React.useState("")

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (query.trim()) {
            router.push(`/cards?search=${encodeURIComponent(query)}`)
        }
    }

    return (
        <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
            <div className="flex max-w-[980px] flex-col items-start gap-2">
                <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
                    Build the ultimate deck <br className="hidden sm:inline" />
                    with Runic Library.
                </h1>
                <p className="max-w-[700px] text-lg text-muted-foreground">
                    Explore thousands of cards, build your dream deck, and dominate the Rift.
                </p>
            </div>
            <div className="flex w-full max-w-sm items-center space-x-2">
                <form onSubmit={handleSearch} className="flex w-full items-center space-x-2">
                    <Input
                        type="text"
                        placeholder="Search cards..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <Button type="submit">
                        <Search className="mr-2 h-4 w-4" />
                        Search
                    </Button>
                </form>
            </div>
        </section>
    )
}
