import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Cloud, Zap, Sparkles, Star, Shield, ArrowLeft, Moon, Sun, Activity, Search, Loader2, History, Trash2, LayoutDashboard, CalendarDays, CheckCircle2, XCircle, Image as ImageIcon, FileText, Video, MessageSquare, Download, FileDown } from 'lucide-react';
import { analyzeSocialPage } from './services/gemini';
import { PageAnalysis } from './types';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

const characters = [
  {
    id: 'blossom',
    name: 'بلوسوم',
    role: 'نمو احترافي وقيادي',
    gradient: 'from-pink-400 to-rose-500',
    shadow: 'shadow-pink-500/30',
    hoverShadow: 'hover:shadow-pink-500/40',
    bgLight: 'bg-pink-50/50',
    bgDark: 'dark:bg-pink-950/20',
    border: 'border-pink-200 dark:border-pink-800/50',
    text: 'text-pink-600 dark:text-pink-400',
    icon: <Star className="w-8 h-8" />,
    trailGradient: 'from-transparent to-pink-500',
    glowColor: 'shadow-pink-500',
    flyingIcon: <Heart className="w-4 h-4" />,
    animationType: 'glow'
  },
  {
    id: 'bubbles',
    name: 'بابلز',
    role: 'نمو تفاعلي ومرح',
    gradient: 'from-cyan-400 to-blue-500',
    shadow: 'shadow-blue-500/30',
    hoverShadow: 'hover:shadow-blue-500/40',
    bgLight: 'bg-blue-50/50',
    bgDark: 'dark:bg-blue-950/20',
    border: 'border-blue-200 dark:border-blue-800/50',
    text: 'text-blue-600 dark:text-blue-400',
    icon: <Cloud className="w-8 h-8" />,
    trailGradient: 'from-transparent to-blue-500',
    glowColor: 'shadow-blue-500',
    flyingIcon: <Sparkles className="w-4 h-4" />,
    animationType: 'bounce'
  },
  {
    id: 'buttercup',
    name: 'باتركاب',
    role: 'نمو جريء ومبيعات',
    gradient: 'from-lime-400 to-emerald-500',
    shadow: 'shadow-emerald-500/30',
    hoverShadow: 'hover:shadow-emerald-500/40',
    bgLight: 'bg-emerald-50/50',
    bgDark: 'dark:bg-emerald-950/20',
    border: 'border-emerald-200 dark:border-emerald-800/50',
    text: 'text-emerald-600 dark:text-emerald-400',
    icon: <Zap className="w-8 h-8" />,
    trailGradient: 'from-transparent to-emerald-500',
    glowColor: 'shadow-emerald-500',
    flyingIcon: <Shield className="w-4 h-4" />,
    animationType: 'pulse'
  }
];

const getAnimationProps = (type: string) => {
  switch (type) {
    case 'bounce':
      return {
        initial: { right: '-20%', opacity: 0, y: 0 },
        animate: { 
          right: '120%', 
          opacity: [0, 1, 1, 0],
          y: [0, -40, 0, -30, 0, -15, 0]
        },
        transition: { duration: 1.2, ease: "linear" }
      };
    case 'pulse':
      return {
        initial: { right: '-20%', opacity: 0, scale: 1 },
        animate: { 
          right: '120%', 
          opacity: [0, 1, 1, 0],
          scale: [1, 1.5, 1, 1.5, 1, 1.5, 1]
        },
        transition: { duration: 0.7, ease: "easeIn" }
      };
    case 'glow':
    default:
      return {
        initial: { right: '-20%', opacity: 0, scale: 1 },
        animate: { 
          right: '120%', 
          opacity: [0, 1, 1, 0],
          scale: [1, 1.2, 1]
        },
        transition: { duration: 0.8, ease: "easeInOut" }
      };
  }
};

