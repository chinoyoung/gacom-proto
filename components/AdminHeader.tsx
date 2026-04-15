"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, ExternalLink } from "lucide-react";
import { SignInButton, UserButton, Show } from "@clerk/nextjs";

const navLinks = [
    { name: "Dashboard", href: "/admin" },
    { name: "Create Listing", href: "/admin/create-listing" },
    { name: "View Site", href: "/programs", external: true },
];

export default function AdminHeader() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    const isActive = (href: string) => pathname === href;

    return (
        <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Left: Logo mark + wordmark */}
                    <div className="flex items-center gap-3">
                        <Link href="/" aria-label="Go to homepage">
                            <span className="inline-flex items-center justify-center w-8 h-8 bg-cobalt-600 text-white text-xs font-bold rounded">
                                GA
                            </span>
                        </Link>
                        <Link
                            href="/admin"
                            className="flex items-center gap-1.5 leading-none"
                        >
                            <span className="font-bold text-slate-900 text-sm">Gacom Proto</span>
                            <span className="font-medium text-slate-400 text-sm">Admin</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                                    isActive(link.href)
                                        ? "text-cobalt-600"
                                        : "text-slate-600 hover:text-cobalt-600"
                                }`}
                                {...(link.external
                                    ? { target: "_blank", rel: "noopener noreferrer" }
                                    : {})}
                            >
                                {link.name}
                                {link.external && (
                                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                                )}
                            </Link>
                        ))}

                        {/* Auth */}
                        <div className="ml-2">
                            <Show when="signed-out">
                                <SignInButton mode="modal" forceRedirectUrl="/admin">
                                    <button className="px-3 py-1.5 border border-slate-800 rounded text-sm font-medium text-slate-800 hover:bg-slate-50 transition-colors active:scale-95">
                                        Sign In
                                    </button>
                                </SignInButton>
                            </Show>
                            <Show when="signed-in">
                                <UserButton />
                            </Show>
                        </div>
                    </nav>

                    {/* Mobile: auth + hamburger */}
                    <div className="lg:hidden flex items-center gap-3">
                        <Show when="signed-in">
                            <UserButton />
                        </Show>
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 focus:outline-none transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-5 w-5" aria-hidden="true" />
                            ) : (
                                <Menu className="h-5 w-5" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden bg-white border-t border-slate-200 px-4 pt-2 pb-5 space-y-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded transition-colors ${
                                isActive(link.href)
                                    ? "text-cobalt-600 bg-cobalt-50"
                                    : "text-slate-700 hover:text-cobalt-600 hover:bg-slate-50"
                            }`}
                            {...(link.external
                                ? { target: "_blank", rel: "noopener noreferrer" }
                                : {})}
                        >
                            {link.name}
                            {link.external && (
                                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                            )}
                        </Link>
                    ))}
                    <div className="pt-3 px-3">
                        <Show when="signed-out">
                            <SignInButton mode="modal" forceRedirectUrl="/admin">
                                <button className="w-full px-4 py-2 border border-slate-800 rounded text-sm font-medium text-slate-800 hover:bg-slate-50 transition-colors">
                                    Sign In
                                </button>
                            </SignInButton>
                        </Show>
                    </div>
                </div>
            )}
        </header>
    );
}
