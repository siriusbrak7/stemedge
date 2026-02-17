
import React from 'react';
import { X, ExternalLink } from 'lucide-react';

interface Props {
    url: string;
    title: string;
    onClose: () => void;
}

const VideoPlayer: React.FC<Props> = ({ url, title, onClose }) => {
    // Extract video ID from YouTube URL
    const getEmbedUrl = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}?autoplay=1` : null;
    };

    const embedUrl = getEmbedUrl(url);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-4xl bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col">
                
                {/* Header */}
                <div className="flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800">
                    <h3 className="text-lg font-bold text-white truncate pr-4">{title}</h3>
                    <div className="flex items-center gap-2">
                        <a href={url} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
                            <ExternalLink className="w-5 h-5" />
                        </a>
                        <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-white transition-colors bg-red-600 hover:bg-red-700">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Player */}
                <div className="aspect-video bg-black flex items-center justify-center relative">
                    {embedUrl ? (
                        <iframe 
                            src={embedUrl} 
                            title={title}
                            className="absolute top-0 left-0 w-full h-full" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                        />
                    ) : (
                        <div className="text-center p-8">
                            <p className="text-red-400 mb-2">Video format not supported.</p>
                            <a href={url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline">Open in browser</a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;
