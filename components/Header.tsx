"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Menu, X, LayoutDashboard } from "lucide-react";
import { SignInButton, UserButton, Show } from "@clerk/nextjs";

const navLinks = [
    { name: "Program Types", href: "#", hasDropdown: true },
    { name: "Travel Resources", href: "#", hasDropdown: true },
    { name: "How it Works", href: "#" },
    { name: "Get Program Matches", href: "#" },
];

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSignInOpen, setIsSignInOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">

                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="relative w-24 h-12 md:w-28 md:h-14">
                            <Image
                                src="/goabroad-logo.webp"
                                alt="GoAbroad Logo"
                                fill
                                className="object-contain"
                                priority
                            />
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="flex items-center text-sm font-bold text-slate-800 hover:text-cobalt-600 transition-colors"
                            >
                                {link.name}
                                {link.hasDropdown && <ChevronDown className="w-4 h-4 ml-1" />}
                            </Link>
                        ))}

                        {/* Clerk Authentication */}
                        <div className="ml-4">
                            <Show when="signed-out">
                                <div className="flex items-center">
                                    <SignInButton mode="modal">
                                        <button className="flex items-center px-4 py-2 border-2 border-slate-800 rounded text-sm font-bold text-slate-800 hover:bg-slate-50 transition-all active:scale-95">
                                            Sign In
                                        </button>
                                    </SignInButton>
                                </div>
                            </Show>
                            <Show when="signed-in">
                                <div className="flex items-center space-x-4">
                                    <UserButton>
                                        <UserButton.MenuItems>
                                            <UserButton.Link
                                                label="Admin Dashboard"
                                                labelIcon={<LayoutDashboard className="w-4 h-4" />}
                                                href="/admin"
                                            />
                                        </UserButton.MenuItems>
                                    </UserButton>
                                </div>
                            </Show>
                        </div>
                    </nav>

                    {/* Mobile menu button */}
                    <div className="lg:hidden flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMobileMenuOpen ? (
                                <X className="h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden bg-white border-t border-slate-100 px-4 pt-2 pb-6 space-y-1 shadow-lg">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="block px-3 py-3 text-base font-bold text-slate-700 hover:text-cobalt-600 hover:bg-slate-50 rounded-md"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="pt-4 px-3 space-y-3">
                        <Show when="signed-out">
                            <SignInButton mode="modal">
                                <button className="w-full flex justify-center items-center px-4 py-3 border-2 border-slate-800 rounded text-base font-bold text-slate-800 hover:bg-slate-50">
                                    Sign In
                                </button>
                            </SignInButton>
                        </Show>
                        <Show when="signed-in">
                            <div className="flex flex-col space-y-3">
                                <div className="px-3 py-3">
                                    <UserButton showName>
                                        <UserButton.MenuItems>
                                            <UserButton.Link
                                                label="Admin Dashboard"
                                                labelIcon={<LayoutDashboard className="w-4 h-4" />}
                                                href="/admin"
                                            />
                                        </UserButton.MenuItems>
                                    </UserButton>
                                </div>
                            </div>
                        </Show>
                    </div>
                </div>
            )}
        </header>
    );
}
