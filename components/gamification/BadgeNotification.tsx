
import React, { useEffect, useState } from 'react';
import { Badge } from '../../types';
import { Medal, X, Share2 } from 'lucide-react';
import { mobileService } from '../../services/mobileService';

interface Props {
    badge: Badge | null;
    onClose: () => void;
}

const BadgeNotification: React.FC<Props> = ({ badge, onClose }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (badge) {
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
                setTimeout(onClose, 300); // Allow exit animation
            }, 8000); // Increased time to allow for sharing
            return () => clearTimeout(timer);
        }
    }, [badge, onClose]);

    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (badge) {
            mobileService.shareContent(
                'Achievement Unlocked!',
                `I just earned the "${badge.name}" badge on StemEdge! 🚀`,
                'https://stemedge.app'
            );
        }
    };

    if (!badge && !visible) return null;

    return (
        <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 ${
            visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'
        }`}>
            <div className="bg-slate-900 border border-yellow-500/50 rounded-2xl p-4 shadow-[0_0_30px_rgba(234,179,8,0.2)] flex items-center gap-4 max-w-sm w-full mx-auto relative overflow-hidden">
                {/* Shine effect */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 animate-pulse pointer-events-none"></div>

                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center shrink-0 shadow-lg border-2 border-slate-900">
                    <Medal className="w-6 h-6 text-white" />
                </div>
                
                <div className="flex-1">
                    <p className="text-xs font-bold text-yellow-500 uppercase tracking-wider mb-0.5">Achievement Unlocked!</p>
                    <h4 className="text-white font-bold text-lg leading-none">{badge?.name}</h4>
                    <p className="text-slate-400 text-xs mt-1 truncate">{badge?.description}</p>
                </div>

                <div className="flex flex-col gap-1">
                    <button onClick={handleShare} className="text-slate-400 hover:text-white p-1">
                        <Share2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => setVisible(false)} className="text-slate-400 hover:text-white p-1">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BadgeNotification;
