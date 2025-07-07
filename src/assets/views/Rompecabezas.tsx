import { useState, useEffect, useRef, useCallback } from 'react';
import { Brain, Clock, Trophy, Volume2, VolumeX, CheckCircle, XCircle, Home } from 'lucide-react';
type BrainPart = {
  id: string;
  name: string;
  description: string;
  color: string;
  image: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
};

type PuzzlePiece = BrainPart & {
  isPlaced: boolean;
  currentPosition: { x: number; y: number };
  rotation: number;
};
const ArmaTuMenteBrainPuzzle = () => {
    // --- ESTADOS DEL JUEGO ---
    const [gameState, setGameState] = useState('menu'); // 'menu', 'playing', 'levelComplete', 'gameComplete', 'gameOver'
    const [currentLevel, setCurrentLevel] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(120);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [lives, setLives] = useState(3);

    // --- ESTADOS DEL ROMPECABEZAS ---
    const [puzzlePieces, setPuzzlePieces] = useState<PuzzlePiece[]>([]);
    const [completedPieces, setCompletedPieces] = useState(new Set());
    const [selectedPieceId, setSelectedPieceId] = useState(null);

    // --- ESTADOS PARA ARRASTRAR Y SOLTAR ---
    const [draggingPieceId, setDraggingPieceId] = useState(null);
    const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    
    const brainContainerRef = useRef<HTMLDivElement>(null);

    // --- DATOS (sin cambios) ---
    const brainParts = [
      { id: 'lobulo_frontal', name: 'Lóbulo Frontal', description: 'Planificación, razonamiento, movimiento y lenguaje.', color: '#ef4444', image: '/images/lobulo_frontal.png', position: { x: 45, y: 5 }, size: { width: 35, height: 30 } },
      { id: 'lobulo_parietal', name: 'Lóbulo Parietal', description: 'Tacto, temperatura, dolor y orientación espacial.', color: '#eab308', image: '/images/lobulo_parietal.png', position: { x: 25, y: 10 }, size: { width: 30, height: 25 } },
      { id: 'lobulo_occipital', name: 'Lóbulo Occipital', description: 'Procesamiento de la información visual.', color: '#60a5fa', image: '/images/lobulo_occipital.png', position: { x: 15, y: 55 }, size: { width: 25, height: 20 } },
      { id: 'lobulo_temporal', name: 'Lóbulo Temporal', description: 'Audición, memoria y reconocimiento de caras.', color: '#4ade80', image: '/images/lobulo_temporal.png', position: { x: 35, y: 60 }, size: { width: 30, height: 25 } },
      { id: 'cerebelo', name: 'Cerebelo', description: 'Coordinación, equilibrio y postura.', color: '#fb923c', image: '/images/cerebelo.png', position: { x: 25, y: 78 }, size: { width: 25, height: 18 } },
      { id: 'tronco', name: 'Tronco Encefálico', description: 'Funciones vitales: respiración, ritmo cardíaco.', color: '#6366f2', image: '/images/tronco.png', position: { x: 50, y: 80 }, size: { width: 15, height: 18 } },
    ];
    const levels = [
      { id: 1, name: 'Lóbulos Principales', description: 'Identifica los cuatro lóbulos principales.', parts: ['lobulo_frontal', 'lobulo_parietal', 'lobulo_occipital', 'lobulo_temporal'], timeLimit: 120 },
      { id: 2, name: 'Cerebro Completo', description: 'Completa todo el rompecabezas cerebral.', parts: ['lobulo_frontal', 'lobulo_parietal', 'lobulo_occipital', 'lobulo_temporal', 'cerebelo', 'tronco'], timeLimit: 180 },
    ];

    // --- LÓGICA DEL JUEGO ---

    const setupLevel = useCallback((levelIndex :number) => {
        const currentLevelData = levels[levelIndex];
        const pieces: PuzzlePiece[] = currentLevelData.parts
            .map(partId => {
                const part = brainParts.find(p => p.id === partId);
                if (!part) return null;
                return {
                    ...part,
                    isPlaced: false,
                    currentPosition: { x: 0, y: 0 },
                    rotation: 0,
                } as PuzzlePiece;
            })
            .filter((p): p is PuzzlePiece => p !== null);
        setPuzzlePieces(pieces);
        setCompletedPieces(new Set());
        setTimeLeft(currentLevelData.timeLimit);
        setGameState('playing');
        setSelectedPieceId(null);
        setDraggingPieceId(null);
    }, [levels, brainParts]);

    const startGame = (levelIndex = 0) => {
        setCurrentLevel(levelIndex);
        setScore(0);
        setLives(3);
        setupLevel(levelIndex);
    };

    useEffect(() => {
        if (gameState !== 'playing' || timeLeft <= 0) {
            if (timeLeft <= 0 && gameState === 'playing') setGameState('gameOver');
            return;
        }
        const timer = setInterval(() => setTimeLeft(p => p - 1), 1000);
        return () => clearInterval(timer);
    }, [gameState, timeLeft]);

    const handleCorrectPlacement = useCallback((pieceId : any) => {
        setCompletedPieces(prev => new Set(prev).add(pieceId));
        setScore(prev => prev + 100 + timeLeft);
        setSelectedPieceId(null);
        
        const newCompletedCount = completedPieces.size + 1;
        if (newCompletedCount === levels[currentLevel].parts.length) {
            setTimeout(() => {
                setGameState(currentLevel < levels.length - 1 ? 'levelComplete' : 'gameComplete');
            }, 500);
        }
    }, [completedPieces, currentLevel, levels, timeLeft]);
    
    const handleIncorrectPlacement = useCallback(() => {
        setLives(prev => {
            const newLives = prev - 1;
            if (newLives <= 0) setGameState('gameOver');
            return newLives;
        });
        setSelectedPieceId(null);
    }, []);

    // --- MANEJADORES DE INTERACCIÓN (CLICK Y ARRASTRE) ---

    const handlePieceClick = (pieceId : any) => {
        if (draggingPieceId) return; // Evitar click si se está arrastrando
        setSelectedPieceId(currentId => (currentId === pieceId ? null : pieceId));
    };

    const handleDropZoneClick = (targetPartId : any) => {
        if (!selectedPieceId) return;
        if (selectedPieceId === targetPartId) {
            handleCorrectPlacement(targetPartId);
        } else {
            handleIncorrectPlacement();
        }
    };
    
    const handlePointerDown = (e : any, pieceId : any) => {
        if (completedPieces.has(pieceId)) return;
        e.preventDefault();
        e.stopPropagation();

        setSelectedPieceId(pieceId);
        setDraggingPieceId(pieceId);
        
        const rect = e.currentTarget.getBoundingClientRect();
        setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        setDragPosition({ x: e.clientX - (e.clientX - rect.left), y: e.clientY - (e.clientY - rect.top) });

        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);
    };

    const handlePointerMove = useCallback((e : any) => {
        e.preventDefault();
        setDragPosition({ x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y });
    }, [dragOffset]);

    const handlePointerUp = useCallback((e : any) => {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
        
        if (!draggingPieceId || !brainContainerRef.current) {
            setDraggingPieceId(null);
            return;
        };

        const brainRect = brainContainerRef.current.getBoundingClientRect();
        const dropX = e.clientX;
        const dropY = e.clientY;

        for (const partId of levels[currentLevel].parts) {
            if (completedPieces.has(partId)) continue;

            const partInfo = brainParts.find(p => p.id === partId);
            if (!partInfo) continue;

            const zoneX = brainRect.left + (partInfo.position.x / 100) * brainRect.width;
            const zoneY = brainRect.top + (partInfo.position.y / 100) * brainRect.height;
            const zoneWidth = (partInfo.size.width / 100) * brainRect.width;
            const zoneHeight = (partInfo.size.height / 100) * brainRect.height;

            if (dropX >= zoneX && dropX <= zoneX + zoneWidth && dropY >= zoneY && dropY <= zoneY + zoneHeight) {
                if (draggingPieceId === partId) {
                    handleCorrectPlacement(partId);
                } else {
                    handleIncorrectPlacement();
                }
                break;
            }
        }
        
        setDraggingPieceId(null);

    }, [draggingPieceId, levels, currentLevel, brainParts, completedPieces, handleCorrectPlacement, handleIncorrectPlacement, handlePointerMove]);

    // --- COMPONENTES DE RENDERIZADO ---

    const BrainVisualization = () => (
      <div className="relative w-full h-96 bg-gradient-to-br from-purple-900 to-pink-900 rounded-3xl border-4 border-yellow-400 overflow-hidden flex items-center justify-center" ref={brainContainerRef}>
          <div className="relative w-[350px] h-[350px] sm:w-[400px] sm:h-[400px]">
              <img src="/images/cerebro_base.png" alt="Maqueta del cerebro" className="absolute inset-0 w-full h-full object-contain opacity-10"/>
              <svg viewBox="0 0 100 100" className="w-full h-full">
                  {levels[currentLevel]?.parts.map(partId => {
                      const part = brainParts.find(p => p.id === partId);
                      if (!part) return null;

                      if (completedPieces.has(partId)) {
                          return <image key={part.id} href={part.image} x={part.position.x} y={part.position.y} width={part.size.width} height={part.size.height} className="transition-opacity duration-500"/>
                      } else {
                          const isSelectedTarget = selectedPieceId === partId;
                          return <rect key={part.id} x={part.position.x} y={part.position.y} width={part.size.width} height={part.size.height} fill="rgba(255,255,255,0.1)" stroke={isSelectedTarget ? '#fbbf24' : 'rgba(255,255,255,0.4)'} strokeWidth="0.5" strokeDasharray={isSelectedTarget ? "none" : "2 2"} className="cursor-pointer transition-all duration-300 hover:fill-rgba(255,255,255,0.2)" rx="2" onClick={() => handleDropZoneClick(partId)}/>
                      }
                  })}
              </svg>
          </div>
      </div>
    );
    
    const PuzzlePiece = ({ piece } : { piece : any }) => (
        <div
            className={`relative transition-opacity duration-300 ${draggingPieceId === piece.id ? 'opacity-30' : 'opacity-100'}`}
            onPointerDown={(e) => handlePointerDown(e, piece.id)}
            onClick={() => handlePieceClick(piece.id)} // Mantener para seleccionar sin arrastrar
        >
          <div
            className={`w-full h-24 bg-white/10 rounded-lg shadow-lg border-2 border-white/30 flex flex-col items-center justify-center p-2 cursor-grab transition-all duration-300 hover:scale-105 hover:bg-white/20 ${selectedPieceId === piece.id && !draggingPieceId ? 'ring-2 ring-yellow-400 scale-105' : ''}`}
            >
            <div className="h-14 flex items-center justify-center"><img src={piece.image} alt={piece.name} className="max-w-full max-h-full object-contain"/></div>
            <span className="text-white text-xs font-bold text-center mt-2 truncate w-full">{piece.name}</span>
          </div>
        </div>
      );
      
      const FloatingPiece = () => {
        if (!draggingPieceId) return null;
        const piece = brainParts.find(p => p.id === draggingPieceId);
        if (!piece) return null;
      
        return (
          <div
            className="fixed top-0 left-0 pointer-events-none z-50"
            style={{ transform: `translate(${dragPosition.x}px, ${dragPosition.y}px)` }}
          >
             <div className="w-40 h-28 bg-black/50 backdrop-blur-md rounded-lg shadow-2xl border-2 border-yellow-400 flex flex-col items-center justify-center p-2 animate-pulse">
                <div className="h-20 flex items-center justify-center">
                    <img src={piece.image} alt={piece.name} className="max-w-full max-h-full object-contain" />
                </div>
                <span className="text-white text-sm font-bold mt-1">{piece.name}</span>
            </div>
          </div>
        );
      };
      

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white font-sans relative overflow-hidden select-none">
        <FloatingPiece />
        {/* ... Resto del JSX que es principalmente visual y de layout ... */}
        {/* ... lo pego sin cambios ya que no necesita modificaciones. ... */}
        
        {/* Fondo animado */}
      <div className="absolute inset-0 overflow-hidden z-0">
        {[...Array(50)].map((_, i) => (
          <div key={i} className="absolute w-1 h-1 bg-yellow-300 rounded-full animate-pulse" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 5}s`, animationDuration: `${2 + Math.random() * 3}s` }}/>
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-4 md:p-6">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-3 rounded-full shadow-lg">
                <Brain className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-bold text-white">Arma tu Mente</h1>
                <p className="text-pink-200 text-sm md:text-base">Rompecabezas del Cerebro</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 md:space-x-4">
              {gameState === 'playing' && (
                <div className="flex items-center space-x-2 md:space-x-4 bg-white/10 backdrop-blur-sm rounded-full p-2">
                  <div className="flex items-center space-x-2 px-2">
                    <Clock className="text-yellow-400" size={20} />
                    <span className="font-bold w-10 text-center">{timeLeft}s</span>
                  </div>
                  <div className="flex items-center space-x-2 px-2">
                    <Trophy className="text-yellow-400" size={20} />
                    <span className="font-bold">{score}</span>
                  </div>
                  <div className="flex items-center space-x-1 px-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className={`w-4 h-4 rounded-full transition-colors duration-300 ${ i < lives ? 'bg-red-500 animate-pulse' : 'bg-gray-600' }`}/>
                    ))}
                  </div>
                </div>
              )}
              <button onClick={() => setSoundEnabled(!soundEnabled)} className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all duration-300 backdrop-blur-sm">
                {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
              </button>
            </div>
          </div>
        </header>

        {/* Contenido Principal */}
        <main className="flex-grow px-4 md:px-6 py-8 flex items-center">
          <div className="max-w-7xl mx-auto w-full">
            
            {gameState === 'menu' && ( /* ... */ <div className="text-center space-y-8 animate-fade-in">
                <div className="bg-white/10 rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20 backdrop-blur-md max-w-4xl mx-auto">
                  <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">Elige un Nivel</h2>
                  <p className="text-xl text-pink-200 mb-8">Pon a prueba tu conocimiento sobre el cerebro.</p>
                  <div className="grid md:grid-cols-2 gap-6">
                    {levels.map((level, index) => (
                      <div key={level.id} className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 flex flex-col">
                        <div className="flex-grow">
                          <h3 className="text-xl font-bold text-white mb-2">Nivel {level.id}: {level.name}</h3>
                          <p className="text-pink-200 text-sm mb-4">{level.description}</p>
                        </div>
                        <div className="flex justify-between text-xs text-white opacity-70 mb-4">
                          <span><Clock size={14} className="inline mr-1"/>{level.timeLimit}s</span>
                        </div>
                        <button onClick={() => startGame(index)} className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-3 rounded-full hover:scale-105 transition-transform duration-300">
                          Jugar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>)}
            {gameState === 'playing' && ( /* ... */ <div className="space-y-6 animate-fade-in">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-white mb-1">Nivel {currentLevel + 1}: {levels[currentLevel].name}</h2>
                  <p className="text-pink-200">{levels[currentLevel].description}</p>
                </div>
                
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="flex flex-col">
                    <h3 className="text-2xl font-bold text-white text-center mb-4">Coloca las piezas aquí</h3>
                    <BrainVisualization />
                  </div>
                  
                  <div className="flex flex-col">
                    <h3 className="text-2xl font-bold text-white text-center mb-4">Piezas del Rompecabezas</h3>
                    <div className="h-96 bg-white/10 rounded-3xl border-2 border-white/20 p-4 grid grid-cols-2 md:grid-cols-3 gap-2 overflow-y-auto">
                      {puzzlePieces.filter(p => !completedPieces.has(p.id)).map(piece => (
                        <PuzzlePiece key={piece.id} piece={piece} />
                      ))}
                    </div>
                  </div>
                </div>

                {selectedPieceId && !draggingPieceId && (
                  <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm max-w-2xl mx-auto text-center animate-fade-in-up">
                    <h4 className="text-xl font-bold text-yellow-300">{brainParts.find(p => p.id === selectedPieceId)?.name}</h4>
                    <p className="text-pink-200 text-sm">{brainParts.find(p => p.id === selectedPieceId)?.description}</p>
                  </div>
                )}
                
                <div className="text-center mt-6">
                  <button onClick={() => startGame()} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-full transition-all duration-300">
                    <Home className="inline mr-2" size={20}/> Volver al Menú
                  </button>
                </div>
              </div>)}
            
            {['levelComplete', 'gameComplete', 'gameOver'].includes(gameState) && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in">
                <div className="bg-gradient-to-br from-gray-800 to-purple-900/80 rounded-3xl p-8 md:p-12 text-center space-y-6 max-w-lg w-11/12 border-2 border-yellow-400">
                  {gameState === 'levelComplete' && <>
                    <CheckCircle className="text-green-400 mx-auto" size={80} />
                    <h2 className="text-4xl font-bold">¡Nivel Completado!</h2>
                    <p className="text-xl text-pink-200">Puntuación: {score}</p>
                    <button onClick={() => setupLevel(currentLevel + 1)} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-full text-lg">Siguiente Nivel</button>
                  </>}
                  {gameState === 'gameComplete' && <>
                    <Trophy className="text-yellow-400 mx-auto" size={80} />
                    <h2 className="text-4xl font-bold">¡Juego Completado!</h2>
                    <p className="text-xl text-white">¡Eres un experto del cerebro!</p>
                    <p className="text-2xl text-yellow-300 font-bold">Puntuación Final: {score}</p>
                    <button onClick={() => startGame()} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-full text-lg">Jugar de Nuevo</button>
                  </>}
                  {gameState === 'gameOver' && <>
                    <XCircle className="text-red-500 mx-auto" size={80} />
                    <h2 className="text-4xl font-bold">Game Over</h2>
                    <p className="text-xl text-pink-200">¡Sigue intentándolo!</p>
                    <p className="text-lg text-white">Puntuación: {score}</p>
                    <div className="flex gap-4">
                      <button onClick={() => startGame(currentLevel)} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-full">Reintentar</button>
                      <button onClick={() => startGame()} className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-full">Menú Principal</button>
                    </div>
                  </>}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
    );
};

export default ArmaTuMenteBrainPuzzle;