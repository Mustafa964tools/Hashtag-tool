import { useState } from 'react';
import { Loader2, Copy, Check, Hash, Sparkles, Youtube, AlignRight, RefreshCw, Heart, Trash2 } from 'lucide-react';

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
  </svg>
);

type Platform = 'tiktok' | 'youtube';

export default function App() {
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState('');
  const [platform, setPlatform] = useState<Platform>('tiktok');

  const generateHashtags = async () => {
    if (!caption.trim()) return;

    setIsLoading(true);
    setError('');
    setIsCopied(false);
    setHashtags('');

    try {
      const response = await fetch('/api/generate-hashtags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caption, platform }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || 'Failed to generate hashtags');
      }

      const data = await response.json();
      setHashtags(data.hashtags);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'هەڵەیەک ڕوویدا لە کاتی دروستکردنەکە. تکایە سەرلەنوێ هەوڵبدەرەوە.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!hashtags) return;
    try {
      await navigator.clipboard.writeText(hashtags);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-neutral-950 text-white flex flex-col items-center py-12 px-4 md:px-8 font-sans selection:bg-[#E54825]/30 selection:text-white" dir="rtl">
      
      {/* Background ambient light */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#E54825]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#E54825]/5 blur-[120px] pointer-events-none" />

      {/* Header Section */}
      <header className="relative w-full max-w-4xl mb-10 flex flex-col items-center text-center z-10 pt-8">
        <div className="bg-gradient-to-b from-[#E54825]/20 to-transparent p-4 rounded-3xl mb-6 shadow-[0_0_40px_-10px_rgba(229,72,37,0.3)]">
          <Sparkles className="w-10 h-10 text-[#E54825]" />
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 select-none">
          دروستکەری هاشتاگی <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#E54825] to-[#f97316]">964</span>
        </h1>
        <p className="text-neutral-400 text-lg sm:text-lg font-light max-w-2xl mt-2 leading-relaxed">
          بە یەک کلیک و چەند چرکەیەک هاشتاگی ڤیدیۆکانت ئامادە بکە
        </p>
      </header>

      {/* Main Content Card */}
      <main className="w-full max-w-6xl z-10">
        
        {/* Platform Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-neutral-900/50 backdrop-blur-md p-1.5 rounded-2xl flex items-center border border-neutral-800 shadow-xl">
            <button
              onClick={() => { setPlatform('tiktok'); setHashtags(''); setError(''); }}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all ${
                platform === 'tiktok' 
                  ? 'bg-neutral-800 text-white shadow-md' 
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
              }`}
            >
              <TikTokIcon className="w-5 h-5" />
              <span>تیکتۆک</span>
            </button>
            <div className="w-px h-6 bg-neutral-800 mx-1"></div>
            <button
              onClick={() => { setPlatform('youtube'); setHashtags(''); setError(''); }}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all ${
                platform === 'youtube' 
                  ? 'bg-red-600/20 text-red-500 shadow-md ring-1 ring-red-500/50' 
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
              }`}
            >
              <Youtube className="w-5 h-5" />
              <span>یوتیوب</span>
            </button>
          </div>
        </div>

        <div className="bg-neutral-900/40 backdrop-blur-sm border border-neutral-800/80 rounded-[32px] p-6 md:p-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Left/Top Column: Input */}
            <div className="flex flex-col space-y-5">
              <div className="flex items-center justify-between mb-2 px-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center">
                    <AlignRight className="w-4 h-4 text-neutral-400" />
                  </div>
                  <label htmlFor="content-input" className="text-lg font-medium text-neutral-200">
                    {platform === 'tiktok' ? 'کاپشنی ڤیدیۆ' : 'دەق و زانیاری ڕێکخراو'}
                  </label>
                </div>
                {caption && (
                  <button
                    onClick={() => { setCaption(''); setHashtags(''); setError(''); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-neutral-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>سڕینەوە</span>
                  </button>
                )}
              </div>
              
              <div className="relative group flex-grow flex flex-col">
                <div className="absolute inset-0 bg-gradient-to-r from-[#E54825]/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl -z-10" />
                <textarea
                  id="content-input"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full min-h-[250px] flex-grow bg-neutral-950/50 text-neutral-100 rounded-2xl p-6 border border-neutral-800 focus:border-[#E54825] focus:ring-2 focus:ring-[#E54825]/20 outline-none transition-all resize-none placeholder-neutral-600 text-lg leading-relaxed shadow-inner"
                />
              </div>

              <button
                onClick={generateHashtags}
                disabled={isLoading || !caption.trim()}
                className={`flex items-center justify-center gap-3 w-full rounded-2xl mx-auto py-5 font-bold text-lg transition-all duration-300 relative overflow-hidden group ${
                  platform === 'youtube' 
                    ? 'bg-red-600 hover:bg-red-500 text-white disabled:bg-neutral-800 disabled:text-neutral-500' 
                    : 'bg-[#E54825] hover:bg-[#ff562e] text-white disabled:bg-neutral-800 disabled:text-neutral-500'
                }`}
              >
                <div className="absolute inset-0 bg-white/20 w-full translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <span className="relative z-10 flex items-center gap-2">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>چاوەڕێبە...</span>
                    </>
                  ) : (
                    <>
                      {platform === 'tiktok' ? <TikTokIcon className="w-6 h-6" /> : <Youtube className="w-6 h-6" />}
                      <span>دروستکردنی {platform === 'tiktok' ? 'هاشتاگ' : 'تاگ'}</span>
                    </>
                  )}
                </span>
              </button>
              
              {error && (
                <div className="bg-red-500/10 text-red-500 p-4 rounded-xl border border-red-500/20 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  {error}
                </div>
              )}
            </div>

            {/* Right/Bottom Column: Output */}
            <div className="flex flex-col space-y-5">
              <div className="flex items-center justify-between mb-2 px-2">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    platform === 'youtube' ? 'bg-red-500/20' : 'bg-[#E54825]/20'
                  }`}>
                    <Sparkles className={`w-4 h-4 ${
                      platform === 'youtube' ? 'text-red-400' : 'text-[#E54825]'
                    }`} />
                  </div>
                  <label className="text-lg font-medium text-neutral-200">
                    ئەنجامەکان
                  </label>
                </div>
                
                {/* Actions moved to header context */}
                {hashtags && (
                  <div className="flex flex-row-reverse items-center gap-3">
                    {platform === 'youtube' && (
                      <div className={`px-2.5 py-1.5 bg-neutral-900 border rounded-lg text-sm font-mono flex items-center justify-center min-w-[70px] transition-colors ${
                        hashtags.length > 500 ? 'border-red-500/50 text-red-400' : 'border-white/10 text-neutral-400'
                      }`} dir="ltr">
                        {hashtags.length} / 500
                      </div>
                    )}
                    <button
                      onClick={generateHashtags}
                      disabled={isLoading}
                      className="flex items-center gap-2 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg text-sm font-medium text-white transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
                      title="دروستکردنەوە"
                    >
                      <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                      <span className="hidden sm:inline">نوێکردنەوە</span>
                    </button>
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center gap-2 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg text-sm font-medium text-white transition-all shadow-sm active:scale-95"
                    >
                      {isCopied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      <span>{isCopied ? 'کۆپیکرا' : 'کۆپی'}</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="relative w-full h-full min-h-[300px] flex-grow bg-neutral-950/80 rounded-2xl border border-neutral-800 shadow-inner overflow-hidden flex flex-col focus-within:border-[#E54825] focus-within:ring-1 focus-within:ring-[#E54825]/20 transition-all">
                {hashtags ? (
                  <textarea
                    value={hashtags}
                    onChange={(e) => setHashtags(e.target.value)}
                    className="w-full h-full bg-transparent text-white text-lg md:text-xl leading-relaxed font-medium p-6 outline-none resize-none"
                    placeholder="دەتوانیت لێرە دەستکاری ئەنجامەکان بکەیت..."
                  />
                ) : (
                  <div className="flex-grow flex items-center justify-center text-lg md:text-xl font-medium text-neutral-600 italic px-4 select-none text-center h-full">
                    {platform === 'tiktok' ? 'هاشتاگەکان لێرە دەردەکەون...' : 'تاگەکانی یوتیوب لێرە دەردەکەون...'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="mt-auto pt-16 pb-8 text-neutral-500 text-sm font-medium flex items-center justify-center gap-1.5 transition-all hover:text-neutral-300 select-none" dir="ltr">
        <span>Developed with</span>
        <Heart className="w-4 h-4 text-[#E54825] fill-current animate-pulse" />
        <span>by Mustafa Nahro</span>
      </footer>
    </div>
  );
}
