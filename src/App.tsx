/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Search, 
  Construction, 
  Factory, 
  Briefcase, 
  Truck, 
  UserPlus, 
  Skull, 
  AlertTriangle,
  Cake,
  Calendar,
  ChevronRight,
  UserX,
  BadgeCheck,
  Building2,
  PartyPopper
} from 'lucide-react';

// --- Types ---
type GameState = 'START' | 'PLAYING' | 'BIRTHDAY';

interface Level {
  id: number;
  type: 'INSPECTION' | 'JUDGEMENT';
  title: string;
  description: string;
  scenario?: string;
  background: string;
  icon: React.ReactNode;
}

// --- Constants ---
const LEVELS: Level[] = [
  {
    id: 1,
    type: 'INSPECTION',
    title: 'İnşaat Sahası Denetimi',
    description: 'Şantiyede gizlenen kaçak işçiyi bul ve üzerine tıkla!',
    background: 'bg-orange-100',
    icon: <Construction className="w-8 h-8 text-orange-600" />
  },
  {
    id: 2,
    type: 'JUDGEMENT',
    title: 'Fabrika İş Kazası Dosyası',
    description: 'Bir işçi elini makineye kaptırdı. Kim kusurlu?',
    scenario: 'İşçi baret takmamıştı ama makinede de acil durdurma butonu yoktu. İşveren "eğitim verdik" diyor ama kayıtlar kayıp...',
    background: 'bg-blue-100',
    icon: <Factory className="w-8 h-8 text-blue-600" />
  },
  {
    id: 3,
    type: 'INSPECTION',
    title: 'Plaza Ofis Baskını',
    description: 'Bu lüks ofiste sigortasız çalışan birini tespit et!',
    background: 'bg-gray-100',
    icon: <Building2 className="w-8 h-8 text-gray-600" />
  },
  {
    id: 4,
    type: 'JUDGEMENT',
    title: 'Lojistik Depo Kazası',
    description: 'Forklift devrildi. Asıl sorumlu kim?',
    scenario: 'İşveren eğitim belgelerini sundu ama forkliftin periyodik bakımı 6 ay geçmiş. İşçi ise olay anında telefonla oynuyordu...',
    background: 'bg-slate-100',
    icon: <Truck className="w-8 h-8 text-slate-600" />
  },
  {
    id: 5,
    type: 'INSPECTION',
    title: 'Büyük Tekstil Fabrikası',
    description: 'Final denetimi! Kaçak işçileri topla, İsmail denetmenim!',
    background: 'bg-red-50',
    icon: <Briefcase className="w-8 h-8 text-red-600" />
  }
];

