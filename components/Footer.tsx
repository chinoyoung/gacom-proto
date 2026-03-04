import Image from "next/image";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube, Linkedin } from "lucide-react";

const footerLinks = [
    {
        title: "Explore By Program Type",
        links: [
            { name: "Study Abroad", href: "#" },
            { name: "Volunteer Abroad", href: "#" },
            { name: "Intern Abroad", href: "#" },
            { name: "Teach Abroad", href: "#" },
            { name: "TEFL Courses", href: "#" },
            { name: "Gap Year", href: "#" },
            { name: "Degrees Abroad", href: "#" },
            { name: "High School Abroad", href: "#" },
            { name: "Language Schools", href: "#" },
            { name: "Adventure Travel", href: "#" },
            { name: "Jobs Abroad", href: "#" },
        ],
    },
    {
        title: "Tools for Travelers",
        links: [
            { name: "MyGoAbroad", href: "#" },
            { name: "Get a Travel eSIM", href: "#" },
            { name: "Get Travel Insurance", href: "#" },
            { name: "Apply for Deals", href: "#" },
            { name: "Help Me Pick a Program", href: "#" },
            { name: "How It Works", href: "#" },
            { name: "Travel Articles", href: "#" },
            { name: "Travel Resources", href: "#" },
            { name: "Scholarships", href: "#" },
            { name: "Travel Fundraising", href: "#" },
            { name: "Program Reviews", href: "#" },
            { name: "Alumni & Staff Interviews", href: "#" },
        ],
    },
    {
        title: "Travel Resources",
        links: [
            { name: "AI Program Finder", href: "#" },
            { name: "Book Flights", href: "#" },
            { name: "Accommodations", href: "#" },
            { name: "Travel Insurance", href: "#" },
            { name: "Passport & Visas", href: "#" },
            { name: "Embassy Information", href: "#" },
            { name: "Travel Credit Cards & Financing", href: "#" },
            { name: "Mobile Data & SIM Cards", href: "#" },
            { name: "Programs for Spanish Speakers", href: "#" },
        ],
    },
    {
        title: "Partnerships",
        links: [
            { name: "Advertise With Us", href: "#" },
            { name: "Create An Account", href: "#" },
            { name: "Client Account Login", href: "#" },
            { name: "Who We Work With", href: "#" },
            { name: "Program Verification", href: "#" },
            { name: "Market in Spanish", href: "#" },
            { name: "Contact Our Team", href: "#" },
        ],
    },
    {
        title: "Who We Are",
        links: [
            { name: "About", href: "#" },
            { name: "Meet Our Team", href: "#" },
            { name: "Careers", href: "#" },
            { name: "Corporate Blog", href: "#" },
            { name: "Innovation Awards", href: "#" },
            { name: "GoAbroad Foundation", href: "#" },
            { name: "Contact Us", href: "#" },
        ],
    },
];

const socialIcons = [
    {
        name: "facebook", href: "#", icon: (
            <Facebook className="w-5 h-5" />
        )
    },
    {
        name: "twitter", href: "#", icon: (
            <Twitter className="w-5 h-5" />
        )
    },
    {
        name: "instagram", href: "#", icon: (
            <Instagram className="w-5 h-5" />
        )
    },
    {
        name: "youtube", href: "#", icon: (
            <Youtube className="w-5 h-5" />
        )
    },
    {
        name: "pinterest", href: "#", icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.965 1.406-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" /></svg>
        )
    },
    {
        name: "linkedin", href: "#", icon: (
            <Linkedin className="w-5 h-5" />
        )
    },
    {
        name: "tiktok", href: "#", icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01V14.12c.04 1.72-.45 3.49-1.46 4.89-1.39 1.95-3.83 3.05-6.23 2.87-2.1-.11-4.14-1.27-5.34-3.03-1.64-2.31-1.61-5.74.2-7.85 1.25-1.5 3.19-2.4 5.15-2.28.18 0 .36.02.54.05v4.08c-.46-.09-.95-.1-1.4-.03-1.01.16-1.92.77-2.41 1.67-.5.9-.45 2.06.12 2.91.54.81 1.51 1.3 2.49 1.25.98-.01 1.9-.62 2.3-.53V.02z" /></svg>
        )
    },
];

export default function Footer() {
    return (
        <footer className="bg-white pt-16 pb-24 md:pb-8 border-t border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Top: 5 columns */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-16">
                    {footerLinks.map((section) => (
                        <div key={section.title}>
                            <h3 className="font-bold text-slate-900 text-sm mb-4 uppercase tracking-wider">
                                {section.title}
                            </h3>
                            <ul className="space-y-2">
                                {section.links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-slate-600 hover:text-cobalt-600 text-[13px] transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Middle: Newsletter and Social */}
                <div className="flex flex-col items-center justify-center border-t border-slate-100 pt-12 pb-12">
                    <div className="w-full max-w-md text-center mb-8">
                        <h3 className="font-bold text-slate-900 mb-4">Subscribe to our newsletter</h3>
                        <form className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cobalt-500 text-sm"
                            />
                            <button
                                type="submit"
                                className="px-6 py-2 bg-roman-500 text-white font-semibold rounded-lg hover:bg-roman-600 transition-colors text-sm"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>

                    <div className="text-center">
                        <h4 className="font-bold text-slate-800 text-sm mb-4">Connect with us</h4>
                        <div className="flex gap-4">
                            {socialIcons.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    className="text-slate-600 hover:text-slate-900 transition-colors"
                                    aria-label={social.name}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom: Logo and Copy */}
                <div className="flex flex-col items-center pt-8 border-t border-slate-100">
                    <div className="mb-6 relative w-24 h-24">
                        <Image
                            src="/goabroad-logo.webp"
                            alt="GoAbroad Logo"
                            fill
                            className="object-contain"
                        />
                    </div>

                    <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 text-[12px] text-slate-500">
                        <div className="flex gap-4">
                            <Link href="#" className="hover:text-slate-900 transition-colors">Terms of Use & Privacy</Link>
                            <Link href="#" className="hover:text-slate-900 transition-colors">Legal</Link>
                            <Link href="#" className="hover:text-slate-900 transition-colors">Sitemap</Link>
                        </div>

                        <div className="font-serif italic text-slate-500 text-[16px] md:text-[18px]">
                            Meaningful Travel Starts Here
                        </div>

                        <div className="">
                            © Copyright 1998 - 2026 GoAbroad.com ®
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
