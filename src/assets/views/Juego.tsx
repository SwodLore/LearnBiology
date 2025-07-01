// src/assets/views/Juego.tsx

import { useState, useEffect, useRef } from 'react';
import { PLAYER_VIRUS_IMG, PROJECTILE_VIRUS_IMG, ENEMY_RBC_IMG } from './images';
import fondo2 from '../fondos/juego/fondo2.png'
import fondo3 from '../fondos/juego/fondo3.png'

// --- FONDOS DE JUEGO INTERCAMBIABLES ---
const backgrounds = [
    "https://www.shutterstock.com/image-vector/white-blood-cell-bacteria-character-600nw-1678624840.jpg",
    fondo2,
    fondo3,
    "https://www.transparenttextures.com/patterns/dark-matter.png",
];

// --- CONFIGURACIÓN DEL JUEGO ---
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const PLAYER_WIDTH = 72;
const PLAYER_HEIGHT = 72;
const PLAYER_SPEED = 5;
const PROJECTILE_WIDTH = 8;
const PROJECTILE_HEIGHT = 8;
const PROJECTILE_SPEED = 7;
const ENEMY_WIDTH = 48;
const ENEMY_HEIGHT = 48;
const ENEMY_SPEED = 2;
const PROJECTILE_COOLDOWN = 300;

// --- CONFIGURACIÓN DE DIFICULTAD AVANZADA ---
const DIFFICULTY_PARAMS = {
  INITIAL_SPAWN_RATE: 900,
  MIN_SPAWN_RATE: 250,
  SPAWN_RATE_DECREMENT_PER_LEVEL: 50,
  LEVELS: [
    { scoreThreshold: 0,    waveType: 'single' },
    { scoreThreshold: 200,  waveType: 'double' },
    { scoreThreshold: 500,  waveType: 'line' },
    { scoreThreshold: 1000, waveType: 'v_formation' }
  ]
} as const;

// --- Tipos para TypeScript ---
type Position = { x: number; y: number };
type GameObject = { id: number } & Position;
type WaveType = typeof DIFFICULTY_PARAMS.LEVELS[number]['waveType'];

// --- Componentes Visuales ---
const Player = ({ position }: { position: Position }) => (<img src={PLAYER_VIRUS_IMG} alt="Player" className="pixelated absolute" style={{ left: position.x, top: position.y, width: PLAYER_WIDTH, height: PLAYER_HEIGHT }} />);
const Enemy = ({ position }: { position: Position }) => (<img src={ENEMY_RBC_IMG} alt="Enemy" className="pixelated absolute" style={{ left: position.x, top: position.y, width: ENEMY_WIDTH, height: ENEMY_HEIGHT }} />);
const Projectile = ({ position }: { position: Position }) => (<img src={PROJECTILE_VIRUS_IMG} alt="Projectile" className="pixelated absolute" style={{ left: position.x, top: position.y, width: PROJECTILE_WIDTH, height: PROJECTILE_HEIGHT }} />);