export default function App() {
  const [gameState, setGameState] = useState<GameState>('START');
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState<null | 'success' | 'fail'>(null);
  const [caughtWorkers, setCaughtWorkers] = useState(0);

  const currentLevel = LEVELS[currentLevelIndex];

  const handleStartGame = () => {
    setGameState('PLAYING');
    setCurrentLevelIndex(0);
    setScore(0);
    setCaughtWorkers(0);
  };

  const nextLevel = () => {
    if (currentLevelIndex < LEVELS.length - 1) {
      setCurrentLevelIndex(prev => prev + 1);
      setShowFeedback(null);
      setCaughtWorkers(0);
    } else {
      setGameState('BIRTHDAY');
    }
  };

  const handleJudgement = (isEmployerFaulty: boolean) => {
    // In SGK inspection logic, often both can have fault but we usually look for institutional negligence
    setScore(prev => prev + 20);
    setShowFeedback('success');
    setTimeout(nextLevel, 1500);
  };

  const handleWorkerCatch = () => {
    setCaughtWorkers(prev => prev + 1);
    const target = currentLevel.id === 5 ? 3 : 1;
    
    if (caughtWorkers + 1 >= target) {
      setScore(prev => prev + 20);
      setShowFeedback('success');
      setTimeout(nextLevel, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden select-none">
      {/* SGK Style Header */}
      <header className="bg-blue-900 text-white p-4 shadow-md flex justify-between items-center transition-all duration-500">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-red-500 animate-pulse" />
          <h1 className="font-bold tracking-tight uppercase text-sm md:text-base">
            SGK Denetim Paneli v1.0
          </h1>
        </div>
        <div className="hidden md:block text-xs opacity-70">
          Denetmen: <span className="font-bold">İsmail Hakkı Karakaya</span>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase opacity-70">Puan</p>
          <p className="font-mono text-xl">{score.toString().padStart(4, '0')}</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-8 mt-4">
        <AnimatePresence mode="wait">
          {gameState === 'START' && (
            <motion.div 
              key="start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl p-8 border-t-8 border-blue-900 text-center"
            >
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-blue-900" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Günü Kurtarmaya Hazır mısın İsmail?</h2>
              <p className="text-slate-600 mb-8 max-w-md mx-auto">
                Bugün denetim günü! Kaçak işçileri bul, iş kazalarını adilce değerlendir ve kurumu zarardan kurtar.
              </p>
              <button 
                onClick={handleStartGame}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-10 rounded-full shadow-lg transform active:scale-95 transition-all text-xl"
              >
                GÖREVE BAŞLA!
              </button>
            </motion.div>
          )}

          {gameState === 'PLAYING' && (
            <motion.div 
              key="playing"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="relative"
            >
              {/* Level Progress */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex gap-1">
                  {LEVELS.map((l, i) => (
                    <div 
                      key={l.id} 
                      className={`h-2 w-8 rounded-full transition-all duration-500 ${i <= currentLevelIndex ? 'bg-blue-600' : 'bg-slate-200'}`}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-slate-500">Bölüm {currentLevelIndex + 1} / 5</span>
              </div>

              {/* Game UI */}
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 min-h-[400px] flex flex-col">
                <div className={`p-6 border-b flex items-center gap-4 ${currentLevel.background} transition-colors duration-500`}>
                  <div className="p-3 bg-white rounded-xl shadow-sm">
                    {currentLevel.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{currentLevel.title}</h3>
                    <p className="text-sm text-slate-700">{currentLevel.description}</p>
                  </div>
                </div>

                <div className="flex-1 relative overflow-hidden bg-slate-50 flex items-center justify-center">
                  {showFeedback === 'success' && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1.2 }}
                      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm"
                    >
                      <BadgeCheck className="w-24 h-24 text-green-500 mb-2" />
                      <p className="text-2xl font-black text-green-600 uppercase tracking-widest">Tebrikler!</p>
                      <p className="text-slate-600 font-medium">Dosya başarıyla kapatıldı.</p>
                    </motion.div>
                  )}

                  {currentLevel.type === 'INSPECTION' ? (
                    <InspectionGame 
                      levelId={currentLevel.id} 
                      onCatch={handleWorkerCatch}
                      caughtCount={caughtWorkers}
                    />
                  ) : (
                    <JudgementGame 
                      scenario={currentLevel.scenario || ''} 
                      onJudge={handleJudgement} 
                    />
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {gameState === 'BIRTHDAY' && (
            <motion.div 
              key="birthday"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl shadow-2xl p-8 border-t-8 border-red-500 text-center relative"
            >
              <Confetti />
              <div className="relative z-10">
                <motion.div 
                  className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <Cake className="w-16 h-16 text-blue-900" />
                </motion.div>
                
                <h2 className="text-4xl font-black text-blue-900 mb-6 drop-shadow-sm uppercase">
                  GÖREV TAMAMLANDI!
                </h2>
                
                <div className="space-y-4 mb-10">
                  <p className="text-2xl font-bold text-slate-700 italic">
                    "İYİ Kİ DOĞDUN İSMAİL HAKKI KARAKAYA,"
                  </p>
                  <p className="text-xl text-slate-500 font-medium">
                    kardeşim nice mutlu senelere.
                  </p>
                </div>

                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 inline-block">
                  <p className="text-sm uppercase text-slate-500 mb-1">Toplam Denetim Skoru</p>
                  <p className="text-4xl font-mono font-bold text-blue-900">{score}</p>
                </div>

                <div className="mt-12 flex justify-center gap-4">
                  <div className="flex items-center gap-2 text-blue-500 px-4 py-2 bg-blue-50 rounded-full font-bold text-sm">
                    <Calendar className="w-4 h-4" /> 20 Nisan 2026
                  </div>
                  <div className="flex items-center gap-2 text-red-500 px-4 py-2 bg-red-50 rounded-full font-bold text-sm">
                    <PartyPopper className="w-4 h-4" /> Mutlu Yıllar!
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Branding */}
      <footer className="fixed bottom-4 left-0 right-0 text-center pointer-events-none">
        <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">
          Department of Birthdays & Inspections
        </p>
      </footer>
    </div>
  );
}

// --- Dynamic Mini-Game Components ---

function InspectionGame({ 
  levelId, 
  onCatch, 
  caughtCount 
}: { 
  levelId: number; 
  onCatch: () => void;
  caughtCount: number;
}) {
  const [positions, setPositions] = useState<{id: number, x: number, y: number, isBad: boolean}[]>([]);

  useEffect(() => {
    const generate = () => {
      const p = [];
      // Level 1: One bad guy
      // Level 3: One bad guy
      // Level 5: Three bad guys
      const badTarget = levelId === 5 ? 3 : 1;
      
      // Decoys
      for(let i=0; i<8; i++) {
        p.push({
          id: i,
          x: 10 + Math.random() * 80,
          y: 10 + Math.random() * 80,
          isBad: false
        });
      }
      
      // Bad guys
      for(let i=0; i<badTarget; i++) {
        p.push({
          id: 100 + i,
          x: 10 + Math.random() * 80,
          y: 10 + Math.random() * 80,
          isBad: true
        });
      }
      setPositions(p);
    };
    generate();
  }, [levelId]);

  return (
    <div className="w-full h-full min-h-[400px] relative p-4">
      {positions.map((pos) => (
        <motion.div
          key={pos.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          className="absolute cursor-pointer"
          style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
          onClick={() => pos.isBad && onCatch()}
        >
          {pos.isBad ? (
            <motion.div 
              className="relative p-2"
              animate={{ 
                x: [0, 2, -2, 0], 
                y: [0, -2, 2, 0] 
              }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              <UserX className="w-10 h-10 text-red-500 drop-shadow-lg" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
            </motion.div>
          ) : (
            <div className="p-2 opacity-80 grayscale">
              <BadgeCheck className="w-8 h-8 text-blue-500" />
            </div>
          )}
        </motion.div>
      ))}

      {levelId === 5 && (
        <div className="absolute top-4 right-4 bg-white/80 px-4 py-2 rounded-full font-bold shadow-sm">
          Yakalanan: {caughtCount} / 3
        </div>
      )}
    </div>
  );
}

function JudgementGame({ 
  scenario, 
  onJudge 
}: { 
  scenario: string; 
  onJudge: (employer: boolean) => void 
}) {
  return (
    <div className="p-10 w-full max-w-lg space-y-8">
      <div className="flex gap-4 items-start bg-amber-50 p-6 rounded-2xl border border-amber-200">
        <AlertTriangle className="w-10 h-10 text-amber-600 shrink-0" />
        <p className="text-amber-900 font-medium text-lg leading-relaxed">
          Dosya İçeriği: <br/> 
          <span className="text-slate-600 text-sm italic font-normal">
            "{scenario}"
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button 
          onClick={() => onJudge(true)}
          className="flex flex-col items-center justify-center gap-4 bg-white p-8 rounded-2xl border-2 border-slate-200 hover:border-red-500 hover:bg-red-50 transition-all group"
        >
          <div className="p-4 bg-red-100 rounded-full group-hover:scale-110 transition-transform">
            <Building2 className="w-8 h-8 text-red-600" />
          </div>
          <span className="font-bold uppercase tracking-wide">İşveren Kusurlu</span>
        </button>

        <button 
          onClick={() => onJudge(false)}
          className="flex flex-col items-center justify-center gap-4 bg-white p-8 rounded-2xl border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all group"
        >
          <div className="p-4 bg-blue-100 rounded-full group-hover:scale-110 transition-transform">
            <UserX className="w-8 h-8 text-blue-600" />
          </div>
          <span className="font-bold uppercase tracking-wide">İşçi Kusurlu</span>
        </button>
      </div>

      <p className="text-center text-xs text-slate-400 font-mono">
        DENETMEN KARARI NİHAİDİR
      </p>
    </div>
  );
}

function Confetti() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden h-full w-full">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-sm"
          style={{
            backgroundColor: ['#ef4444', '#3b82f6', '#facc15', '#22c55e'][i % 4],
            left: `${Math.random() * 100}%`,
            top: -20,
          }}
          animate={{
            y: [0, 800],
            rotate: [0, 360 * 2],
            x: [0, (Math.random() - 0.5) * 100]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 5
          }}
        />
      ))}
    </div>
  );
}