function CharacterButton({ character, onClick, disabled }: { character: typeof characters[0], onClick: () => void, disabled: boolean }) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (isAnimating || disabled) return;
    setIsAnimating(true);
    onClick();
    
    const duration = character.animationType === 'bounce' ? 1200 : character.animationType === 'pulse' ? 700 : 800;
    setTimeout(() => setIsAnimating(false), duration);
  };

  const animProps = getAnimationProps(character.animationType);

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02, y: -4 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      onClick={handleClick}
      disabled={disabled}
      className={`group relative overflow-hidden w-full rounded-[2rem] p-6 text-right border ${character.border} ${character.bgLight} ${character.bgDark} transition-all duration-300 shadow-sm ${disabled ? 'opacity-50 cursor-not-allowed' : character.hoverShadow}`}
    >
      {/* Content */}
      <div className="relative z-10 flex items-center justify-between">
        <div className={`w-12 h-12 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm text-gray-400 ${!disabled && `group-hover:${character.text}`} transition-colors shrink-0`}>
          <ArrowLeft className={`w-6 h-6 transform transition-transform ${!disabled && 'group-hover:-translate-x-1'}`} />
        </div>
        <div className="text-right flex flex-col items-end">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${character.gradient} flex items-center justify-center text-white shadow-lg mb-4 transform transition-transform ${!disabled && 'group-hover:scale-110 group-hover:rotate-3'}`}>
            {character.icon}
          </div>
          <h3 className={`text-2xl font-display font-bold ${character.text} mb-1 tracking-tight`}>
            {character.name}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 font-medium text-sm">
            {character.role}
          </p>
        </div>
      </div>

      {/* Flying Animation */}
      <AnimatePresence>
        {isAnimating && (
          <motion.div
            initial={animProps.initial}
            animate={animProps.animate}
            exit={{ opacity: 0 }}
            transition={animProps.transition}
            className="absolute top-1/2 -translate-y-1/2 z-20 flex items-center pointer-events-none"
          >
            {/* Flying Object */}
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${character.gradient} shadow-[0_0_30px_rgba(0,0,0,0.5)] ${character.glowColor} flex items-center justify-center text-white z-10`}>
              {character.flyingIcon}
            </div>
            {/* Trail */}
            <div 
              className={`h-3 w-40 rounded-full bg-gradient-to-l ${character.trailGradient} blur-md opacity-70 -ml-4`}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Background decorative elements */}
      <div className={`absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-gradient-to-br ${character.gradient} opacity-10 blur-3xl transition-opacity ${!disabled && 'group-hover:opacity-20'}`} />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/40 to-transparent dark:from-white/5 opacity-50 pointer-events-none" />
    </motion.button>
  );
}

