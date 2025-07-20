"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"

interface Tile {
  id: number
  soundId: number
  isRevealed: boolean
  isMatched: boolean
}

interface GameState {
  tiles: Tile[]
  selectedTiles: number[]
  score: number
  matches: number
  currentFocus: number
  gameComplete: boolean
}

export default function SoundMatchGame() {
  const [gameState, setGameState] = useState<GameState>({
    tiles: [],
    selectedTiles: [],
    score: 0,
    matches: 0,
    currentFocus: 0,
    gameComplete: false,
  })

  const audioContextRef = useRef<AudioContext | null>(null)
  const tileRefs = useRef<(HTMLButtonElement | null)[]>([])
  const speechSynthRef = useRef<SpeechSynthesis | null>(null)

  // Initialize audio context and speech synthesis
  useEffect(() => {
    if (typeof window !== "undefined") {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      speechSynthRef.current = window.speechSynthesis
    }
  }, [])

  // Initialize game
  const initializeGame = useCallback(() => {
    // Create 3 pairs of sounds (6 tiles total)
    const soundPairs = [1, 1, 2, 2, 3, 3]
    const shuffledSounds = soundPairs.sort(() => Math.random() - 0.5)

    const newTiles: Tile[] = shuffledSounds.map((soundId, index) => ({
      id: index,
      soundId,
      isRevealed: false,
      isMatched: false,
    }))

    setGameState({
      tiles: newTiles,
      selectedTiles: [],
      score: 0,
      matches: 0,
      currentFocus: 0,
      gameComplete: false,
    })

    // Announce game start
    speak(
      "Sound Match game started! Use arrow keys to navigate and Enter or Space to select tiles. Find matching pairs of sounds!",
    )
  }, [])

  // Speech synthesis helper
  const speak = useCallback((text: string) => {
    if (speechSynthRef.current) {
      speechSynthRef.current.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1.1
      speechSynthRef.current.speak(utterance)
    }
  }, [])

  // Play sound for a tile
  const playTileSound = useCallback((soundId: number) => {
    if (!audioContextRef.current) return

    const ctx = audioContextRef.current

    switch (soundId) {
      case 1: // Dog bark
        {
          const oscillator1 = ctx.createOscillator()
          const oscillator2 = ctx.createOscillator()
          const gainNode = ctx.createGain()

          oscillator1.connect(gainNode)
          oscillator2.connect(gainNode)
          gainNode.connect(ctx.destination)

          // Create bark-like sound with two oscillators
          oscillator1.frequency.setValueAtTime(200, ctx.currentTime)
          oscillator1.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.1)
          oscillator2.frequency.setValueAtTime(400, ctx.currentTime)
          oscillator2.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1)

          oscillator1.type = "sawtooth"
          oscillator2.type = "square"

          gainNode.gain.setValueAtTime(0.4, ctx.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2)

          oscillator1.start(ctx.currentTime)
          oscillator1.stop(ctx.currentTime + 0.2)
          oscillator2.start(ctx.currentTime)
          oscillator2.stop(ctx.currentTime + 0.2)
        }
        break

      case 2: // Cat meow
        {
          const oscillator = ctx.createOscillator()
          const gainNode = ctx.createGain()

          oscillator.connect(gainNode)
          gainNode.connect(ctx.destination)

          // Create meow-like sound with frequency modulation
          oscillator.frequency.setValueAtTime(300, ctx.currentTime)
          oscillator.frequency.linearRampToValueAtTime(500, ctx.currentTime + 0.1)
          oscillator.frequency.linearRampToValueAtTime(400, ctx.currentTime + 0.3)
          oscillator.frequency.linearRampToValueAtTime(250, ctx.currentTime + 0.5)

          oscillator.type = "triangle"

          gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
          gainNode.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.1)
          gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6)

          oscillator.start(ctx.currentTime)
          oscillator.stop(ctx.currentTime + 0.6)
        }
        break

      case 3: // Bird chirp
        {
          const oscillator = ctx.createOscillator()
          const gainNode = ctx.createGain()

          oscillator.connect(gainNode)
          gainNode.connect(ctx.destination)

          // Create chirp-like sound with rapid frequency changes
          oscillator.frequency.setValueAtTime(800, ctx.currentTime)
          oscillator.frequency.linearRampToValueAtTime(1200, ctx.currentTime + 0.05)
          oscillator.frequency.linearRampToValueAtTime(900, ctx.currentTime + 0.1)
          oscillator.frequency.linearRampToValueAtTime(1100, ctx.currentTime + 0.15)
          oscillator.frequency.linearRampToValueAtTime(800, ctx.currentTime + 0.2)

          oscillator.type = "sine"

          gainNode.gain.setValueAtTime(0.25, ctx.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25)

          oscillator.start(ctx.currentTime)
          oscillator.stop(ctx.currentTime + 0.25)
        }
        break
    }
  }, [])

  // Play feedback sounds
  const playFeedbackSound = useCallback((isCorrect: boolean) => {
    if (!audioContextRef.current) return

    const ctx = audioContextRef.current
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    if (isCorrect) {
      // Happy ascending chord
      oscillator.frequency.setValueAtTime(523, ctx.currentTime) // C
      oscillator.frequency.setValueAtTime(659, ctx.currentTime + 0.1) // E
      oscillator.frequency.setValueAtTime(784, ctx.currentTime + 0.2) // G
    } else {
      // Gentle "try again" tone
      oscillator.frequency.setValueAtTime(330, ctx.currentTime) // E
      oscillator.frequency.setValueAtTime(294, ctx.currentTime + 0.2) // D
    }

    oscillator.type = "sine"
    gainNode.gain.setValueAtTime(0.2, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.4)
  }, [])

  // Handle tile selection
  const selectTile = useCallback(
    (tileIndex: number) => {
      const tile = gameState.tiles[tileIndex]
      if (tile.isMatched || gameState.selectedTiles.includes(tileIndex)) return

      // Play the tile's sound
      playTileSound(tile.soundId)

      // Announce tile position and sound after a brief delay
      const row = Math.floor(tileIndex / 3) + 1
      const col = (tileIndex % 3) + 1

      setTimeout(() => {
        speak(`Tile at row ${row}, column ${col}`)
      }, 800)

      setGameState((prev) => {
        const newSelectedTiles = [...prev.selectedTiles, tileIndex]
        const newTiles = prev.tiles.map((t, i) => (i === tileIndex ? { ...t, isRevealed: true } : t))

        // Check for match when two tiles are selected
        if (newSelectedTiles.length === 2) {
          const [first, second] = newSelectedTiles
          const firstTile = newTiles[first]
          const secondTile = newTiles[second]

          setTimeout(() => {
            if (firstTile.soundId === secondTile.soundId) {
              // Match found!
              playFeedbackSound(true)
              const animalNames = {
                1: "dogs",
                2: "cats",
                3: "birds",
              }
              const animalName = animalNames[firstTile.soundId as keyof typeof animalNames]
              speak(`Correct! You found the matching ${animalName}!`)

              setGameState((prevState) => {
                const updatedTiles = prevState.tiles.map((t, i) =>
                  i === first || i === second ? { ...t, isMatched: true } : t,
                )
                const newMatches = prevState.matches + 1
                const newScore = prevState.score + 10
                const gameComplete = newMatches === 3

                if (gameComplete) {
                  setTimeout(() => {
                    speak(`Congratulations! You completed the game with a score of ${newScore}! Press R to play again.`)
                  }, 1000)
                }

                return {
                  ...prevState,
                  tiles: updatedTiles,
                  selectedTiles: [],
                  score: newScore,
                  matches: newMatches,
                  gameComplete,
                }
              })
            } else {
              // No match
              playFeedbackSound(false)
              speak("Try again! Those sounds don't match.")

              setGameState((prevState) => ({
                ...prevState,
                tiles: prevState.tiles.map((t, i) => (i === first || i === second ? { ...t, isRevealed: false } : t)),
                selectedTiles: [],
              }))
            }
          }, 1000)
        }

        return {
          ...prev,
          tiles: newTiles,
          selectedTiles: newSelectedTiles,
        }
      })
    },
    [gameState.tiles, gameState.selectedTiles, playTileSound, playFeedbackSound, speak],
  )

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key } = event

      if (key === "r" || key === "R") {
        initializeGame()
        return
      }

      if (gameState.gameComplete) return

      switch (key) {
        case "ArrowUp":
          event.preventDefault()
          setGameState((prev) => ({
            ...prev,
            currentFocus: Math.max(0, prev.currentFocus - 3),
          }))
          break
        case "ArrowDown":
          event.preventDefault()
          setGameState((prev) => ({
            ...prev,
            currentFocus: Math.min(5, prev.currentFocus + 3),
          }))
          break
        case "ArrowLeft":
          event.preventDefault()
          setGameState((prev) => ({
            ...prev,
            currentFocus: Math.max(0, prev.currentFocus - 1),
          }))
          break
        case "ArrowRight":
          event.preventDefault()
          setGameState((prev) => ({
            ...prev,
            currentFocus: Math.min(5, prev.currentFocus + 1),
          }))
          break
        case "Enter":
        case " ":
          event.preventDefault()
          selectTile(gameState.currentFocus)
          break
        case "h":
        case "H":
          event.preventDefault()
          speak(
            "Sound Match Game. Use arrow keys to navigate between tiles. Press Enter or Space to select a tile and hear its sound. Find matching pairs! Press R to restart.",
          )
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [gameState.currentFocus, gameState.gameComplete, selectTile, initializeGame, speak])

  // Focus management
  useEffect(() => {
    if (tileRefs.current[gameState.currentFocus]) {
      tileRefs.current[gameState.currentFocus]?.focus()
    }
  }, [gameState.currentFocus])

  // Initialize game on mount
  useEffect(() => {
    initializeGame()
  }, [initializeGame])

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 flex flex-col items-center justify-center">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">🔊 Sound Match!</h1>
        <p className="text-lg mb-2">Audio Memory Game</p>
        <div className="text-sm text-gray-300 space-y-1">
          <p>
            Score: {gameState.score} | Matches: {gameState.matches}/3
          </p>
          <p>Use arrow keys to navigate, Enter/Space to select</p>
          <p>Press H for help, R to restart</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8" role="grid" aria-label="Sound matching game board">
        {gameState.tiles.map((tile, index) => {
          const row = Math.floor(index / 3) + 1
          const col = (index % 3) + 1
          const isFocused = gameState.currentFocus === index
          const isSelected = gameState.selectedTiles.includes(index)

          return (
            <Button
              key={tile.id}
              ref={(el) => (tileRefs.current[index] = el)}
              className={`
                w-20 h-20 text-lg font-bold transition-all duration-200
                ${isFocused ? "ring-4 ring-yellow-400 bg-blue-600" : "bg-gray-700"}
                ${tile.isMatched ? "bg-green-600" : ""}
                ${isSelected ? "bg-blue-500" : ""}
                hover:bg-gray-600 focus:outline-none
              `}
              onClick={() => selectTile(index)}
              aria-label={`Tile at row ${row}, column ${col}. ${
                tile.isMatched ? "Matched" : isSelected ? "Selected" : "Available"
              }`}
              aria-pressed={isSelected}
              disabled={tile.isMatched}
            >
              {tile.isMatched ? "✓" : isSelected ? "♪" : index + 1}
            </Button>
          )
        })}
      </div>

      {gameState.gameComplete && (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-green-400 mb-2">🎉 Congratulations!</h2>
          <p className="text-lg mb-4">You completed the game with a score of {gameState.score}!</p>
          <Button onClick={initializeGame} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2">
            Play Again (R)
          </Button>
        </div>
      )}

      <div className="mt-8 text-center text-sm text-gray-400 max-w-md">
        <p className="mb-2">
          <strong>Accessibility Features:</strong>
        </p>
        <ul className="text-left space-y-1">
          <li>• Full keyboard navigation</li>
          <li>• Screen reader compatible</li>
          <li>• Audio-first gameplay</li>
          <li>• High contrast visual indicators</li>
          <li>• Speech synthesis announcements</li>
        </ul>
      </div>
    </div>
  )
}
