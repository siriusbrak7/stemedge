
import React, { useState, useEffect } from 'react';
import { videoService } from '../../services/videoService';
import { LessonVideo } from '../../types';
import { Plus, Trash2, Youtube, PlayCircle } from 'lucide-react';

interface Props {
    user: { username: string };
}

// Hardcoded topic list for demo (would come from DB in full app)
const TOPICS = [
    { id: 'cell_biology', name: 'Cell Biology' },
    { id: 'photosynthesis', name: 'Plant Nutrition' },
    { id: 'human_body', name: 'Human Physiology' },
    { id: 'enzymes', name: 'Enzymes' }
];

const SLIDES = {
    'cell_biology': ['nucleus', 'mitochondria', 'ribosomes', 'chloroplast', 'cell_membrane'],
    'photosynthesis': ['cuticle', 'palisade', 'stomata'],
    'human_body': ['heart', 'lungs', 'stomach'],
    'enzymes': ['active_site', 'denaturation']
};

const VideoManager: React.FC<Props> = ({ user }) => {
    const [selectedTopic, setSelectedTopic] = useState(TOPICS[0].id);
    const [selectedSlide, setSelectedSlide] = useState('');
    const [videos, setVideos] = useState<LessonVideo[]>([]);
    
    // Form
    const [url, setUrl] = useState('');
    const [title, setTitle] = useState('');

    useEffect(() => {
        loadVideos();
    }, [selectedTopic, selectedSlide]);

    const loadVideos = async () => {
        const vids = await videoService.getVideos(selectedTopic, selectedSlide || undefined);
        setVideos(vids);
    };

    const handleAdd = async () => {
        if (!url || !title) return;
        
        await videoService.saveVideo({
            lessonId: selectedTopic,
            slideId: selectedSlide || undefined,
            youtubeUrl: url,
            title: title,
            addedBy: user.username
        });
        
        setUrl('');
        setTitle('');
        loadVideos();
    };

    const handleDelete = async (id: string) => {
        if (confirm("Remove this video?")) {
            await videoService.deleteVideo(id);
            loadVideos();
        }
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 animate-fade-in-up">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Youtube className="w-6 h-6 text-red-500" /> Lesson Video Manager
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
                
                {/* 1. Selection & Form */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Select Module</label>
                        <select 
                            value={selectedTopic}
                            onChange={(e) => { setSelectedTopic(e.target.value); setSelectedSlide(''); }}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white text-sm"
                        >
                            {TOPICS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Specific Organelle (Optional)</label>
                        <select 
                            value={selectedSlide}
                            onChange={(e) => setSelectedSlide(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white text-sm"
                        >
                            <option value="">-- General Lesson Video --</option>
                            {(SLIDES as any)[selectedTopic]?.map((s: string) => (
                                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1).replace('_', ' ')}</option>
                            ))}
                        </select>
                    </div>

                    <div className="pt-4 border-t border-slate-800">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Video Title</label>
                        <input 
                            type="text" 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. How Mitochondria Work"
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white text-sm mb-3"
                        />
                        
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">YouTube URL</label>
                        <input 
                            type="text" 
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://youtube.com/..."
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white text-sm mb-3"
                        />

                        <button 
                            onClick={handleAdd}
                            disabled={!url || !title}
                            className="w-full py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg font-bold flex items-center justify-center gap-2"
                        >
                            <Plus className="w-4 h-4" /> Add Video
                        </button>
                    </div>
                </div>

                {/* 2. Video List */}
                <div className="md:col-span-2 space-y-4">
                    <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
                        Existing Videos for {selectedTopic} {selectedSlide ? `> ${selectedSlide}` : ''}
                    </h3>
                    
                    {videos.length === 0 ? (
                        <div className="text-center py-10 text-slate-500 italic bg-slate-950/50 rounded-xl border border-dashed border-slate-800">
                            No videos assigned to this section yet.
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 gap-4">
                            {videos.map(video => (
                                <div key={video.id} className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden group">
                                    <div className="aspect-video bg-black relative flex items-center justify-center">
                                        <PlayCircle className="w-10 h-10 text-white opacity-50" />
                                        {/* Mock thumbnail based on ID to avoid API calls */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>
                                        <div className="absolute bottom-2 left-3 right-3 text-xs text-white font-medium truncate">
                                            {video.title}
                                        </div>
                                    </div>
                                    <div className="p-3 flex justify-between items-center">
                                        <div className="text-xs text-slate-500">Added by: {video.addedBy}</div>
                                        <button 
                                            onClick={() => handleDelete(video.id)}
                                            className="text-slate-500 hover:text-red-400 p-1"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VideoManager;
