
import React, { useState, useEffect } from 'react';
import { X, Bell, Shield, Database, Trash2, Smartphone, Check, Moon } from 'lucide-react';
import { mobileService } from '../services/mobileService';
import { User } from '../types';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
}

const SettingsModal: React.FC<Props> = ({ isOpen, onClose, user }) => {
    const [pushEnabled, setPushEnabled] = useState(true);
    const [biometricsEnabled, setBiometricsEnabled] = useState(false);
    const [storageUsed, setStorageUsed] = useState('0 KB');
    const [cacheCleared, setCacheCleared] = useState(false);

    useEffect(() => {
        if (isOpen) {
            checkStorage();
            checkBiometrics();
        }
    }, [isOpen]);

    const checkStorage = () => {
        // Approximate storage usage of local storage
        let total = 0;
        for (let x in localStorage) {
            if (Object.prototype.hasOwnProperty.call(localStorage, x)) {
                total += (localStorage[x].length * 2);
            }
        }
        // Convert to KB/MB
        if (total > 1024 * 1024) {
            setStorageUsed(`${(total / (1024 * 1024)).toFixed(2)} MB`);
        } else {
            setStorageUsed(`${(total / 1024).toFixed(2)} KB`);
        }
    };

    const checkBiometrics = async () => {
        if (await mobileService.checkBiometricsAvailable()) {
            const savedUser = await mobileService.getSecureSession();
            setBiometricsEnabled(!!savedUser);
        }
    };

    const toggleBiometrics = async () => {
        if (biometricsEnabled) {
            await mobileService.clearSecureSession();
            setBiometricsEnabled(false);
        } else if (user) {
            const success = await mobileService.authenticateBiometric();
            if (success) {
                await mobileService.setSecureSession(user.username);
                setBiometricsEnabled(true);
            }
        }
    };

    const handleClearCache = () => {
        if (window.confirm("This will reset your local progress and preferences. Are you sure?")) {
            // Keep auth session, clear data
            const session = localStorage.getItem('stemedge_session');
            localStorage.clear();
            if (session) localStorage.setItem('stemedge_session', session);
            
            setCacheCleared(true);
            checkStorage();
            setTimeout(() => setCacheCleared(false), 3000);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm" onClick={onClose} />
            
            <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
                
                {/* Header */}
                <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
                    <h2 className="text-lg font-bold text-white">App Settings</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    
                    {/* Notifications */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                            <Bell className="w-4 h-4" /> Notifications
                        </h3>
                        <div className="flex items-center justify-between p-3 bg-slate-800 rounded-xl border border-slate-700">
                            <div>
                                <p className="text-white font-medium text-sm">Push Notifications</p>
                                <p className="text-slate-400 text-xs">Assignments, grades, and tips.</p>
                            </div>
                            <button 
                                onClick={() => setPushEnabled(!pushEnabled)}
                                className={`w-12 h-6 rounded-full relative transition-colors ${pushEnabled ? 'bg-cyan-600' : 'bg-slate-600'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${pushEnabled ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>
                    </div>

                    {/* Security */}
                    {mobileService.isNative && (
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                                <Shield className="w-4 h-4" /> Security
                            </h3>
                            <div className="flex items-center justify-between p-3 bg-slate-800 rounded-xl border border-slate-700">
                                <div>
                                    <p className="text-white font-medium text-sm">Biometric Login</p>
                                    <p className="text-slate-400 text-xs">Use FaceID / Fingerprint</p>
                                </div>
                                <button 
                                    onClick={toggleBiometrics}
                                    className={`w-12 h-6 rounded-full relative transition-colors ${biometricsEnabled ? 'bg-purple-600' : 'bg-slate-600'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${biometricsEnabled ? 'left-7' : 'left-1'}`} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Storage */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                            <Database className="w-4 h-4" /> Data & Storage
                        </h3>
                        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                            <div className="p-3 border-b border-slate-700 flex justify-between items-center">
                                <span className="text-sm text-slate-300">Offline Data Used</span>
                                <span className="text-sm font-mono text-white">{storageUsed}</span>
                            </div>
                            <div className="p-3">
                                <button 
                                    onClick={handleClearCache}
                                    className="w-full flex items-center justify-center gap-2 py-2 bg-red-900/20 text-red-400 hover:bg-red-900/30 rounded-lg text-sm font-bold transition-colors"
                                >
                                    {cacheCleared ? <Check className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                                    {cacheCleared ? "Cache Cleared" : "Clear Cached Content"}
                                </button>
                                <p className="text-[10px] text-slate-500 text-center mt-2">
                                    Removes downloaded images and temporary lesson progress. Account data is preserved.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* App Info */}
                    <div className="text-center pt-4 border-t border-slate-800">
                        <p className="text-xs text-slate-500 flex items-center justify-center gap-1">
                            <Smartphone className="w-3 h-3" /> StemEdge App v1.0.2 ({mobileService.isNative ? 'Native' : 'Web'})
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
