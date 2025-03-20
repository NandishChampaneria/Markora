'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';

const LoginPage = () => {
    const router = useRouter();
    const { signInWithGoogle } = useAuth();

    const handleLogin = async () => {
        try {
            await signInWithGoogle();
            router.push('/');
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <div className="min-h-screen w-full bg-black relative">
            {/* Gradient Orbs */}
            <div className="fixed top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
            <div className="fixed top-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />
            
            <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative w-full max-w-md"
                >
                    <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl border border-gray-800 p-8 shadow-xl">
                        <div className="text-center mb-8">
                            <div className="flex justify-center mb-6">
                                <Link href="/" className="text-xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text tracking-tight">
                                    Markora
                                </Link>
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                            <p className="text-gray-400">Sign in to continue to your account</p>
                        </div>

                        <div className="space-y-6">
                            <button
                                onClick={handleLogin}
                                className="group cursor-pointer relative w-full px-4 py-3 text-sm font-medium text-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:250%_250%] group-hover:bg-[position:100%_100%] transition-[background-position] duration-500" />
                                <span className="relative flex items-center justify-center">
                                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                    </svg>
                                    Sign in with Google
                                </span>
                            </button>

                            <div className="text-center">
                                <p className="text-sm text-gray-400">
                                    By signing in, you agree to our{' '}
                                    <Link href="/terms" className="text-indigo-400 hover:text-indigo-300 transition-colors">Terms of Service</Link>
                                    {' '}and{' '}
                                    <Link href="/privacy" className="text-indigo-400 hover:text-indigo-300 transition-colors">Privacy Policy</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default LoginPage; 