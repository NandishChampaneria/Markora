'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MdMenu, MdClose, MdOutlineHome, MdOutlineSearch, MdOutlineUploadFile, MdOutlinePerson, MdOutlineLogout, MdKeyboardArrowDown, MdOutlineSubdirectoryArrowRight, MdLogin } from 'react-icons/md';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';

interface NavItem {
    path: string;
    label: string;
}

interface ToolItem extends NavItem {
    description: string;
}

const Navbar = () => {
    const { user, handleLogout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isToolsOpen, setIsToolsOpen] = useState(false);
    const pathname = usePathname();
    const profileRef = useRef<HTMLDivElement>(null);
    const toolsRef = useRef<HTMLDivElement>(null);

    const navItems: NavItem[] = [
    ];

    const toolsItems: ToolItem[] = [
        { path: '/upload', label: 'Embed', description: 'Upload and watermark a file' },
        { path: '/detect', label: 'Detect', description: 'Check if a file contains a watermark' },
        { path: '/batch', label: 'Batch Process', description: 'Process multiple files at once' },
    ];

    // Close menu when route changes
    useEffect(() => {
        setIsMenuOpen(false);
        setIsProfileOpen(false);
        setIsToolsOpen(false);
    }, [pathname]);

    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
            if (toolsRef.current && !toolsRef.current.contains(event.target as Node)) {
                setIsToolsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const isActive = (path: string) => {
        return pathname === path;
    };

    return (
        <motion.nav 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-black/80 backdrop-blur-lg border border-gray-800 rounded-2xl shadow-lg shadow-black/20 w-[calc(100%-2rem)] max-w-7xl mx-auto"
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14 sm:h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <Logo />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`relative px-2 py-1 text-sm font-medium transition-colors duration-200 tracking-tight ${
                                    pathname === item.path
                                        ? 'text-white'
                                        : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                {item.label}
                                {pathname === item.path && (
                                    <motion.div
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500"
                                        layoutId="navbar-indicator"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                            </Link>
                        ))}
                        
                        {/* Tools Dropdown */}
                        <div className="relative" ref={toolsRef}>
                            <button
                                onClick={() => setIsToolsOpen(!isToolsOpen)}
                                className="flex items-center cursor-pointer space-x-1 text-sm font-medium text-gray-400 hover:text-white transition-colors duration-200"
                            >
                                <span>Tools</span>
                                <MdKeyboardArrowDown className={`w-4 h-4 transition-transform duration-200 ${isToolsOpen ? 'transform rotate-180' : ''}`} />
                            </button>
                            <AnimatePresence>
                                {isToolsOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute right-0 mt-2 w-64 bg-gray-900 rounded-xl shadow-lg border border-gray-800 py-2"
                                    >
                                        {toolsItems.map((item) => (
                                            <Link
                                                key={item.path}
                                                href={item.path}
                                                className={`block px-4 py-3 hover:bg-gray-800/50 transition-colors duration-200 ${
                                                    pathname === item.path ? 'bg-gray-800/50' : ''
                                                }`}
                                                onClick={() => setIsToolsOpen(false)}
                                            >
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-white">{item.label}</span>
                                                    <span className="text-xs text-gray-400 mt-1">{item.description}</span>
                                                </div>
                                            </Link>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {user ? (
                            <div className="relative" ref={profileRef}>
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex cursor-pointer items-center space-x-2 focus:outline-none"
                                >
                                    <img
                                        src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email || 'User')}&background=random`}
                                        alt={`${user.displayName || user.email || 'User'} profile picture`}
                                        className="w-8 h-8 rounded-full border-2 border-indigo-500"
                                    />
                                </button>
                                <AnimatePresence>
                                    {isProfileOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute right-0 mt-2 w-64 bg-gray-900 rounded-xl shadow-lg border border-gray-800 py-2"
                                        >
                                            <div className="px-4 py-3 border-b border-gray-800">
                                                <div className="flex items-center space-x-3">
                                                    <img
                                                        src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email || 'User')}&background=random`}
                                                        alt={`${user.displayName || user.email || 'User'} profile picture`}
                                                        className="w-10 h-10 rounded-full border-2 border-indigo-500 flex-shrink-0"
                                                    />
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-medium text-white truncate">{user.displayName || (user.email ? user.email.split('@')[0] : 'User')}</p>
                                                        <p className="text-xs text-gray-400 truncate">{user.email || 'No email provided'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="px-4 py-3 border-b border-gray-800">
                                                <div className="flex flex-col space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-2">
                                                            <span className={`w-2 h-2 rounded-full ${
                                                                user.plan === 'pro' ? 'bg-emerald-500' : 'bg-yellow-500'
                                                            }`}></span>
                                                            <span className="text-sm font-medium text-white">
                                                                {user.plan === 'pro' ? 'Pro Plan' : 'Free Plan'}
                                                            </span>
                                                        </div>
                                                        {user.plan === 'free' && (
                                                            <Link
                                                                href="/plan"
                                                                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center"
                                                            >
                                                                Upgrade to Pro
                                                                <MdOutlineSubdirectoryArrowRight className="w-4 h-4 ml-1" />
                                                            </Link>
                                                        )}
                                                    </div>
                                                    {user.plan === 'free' && (
                                                        <p className="text-xs text-gray-400">
                                                            {user.remainingEmbeds} embeds remaining
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    handleLogout();
                                                    setIsProfileOpen(false);
                                                }}
                                                className="w-full cursor-pointer text-left px-4 py-3 text-sm text-red-400 hover:bg-gray-800/50 hover:text-red-300 transition-all duration-200 flex items-center space-x-3"
                                            >
                                                <span>Logout</span>
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="group relative px-4 py-2 text-sm font-medium text-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:250%_250%] group-hover:bg-[position:100%_100%] transition-[background-position] duration-500" />
                                <span className="relative flex items-center">
                                    <MdLogin className="w-4 h-4 mr-2" />
                                    Login
                                </span>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        {user ? (
                            <div className="relative mr-4" ref={profileRef}>
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center space-x-2 focus:outline-none"
                                >
                                    <img
                                        src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email || 'User')}&background=random`}
                                        alt={`${user.displayName || user.email || 'User'} profile picture`}
                                        className="w-8 h-8 rounded-full border-2 border-indigo-500"
                                    />
                                </button>
                                <AnimatePresence>
                                    {isProfileOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute right-0 mt-2 w-64 bg-gray-900 rounded-xl shadow-lg border border-gray-800 py-2"
                                        >
                                            <div className="px-4 py-3 border-b border-gray-800">
                                                <div className="flex items-center space-x-3">
                                                    <img
                                                        src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email || 'User')}&background=random`}
                                                        alt={`${user.displayName || user.email || 'User'} profile picture`}
                                                        className="w-10 h-10 rounded-full border-2 border-indigo-500 flex-shrink-0"
                                                    />
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-medium text-white truncate">{user.displayName || (user.email ? user.email.split('@')[0] : 'User')}</p>
                                                        <p className="text-xs text-gray-400 truncate">{user.email || 'No email provided'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="px-4 py-3 border-b border-gray-800">
                                                <div className="flex flex-col space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-2">
                                                            <span className={`w-2 h-2 rounded-full ${
                                                                user.plan === 'pro' ? 'bg-emerald-500' : 'bg-yellow-500'
                                                            }`}></span>
                                                            <span className="text-sm font-medium text-white">
                                                                {user.plan === 'pro' ? 'Pro Plan' : 'Free Plan'}
                                                            </span>
                                                        </div>
                                                        {user.plan === 'free' && (
                                                            <Link
                                                                href="/plan"
                                                                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center"
                                                            >
                                                                Upgrade to Pro
                                                                <MdOutlineSubdirectoryArrowRight className="w-4 h-4 ml-1" />
                                                            </Link>
                                                        )}
                                                    </div>
                                                    {user.plan === 'free' && (
                                                        <p className="text-xs text-gray-400">
                                                            {user.remainingEmbeds} embeds remaining
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    handleLogout();
                                                    setIsProfileOpen(false);
                                                }}
                                                className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-gray-800/50 hover:text-red-300 transition-all duration-200 flex items-center space-x-3"
                                            >
                                                <span>Logout</span>
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <Link 
                                href="/login"
                                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 mr-4"
                            >
                                Login
                            </Link>
                        )}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-400 hover:text-white focus:outline-none"
                        >
                            {isMenuOpen ? (
                                <MdClose className="w-6 h-6" />
                            ) : (
                                <MdMenu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden bg-transparent border-b border-gray-800"
                        >
                            <div className="px-2 pt-2 pb-3 space-y-1">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        href={item.path}
                                        className={`block px-3 py-2 rounded-md text-base font-medium ${
                                            pathname === item.path
                                                ? 'text-white bg-gray-800'
                                                : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                        }`}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                                <div className="px-3 py-2">
                                    <div className="space-y-1">
                                        {toolsItems.map((item) => (
                                            <Link
                                                key={item.path}
                                                href={item.path}
                                                className={`block px-3 py-2 rounded-md text-sm ${
                                                    pathname === item.path
                                                        ? 'text-white bg-gray-800'
                                                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                                }`}
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                <div className="flex flex-col">
                                                    <span>{item.label}</span>
                                                    <span className="text-xs text-gray-500 mt-1">{item.description}</span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.nav>
    );
};

export default Navbar; 