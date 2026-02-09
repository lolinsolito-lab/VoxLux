import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Play, Volume2, FileText } from 'lucide-react';

interface ContentPreviewModalProps {
    content: {
        id: string;
        title: string;
        description?: string;
        content_type: 'supabase_storage' | 'external_link' | 'youtube' | 'vimeo' | 'download_link';
        content_url: string;
    } | null;
    onClose: () => void;
}

export const ContentPreviewModal: React.FC<ContentPreviewModalProps> = ({ content, onClose }) => {
    if (!content) return null;

    // Extract YouTube video ID
    const getYouTubeId = (url: string): string | null => {
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/,
            /^([a-zA-Z0-9_-]{11})$/
        ];
        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) return match[1];
        }
        return null;
    };

    // Extract Vimeo video ID
    const getVimeoId = (url: string): string | null => {
        const patterns = [
            /vimeo\.com\/(\d+)/,
            /^(\d+)$/
        ];
        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) return match[1];
        }
        return null;
    };

    // Render content based on type
    const renderContent = () => {
        switch (content.content_type) {
            case 'youtube': {
                const videoId = getYouTubeId(content.content_url);
                if (!videoId) {
                    return (
                        <div className="flex items-center justify-center h-96 text-red-400">
                            <p>❌ Invalid YouTube URL</p>
                        </div>
                    );
                }
                return (
                    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                        <iframe
                            className="absolute top-0 left-0 w-full h-full rounded-xl"
                            src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`}
                            title={content.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                );
            }

            case 'vimeo': {
                const videoId = getVimeoId(content.content_url);
                if (!videoId) {
                    return (
                        <div className="flex items-center justify-center h-96 text-red-400">
                            <p>❌ Invalid Vimeo URL</p>
                        </div>
                    );
                }
                return (
                    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                        <iframe
                            className="absolute top-0 left-0 w-full h-full rounded-xl"
                            src={`https://player.vimeo.com/video/${videoId}?autoplay=0`}
                            title={content.title}
                            allow="autoplay; fullscreen; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                );
            }

            case 'supabase_storage': {
                const fileExt = content.content_url.split('.').pop()?.toLowerCase();

                // PDF viewer
                if (fileExt === 'pdf') {
                    return (
                        <div className="w-full h-[600px] bg-gray-900 rounded-xl overflow-hidden">
                            <iframe
                                src={content.content_url}
                                className="w-full h-full"
                                title={content.title}
                            />
                        </div>
                    );
                }

                // Audio player
                if (['mp3', 'wav', 'ogg', 'm4a'].includes(fileExt || '')) {
                    return (
                        <div className="flex flex-col items-center justify-center p-12 space-y-6">
                            <div className="p-6 bg-purple-500/20 rounded-full">
                                <Volume2 size={64} className="text-purple-400" />
                            </div>
                            <audio controls className="w-full max-w-lg">
                                <source src={content.content_url} type={`audio/${fileExt}`} />
                                Your browser does not support audio playback.
                            </audio>
                        </div>
                    );
                }

                // Video player
                if (['mp4', 'webm', 'mov'].includes(fileExt || '')) {
                    return (
                        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                            <video
                                className="absolute top-0 left-0 w-full h-full rounded-xl"
                                controls
                                src={content.content_url}
                            >
                                Your browser does not support video playback.
                            </video>
                        </div>
                    );
                }

                // Image viewer
                if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(fileExt || '')) {
                    return (
                        <div className="flex items-center justify-center p-4">
                            <img
                                src={content.content_url}
                                alt={content.title}
                                className="max-w-full max-h-[600px] rounded-xl object-contain"
                            />
                        </div>
                    );
                }

                // Generic file - show download link
                return (
                    <div className="flex flex-col items-center justify-center p-12 space-y-6">
                        <div className="p-6 bg-blue-500/20 rounded-full">
                            <FileText size={64} className="text-blue-400" />
                        </div>
                        <div className="text-center">
                            <p className="text-xl font-bold text-white mb-2">{content.title}</p>
                            <p className="text-gray-400 mb-6">File Type: {fileExt?.toUpperCase()}</p>
                            <a
                                href={content.content_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold transition-all duration-300"
                            >
                                <ExternalLink size={20} />
                                Open File
                            </a>
                        </div>
                    </div>
                );
            }

            case 'external_link':
            case 'download_link': {
                return (
                    <div className="flex flex-col items-center justify-center p-12 space-y-6">
                        <div className="p-6 bg-amber-500/20 rounded-full">
                            <ExternalLink size={64} className="text-amber-400" />
                        </div>
                        <div className="text-center">
                            <p className="text-xl font-bold text-white mb-2">{content.title}</p>
                            {content.description && (
                                <p className="text-gray-400 mb-6 max-w-lg">{content.description}</p>
                            )}
                            <div className="flex gap-4 justify-center">
                                <a
                                    href={content.content_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black rounded-lg font-bold transition-all duration-300"
                                >
                                    <ExternalLink size={20} />
                                    Open Link
                                </a>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(content.content_url);
                                        alert('✅ Link copied to clipboard!');
                                    }}
                                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold transition-all duration-300"
                                >
                                    Copy Link
                                </button>
                            </div>
                        </div>
                    </div>
                );
            }

            default:
                return (
                    <div className="flex items-center justify-center h-96 text-gray-400">
                        <p>❓ Unsupported content type</p>
                    </div>
                );
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="relative w-full max-w-5xl bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-white/10">
                        <div>
                            <h2 className="text-2xl font-bold text-white">{content.title}</h2>
                            {content.description && (
                                <p className="text-sm text-gray-400 mt-1">{content.description}</p>
                            )}
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-lg transition-all duration-300 group"
                        >
                            <X size={24} className="text-gray-400 group-hover:text-white" />
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="p-6">
                        {renderContent()}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between p-6 border-t border-white/10 bg-white/5">
                        <div className="flex items-center gap-2">
                            <div className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${content.content_type === 'youtube' ? 'bg-red-500/20 text-red-400' :
                                    content.content_type === 'vimeo' ? 'bg-blue-500/20 text-blue-400' :
                                        content.content_type === 'supabase_storage' ? 'bg-green-500/20 text-green-400' :
                                            'bg-amber-500/20 text-amber-400'
                                }`}>
                                {content.content_type === 'supabase_storage' ? 'File Upload' :
                                    content.content_type === 'external_link' ? 'External Link' :
                                        content.content_type === 'download_link' ? 'Download Link' :
                                            content.content_type.toUpperCase()}
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold transition-all duration-300"
                        >
                            Close
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
