'use client';

import React from 'react';
import { MdCheck, MdOutlineSubdirectoryArrowRight, MdCancel } from "react-icons/md";
import { useAuth } from '../../context/AuthContext';
import BackgroundDots from '../../components/BackgroundDots';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useRouter } from 'next/navigation';

const PlanPage = () => {
  const { user } = useAuth();
  const router = useRouter();

  const handleUpgrade = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        plan: 'pro',
        remainingEmbeds: null // Setting to null to indicate unlimited usage
      });
      window.location.reload(); // Refresh the page after successful upgrade
    } catch (error) {
      console.error('Error upgrading to pro plan:', error);
    }
  };

  const handleCancelPro = async () => {
    if (!user) return;
    
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        plan: 'free',
        remainingEmbeds: 5
      });
      window.location.reload(); // Refresh the page after successful cancellation
    } catch (error) {
      console.error('Error cancelling pro plan:', error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black relative">
      <BackgroundDots 
        dotColor="#6366F1"
        backgroundColor="transparent"
        dotSize={1}
        gap={20}
        fade={true}
      />
      <div className="container mx-auto mb-8 px-4 pt-24 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl leading-12 font-bold mb-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
              Choose Your Plan
            </h1>
            <p className="text-gray-400 text-lg">
              Select the plan that best fits your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Free Plan */}
            <div className={`bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border ${user?.plan === 'free' ? 'border-indigo-500/50' : 'border-gray-800'}`}>
              <div className="text-center mb-8">
                <p className="font-bold text-white mb-2">Free</p>
                <p className="text-6xl font-bold text-white mb-2">₹0</p>
                <p className="text-gray-400">Perfect for getting started</p>
              </div>
              <div className="space-y-4 mb-8">
                <div className="flex items-center text-gray-300">
                  <MdCheck className="w-5 h-5 text-green-500 mr-2" />
                  <span>5 watermark embeds total</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <MdCheck className="w-5 h-5 text-green-500 mr-2" />
                  <span>Single file processing</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <MdCheck className="w-5 h-5 text-green-500 mr-2" />
                  <span>Basic support</span>
                </div>
              </div>
              <div className="text-center">
                <button
                  disabled={user?.plan === 'free'}
                  className={`w-full py-3 rounded-xl ${
                    user?.plan === 'free'
                      ? 'bg-indigo-500/20 text-indigo-400 cursor-not-allowed'
                      : 'bg-gray-800 text-gray-400'
                  }`}
                >
                  {user?.plan === 'free' ? 'Current Plan' : 'Free Plan'}
                </button>
              </div>
            </div>

            {/* Pro Plan */}
            <div className={`bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border ${user?.plan === 'pro' ? 'border-indigo-500/50' : 'border-gray-800'} relative`}>
              {user?.plan !== 'pro' && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="text-center mb-8">
                <p className="font-bold text-white mb-2">Pro</p>
                <div className="relative inline-block">
                  <p className="text-6xl font-bold text-gray-500 mb-2">
                    <span className="line-through opacity-50">₹99</span>
                    <span className="text-lg opacity-50">/month</span>
                  </p>
                  <p className="text-6xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 text-transparent bg-clip-text">
                    ₹0<span className="text-lg">/month</span>
                  </p>
                </div>
                <div className="mt-4">
                  <span className="inline-flex items-center bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-sm">
                    <span className="mr-1">✨</span>
                    Early Access Special
                  </span>
                </div>
              </div>
              <div className="space-y-4 mb-8">
                <div className="flex items-center text-gray-300">
                  <MdCheck className="w-5 h-5 text-green-500 mr-2" />
                  <span>Unlimited watermark embeds</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <MdCheck className="w-5 h-5 text-green-500 mr-2" />
                  <span>Batch file processing</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <MdCheck className="w-5 h-5 text-green-500 mr-2" />
                  <span>Advanced features</span>
                </div>
              </div>
              <div className="text-center">
                {user?.plan === 'pro' ? (
                  <button
                    onClick={handleCancelPro}
                    className="w-full cursor-pointer py-3 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-all duration-300 flex items-center justify-center"
                  >
                    <MdCancel className="mr-2" />
                    <span className="font-semibold">Cancel Pro Plan</span>
                  </button>
                ) : (
                  <button
                    onClick={handleUpgrade}
                    className="w-full cursor-pointer py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-lg shadow-indigo-500/20 flex items-center justify-center"
                  >
                    <span className="font-semibold">Upgrade to Pro</span>
                    <MdOutlineSubdirectoryArrowRight className="ml-2" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanPage; 