export default function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<PageAnalysis[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<PageAnalysis | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [isDownloadingWord, setIsDownloadingWord] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('pageGrowthHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
  }, []);

  const saveHistory = (newHistory: PageAnalysis[]) => {
    setHistory(newHistory);
    localStorage.setItem('pageGrowthHistory', JSON.stringify(newHistory));
  };

  const handleAnalyze = async (personaId: string) => {
    if (!url.trim()) {
      setError('يرجى إدخال رابط الصفحة أولاً');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await analyzeSocialPage(url, personaId);
      const newAnalysis: PageAnalysis = {
        id: Date.now().toString(),
        url,
        date: new Date().toISOString(),
        ...result,
      };

      setCurrentAnalysis(newAnalysis);
      saveHistory([newAnalysis, ...history]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'حدث خطأ أثناء تحليل الصفحة. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const loadFromHistory = (item: PageAnalysis) => {
    setCurrentAnalysis(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newHistory = history.filter(item => item.id !== id);
    saveHistory(newHistory);
    if (currentAnalysis?.id === id) {
      setCurrentAnalysis(null);
    }
  };

  const downloadPDF = async () => {
    if (!contentRef.current) return;
    setIsDownloadingPdf(true);
    try {
      const element = contentRef.current;
      
      // Use html-to-image to capture the element as a PNG
      // This supports modern CSS like oklch and color-mix natively
      const dataUrl = await toPng(element, {
        quality: 0.98,
        pixelRatio: 2,
        backgroundColor: isDarkMode ? '#111827' : '#ffffff', // Fallback background
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
        }
      });

      // Create jsPDF instance
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4',
      });

      // Calculate dimensions to fit A4 page
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgProps = pdf.getImageProperties(dataUrl);
      const imgWidth = pdfWidth;
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(dataUrl, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      // Add subsequent pages if content is taller than one page
      while (heightLeft > 0) {
        position -= pdfHeight;
        pdf.addPage();
        pdf.addImage(dataUrl, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }
      
      // Save PDF
      pdf.save('page-growth-plan.pdf');
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('حدث خطأ أثناء تحميل ملف PDF');
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const downloadWord = async () => {
    if (!contentRef.current) return;
    setIsDownloadingWord(true);
    try {
      // Simulate a small delay for UI feedback
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML to Word Document</title><style>body { font-family: Arial, sans-serif; direction: rtl; }</style></head><body>";
      const footer = "</body></html>";
      const sourceHTML = header + contentRef.current.innerHTML + footer;
      
      const blob = new Blob(['\ufeff', sourceHTML], {
        type: 'application/msword'
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'page-growth-plan.doc';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Word generation failed:', err);
      alert('حدث خطأ أثناء تحميل ملف Word');
    } finally {
      setIsDownloadingWord(false);
    }
  };

  const getThemeColors = (persona: string) => {
    switch (persona) {
      case 'bubbles': return 'text-blue-500 border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800';
      case 'buttercup': return 'text-emerald-500 border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-800';
      case 'blossom':
      default: return 'text-pink-500 border-pink-200 bg-pink-50 dark:bg-pink-900/20 dark:border-pink-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300 relative overflow-hidden" dir="rtl">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-50 pointer-events-none" />
      
      {/* Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-400/20 dark:bg-pink-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none translate-y-1/2" />

      {/* Header */}
      <header className="relative z-10 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 sticky top-0">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 flex items-center justify-center text-white dark:text-gray-900 shadow-md">
              <Activity className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-display font-bold tracking-tight">
              PowerGrowth
            </h1>
          </div>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-3 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-800/50 text-gray-600 dark:text-gray-400 transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-8">
        {/* Main Content Area */}
        <div className="flex-1 space-y-12">
          
          {/* Input & Character Selection */}
          <div className="text-center space-y-4">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-display font-bold tracking-tight"
            >
              اختر <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-blue-500 to-emerald-500">بطلتك</span> للنمو
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto"
            >
              أدخل رابط صفحتك، ثم اختر أسلوب النمو الذي تفضله لإنشاء خطة 30 يوماً مخصصة لك.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-2xl mx-auto mt-8 relative"
            >
              <input
                type="url"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setError(null);
                }}
                placeholder="https://instagram.com/yourpage"
                className="w-full pl-4 pr-12 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm focus:ring-2 focus:ring-pink-400 focus:border-pink-400 outline-none transition-all text-left dir-ltr dark:text-white shadow-sm"
                disabled={loading}
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </motion.div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl mx-auto mt-4 p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-sm border border-red-100 dark:border-red-800"
              >
                {error}
              </motion.div>
            )}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {characters.map((character, index) => (
              <motion.div
                key={character.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <CharacterButton 
                  character={character} 
                  onClick={() => handleAnalyze(character.id)}
                  disabled={loading}
                />
              </motion.div>
            ))}
          </motion.div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 className="w-10 h-10 animate-spin text-pink-500" />
              <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse">جاري تحليل الصفحة وبناء الخطة...</p>
            </div>
          )}

          {/* Results Section */}
          <AnimatePresence mode="wait">
            {currentAnalysis && !loading && (
              <motion.div
                key={currentAnalysis.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="flex justify-end gap-4 mb-4">
                  <button
                    onClick={downloadPDF}
                    disabled={isDownloadingPdf}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isDownloadingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
                    تحميل PDF
                  </button>
                  <button
                    onClick={downloadWord}
                    disabled={isDownloadingWord}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isDownloadingWord ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    تحميل Word
                  </button>
                </div>

                <div ref={contentRef} className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                  {/* Analysis Cards */}
                  <section>
                    <h3 className="text-2xl font-bold mb-8 flex items-center gap-2 text-gray-900 dark:text-white">
                      <LayoutDashboard className={`w-6 h-6 ${getThemeColors(currentAnalysis.persona).split(' ')[0]}`} />
                      التقييم الشامل
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                      <AnalysisCard title="الشعار (Logo)" icon={<ImageIcon className="w-5 h-5 text-blue-500" />} content={currentAnalysis.analysis.logo} />
                      <AnalysisCard title="السيرة الذاتية (Bio)" icon={<FileText className="w-5 h-5 text-emerald-500" />} content={currentAnalysis.analysis.bio} />
                      <AnalysisCard title="المنشورات (Posts)" icon={<MessageSquare className="w-5 h-5 text-purple-500" />} content={currentAnalysis.analysis.posts} />
                      <AnalysisCard title="الريلز (Reels)" icon={<Video className="w-5 h-5 text-rose-500" />} content={currentAnalysis.analysis.reels} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                      <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm mt-4">
                        <h4 className="font-bold text-lg mb-4 flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-5 h-5" />
                          نقاط القوة
                        </h4>
                        <ul className="space-y-3">
                          {currentAnalysis.analysis.strengths.map((strength, i) => (
                            <li key={i} className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0" />
                              <span>{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm mt-4">
                        <h4 className="font-bold text-lg mb-4 flex items-center gap-2 text-rose-600 dark:text-rose-400">
                          <XCircle className="w-5 h-5" />
                          نقاط الضعف
                        </h4>
                        <ul className="space-y-3">
                          {currentAnalysis.analysis.weaknesses.map((weakness, i) => (
                            <li key={i} className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                              <span className="w-2 h-2 rounded-full bg-rose-500 mt-2 shrink-0" />
                              <span>{weakness}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </section>

                  {/* 30-Day Plan */}
                  <section className="mt-12">
                    <h3 className="text-2xl font-bold mb-8 flex items-center gap-2 text-gray-900 dark:text-white">
                      <CalendarDays className={`w-6 h-6 ${getThemeColors(currentAnalysis.persona).split(' ')[0]}`} />
                      خطة النمو (30 يوماً)
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                      {currentAnalysis.plan.map((dayPlan) => (
                        <div key={dayPlan.day} className={`relative rounded-3xl p-6 border shadow-sm hover:shadow-md transition-all duration-300 group pt-10 mt-4 ${getThemeColors(currentAnalysis.persona)}`}>
                          <div className={`absolute top-0 right-0 w-12 h-12 rounded-bl-2xl rounded-tr-3xl flex items-center justify-center font-bold text-lg bg-white dark:bg-gray-800`}>
                            {dayPlan.day}
                          </div>
                          <div className="mt-2">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 bg-white dark:bg-gray-800`}>
                              {dayPlan.action}
                            </span>
                            <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed font-medium">
                              {dayPlan.content}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar / History */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 sticky top-24">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
              <History className="w-5 h-5 text-gray-400" />
              السجل السابق
            </h3>
            
            {history.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">لا يوجد سجلات سابقة</p>
            ) : (
              <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto pr-2 custom-scrollbar">
                {history.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => loadFromHistory(item)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all group ${
                      currentAnalysis?.id === item.id
                        ? 'border-gray-400 bg-gray-50 dark:bg-gray-800 dark:border-gray-500'
                        : 'border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50/50 dark:hover:bg-gray-800/50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="truncate pr-2">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate dir-ltr text-right" title={item.url}>
                          {item.url.replace(/^https?:\/\/(www\.)?/, '')}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {new Date(item.date).toLocaleDateString('ar-EG')}
                        </p>
                      </div>
                      <button
                        onClick={(e) => deleteHistoryItem(item.id, e)}
                        className="text-gray-400 hover:text-red-500 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
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

      </main>
    </div>
  );
}

function AnalysisCard({ title, icon, content }: { title: string, icon: React.ReactNode, content: string }) {
  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm mt-6">
      <h4 className="font-bold text-lg mb-3 flex items-center gap-2 text-gray-900 dark:text-white mt-2">
        {icon}
        {title}
      </h4>
      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
        {content}
      </p>
    </div>
  );
}