// --- Componente Principal del Juego ---
function Juego() {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameOver'>('start');
  const [score, setScore] = useState(0);
  const [playerPosition, setPlayerPosition] = useState<Position>({ x: GAME_WIDTH / 2 - PLAYER_WIDTH / 2, y: GAME_HEIGHT - PLAYER_HEIGHT - 20 });
  const [projectiles, setProjectiles] = useState<GameObject[]>([]);
  const [enemies, setEnemies] = useState<GameObject[]>([]);
  const [backgroundIndex, setBackgroundIndex] = useState(0);
  
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const lastShotTime = useRef(0);
  const lastSpawnTime = useRef(0);
  // --- CORRECCIÓN DEL ERROR DE TYPESCRIPT ---
  const currentSpawnRate = useRef<number>(DIFFICULTY_PARAMS.INITIAL_SPAWN_RATE);
  const gameLoopRef = useRef<number | null>(null);

  const resetGame = () => {
    setScore(0);
    setPlayerPosition({ x: GAME_WIDTH / 2 - PLAYER_WIDTH / 2, y: GAME_HEIGHT - PLAYER_HEIGHT - 20 });
    setProjectiles([]);
    setEnemies([]);
    keysPressed.current = {};
    currentSpawnRate.current = DIFFICULTY_PARAMS.INITIAL_SPAWN_RATE;
    setGameState('playing');
  };
  
  const changeBackground = () => {
    setBackgroundIndex(prev => (prev + 1) % backgrounds.length);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { keysPressed.current[e.key] = true; };
    const handleKeyUp = (e: KeyboardEvent) => { delete keysPressed.current[e.key]; };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  
  const spawnWave = (waveType: WaveType) => {
      let newEnemies: GameObject[] = [];
      const now = Date.now();
      switch (waveType) {
          case 'single': newEnemies.push({ id: now, x: Math.random() * (GAME_WIDTH - ENEMY_WIDTH), y: -ENEMY_HEIGHT }); break;
          case 'double':
              const x1 = Math.random() * (GAME_WIDTH / 2 - ENEMY_WIDTH);
              const x2 = GAME_WIDTH / 2 + Math.random() * (GAME_WIDTH / 2 - ENEMY_WIDTH);
              newEnemies.push({ id: now, x: x1, y: -ENEMY_HEIGHT }, { id: now + 1, x: x2, y: -ENEMY_HEIGHT });
              break;
          case 'line':
              const startX = Math.random() * (GAME_WIDTH - (ENEMY_WIDTH * 3 + 40));
              for(let i=0; i<3; i++) { newEnemies.push({ id: now + i, x: startX + i * (ENEMY_WIDTH + 20), y: -ENEMY_HEIGHT }); }
              break;
          case 'v_formation':
              const centerX = GAME_WIDTH / 2;
              newEnemies.push({ id: now, x: centerX - ENEMY_WIDTH / 2, y: -ENEMY_HEIGHT - 40 });
              newEnemies.push({ id: now + 1, x: centerX - 60, y: -ENEMY_HEIGHT });
              newEnemies.push({ id: now + 2, x: centerX + 60 - ENEMY_WIDTH, y: -ENEMY_HEIGHT });
              break;
      }
      setEnemies(prev => [...prev, ...newEnemies]);
  };

  useEffect(() => {
    if (gameState !== 'playing') {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      return;
    }
    
    const gameLoop = (timestamp: number) => {
      setPlayerPosition(prevPos => {
        let newX = prevPos.x;
        if (keysPressed.current['ArrowLeft'] && newX > 0) newX -= PLAYER_SPEED;
        if (keysPressed.current['ArrowRight'] && newX < GAME_WIDTH - PLAYER_WIDTH) newX += PLAYER_SPEED;
        if (keysPressed.current[' '] && timestamp - lastShotTime.current > PROJECTILE_COOLDOWN) {
          lastShotTime.current = timestamp;
          setProjectiles(prev => [...prev, { id: timestamp, x: prevPos.x + PLAYER_WIDTH / 2 - PROJECTILE_WIDTH / 2, y: prevPos.y }]);
        }
        return { ...prevPos, x: newX };
      });

      if (timestamp - lastSpawnTime.current > currentSpawnRate.current) {
        lastSpawnTime.current = timestamp;
        const currentDifficulty = [...DIFFICULTY_PARAMS.LEVELS].reverse().find(l => score >= l.scoreThreshold) || DIFFICULTY_PARAMS.LEVELS[0];
        spawnWave(currentDifficulty.waveType);
      }
      
      setProjectiles(prev => prev.map(p => ({ ...p, y: p.y - PROJECTILE_SPEED })));
      setEnemies(prevEnemies => {
        let remainingEnemies = prevEnemies.map(e => ({ ...e, y: e.y + ENEMY_SPEED }));
        let remainingProjectiles = [...projectiles];
        const enemiesToRemove = new Set<number>();
        const projectilesToRemove = new Set<number>();
        let scoreToAdd = 0;

        for (const p of remainingProjectiles) {
          for (const e of remainingEnemies) {
            if (p.x < e.x + ENEMY_WIDTH && p.x + PROJECTILE_WIDTH > e.x && p.y < e.y + ENEMY_HEIGHT && p.y + PROJECTILE_HEIGHT > e.y) {
              enemiesToRemove.add(e.id);
              projectilesToRemove.add(p.id);
              scoreToAdd += 10;
            }
          }
        }
        
        if (scoreToAdd > 0) {
          const newScore = score + scoreToAdd;
          setScore(newScore);
          const difficultyLevel = DIFFICULTY_PARAMS.LEVELS.filter(l => newScore >= l.scoreThreshold).length -1;
          currentSpawnRate.current = Math.max(DIFFICULTY_PARAMS.MIN_SPAWN_RATE, DIFFICULTY_PARAMS.INITIAL_SPAWN_RATE - (difficultyLevel * DIFFICULTY_PARAMS.SPAWN_RATE_DECREMENT_PER_LEVEL));
        }

        setProjectiles(prev => prev.filter(p => !projectilesToRemove.has(p.id)));
        remainingEnemies = remainingEnemies.filter(e => !enemiesToRemove.has(e.id) && e.y < GAME_HEIGHT);

        for (const enemy of remainingEnemies) {
          if (playerPosition.x < enemy.x + ENEMY_WIDTH && playerPosition.x + PLAYER_WIDTH > enemy.x && playerPosition.y < enemy.y + ENEMY_HEIGHT && playerPosition.y + PLAYER_HEIGHT > enemy.y) {
            setGameState('gameOver');
          }
        }
        return remainingEnemies;
      });
      
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => { if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current); };
  }, [gameState, score, playerPosition, projectiles]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white font-mono">
      <h1 className="text-4xl mb-4 font-bold">Virus Invader</h1>
      <div
        className="relative bg-gray-900 overflow-hidden border-4 border-green-500"
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT, backgroundImage: `url(${backgrounds[backgroundIndex]})`, backgroundRepeat: 'repeat' }}
      >
        {gameState !== 'start' && (
          <>
            <Player position={playerPosition} />
            {enemies.map(enemy => <Enemy key={enemy.id} position={enemy} />)}
            {projectiles.map(proj => <Projectile key={proj.id} position={proj} />)}
          </>
        )}
        {gameState === 'start' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70">
            <h2 className="text-5xl text-green-400 mb-8">¡Listo para Infectar!</h2>
            <button onClick={resetGame} className="px-8 py-4 bg-green-500 text-black font-bold text-2xl rounded-lg hover:bg-green-400">Iniciar Juego</button>
            <p className="mt-8 text-lg">Usa [←] [→] para moverte y [Espacio] para disparar.</p>
          </div>
        )}
        {gameState === 'gameOver' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70">
            <h2 className="text-6xl text-red-500 mb-4">GAME OVER</h2>
            <p className="text-3xl mb-8">Puntuación Final: {score}</p>
            <button onClick={resetGame} className="px-8 py-4 bg-green-500 text-black font-bold text-2xl rounded-lg hover:bg-green-400">Jugar de Nuevo</button>
          </div>
        )}
      </div>
      <div className="w-full mt-4 text-xl flex justify-between items-center" style={{maxWidth: GAME_WIDTH}}>
        <span>Puntuación: {score}</span>
        <button onClick={changeBackground} className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500">
            Cambiar Fondo
        </button>
        <span>Spawn Rate: {currentSpawnRate.current.toFixed(0)}ms</span>
      </div>
    </div>
  );
}

export default Juego;