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

    // Delayed announcement of game start
    setTimeout(() => {
      speak(
        "Sound Match game started! Use arrow keys to navigate and Enter or Space to select tiles. Find matching pairs of sounds!",
      )
    }, 500)
  }, [])

  // Enhanced speech synthesis helper with female voice
  const speak = useCallback((text: string, delay = 0) => {
    setTimeout(() => {
      if (speechSynthRef.current) {
        speechSynthRef.current.cancel()
        const utterance = new SpeechSynthesisUtterance(text)

        // Try to get a female voice
        const voices = speechSynthRef.current.getVoices()
        const femaleVoice = voices.find(
          (voice) =>
            voice.name.toLowerCase().includes("female") ||
            voice.name.toLowerCase().includes("woman") ||
            voice.name.toLowerCase().includes("samantha") ||
            voice.name.toLowerCase().includes("karen") ||
            voice.name.toLowerCase().includes("susan") ||
            voice.gender === "female",
        )

        if (femaleVoice) {
          utterance.voice = femaleVoice
        }

        // Adjust voice parameters for more feminine sound
        utterance.pitch = 1.3 // Higher pitch for female voice
        utterance.rate = 0.85 // Slightly slower for clarity
        utterance.volume = 0.8

        speechSynthRef.current.speak(utterance)
      }
    }, delay)
  }, [])

  // Play position tone for a tile
  const playPositionTone = useCallback((tileIndex: number) => {
    if (!audioContextRef.current) return

    const ctx = audioContextRef.current
    const row = Math.floor(tileIndex / 3) + 1
    const col = (tileIndex % 3) + 1

    // Play row tone first
    const rowOscillator = ctx.createOscillator()
    const rowGain = ctx.createGain()

    rowOscillator.connect(rowGain)
    rowGain.connect(ctx.destination)

    // Different frequencies for different rows (lower = top row)
    const rowFrequencies = { 1: 220, 2: 330 } // A3, E4
    rowOscillator.frequency.setValueAtTime(rowFrequencies[row as keyof typeof rowFrequencies], ctx.currentTime)
    rowOscillator.type = "sine"

    rowGain.gain.setValueAtTime(0.15, ctx.currentTime)
    rowGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2)

    rowOscillator.start(ctx.currentTime)
    rowOscillator.stop(ctx.currentTime + 0.2)

    // Play column tone after a brief pause
    setTimeout(() => {
      const colOscillator = ctx.createOscillator()
      const colGain = ctx.createGain()

      colOscillator.connect(colGain)
      colGain.connect(ctx.destination)

      // Different frequencies for different columns (lower = left column)
      const colFrequencies = { 1: 440, 2: 554, 3: 659 } // A4, C#5, E5
      colOscillator.frequency.setValueAtTime(colFrequencies[col as keyof typeof colFrequencies], ctx.currentTime)
      colOscillator.type = "sine"

      colGain.gain.setValueAtTime(0.15, ctx.currentTime)
      colGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2)

      colOscillator.start(ctx.currentTime)
      colOscillator.stop(ctx.currentTime + 0.2)
    }, 250)
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

  // Enhanced feedback sounds with clear indicators
  const playFeedbackSound = useCallback((isCorrect: boolean) => {
    if (!audioContextRef.current) return

    const ctx = audioContextRef.current

    if (isCorrect) {
      // Clear success chime - ascending major chord
      const frequencies = [523.25, 659.25, 783.99] // C5, E5, G5

      frequencies.forEach((freq, index) => {
        setTimeout(() => {
          const oscillator = ctx.createOscillator()
          const gainNode = ctx.createGain()

          oscillator.connect(gainNode)
          gainNode.connect(ctx.destination)

          oscillator.frequency.setValueAtTime(freq, ctx.currentTime)
          oscillator.type = "sine"

          gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8)

          oscillator.start(ctx.currentTime)
          oscillator.stop(ctx.currentTime + 0.8)
        }, index * 100)
      })
    } else {
      // Clear "try again" sound - gentle descending tones
      const frequencies = [392, 349.23] // G4, F4

      frequencies.forEach((freq, index) => {
        setTimeout(() => {
          const oscillator = ctx.createOscillator()
          const gainNode = ctx.createGain()

          oscillator.connect(gainNode)
          gainNode.connect(ctx.destination)

          oscillator.frequency.setValueAtTime(freq, ctx.currentTime)
          oscillator.type = "sine"

          gainNode.gain.setValueAtTime(0.25, ctx.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6)

          oscillator.start(ctx.currentTime)
          oscillator.stop(ctx.currentTime + 0.6)
        }, index * 200)
      })
    }
  }, [])

  // Handle tile selection
  const selectTile = useCallback(
    (tileIndex: number) => {
      const tile = gameState.tiles[tileIndex]
      if (tile.isMatched || gameState.selectedTiles.includes(tileIndex)) return

      // Play the tile's sound
      playTileSound(tile.soundId)

      // Play position tone after a brief delay
      setTimeout(() => {
        playPositionTone(tileIndex)
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
              // Match found! - Delayed feedback
              setTimeout(() => {
                playFeedbackSound(true)
              }, 300)

              setTimeout(() => {
                speak("Excellent! You found a matching pair!", 0)
              }, 800)

              setGameState((prevState) => {
                const updatedTiles = prevState.tiles.map((t, i) =>
                  i === first || i === second ? { ...t, isMatched: true } : t,
                )
                const newMatches = prevState.matches + 1
                const newScore = prevState.score + 10
                const gameComplete = newMatches === 3

                if (gameComplete) {
                  setTimeout(() => {
                    speak(`Wonderful! You completed the game with a score of ${newScore}! Press R to play again.`, 1500)
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
              // No match - Delayed feedback
              setTimeout(() => {
                playFeedbackSound(false)
              }, 300)

              setTimeout(() => {
                speak("Not quite! Try again, you can do it!", 0)
              }, 900)

              setGameState((prevState) => ({
                ...prevState,
                tiles: prevState.tiles.map((t, i) => (i === first || i === second ? { ...t, isRevealed: false } : t)),
                selectedTiles: [],
              }))
            }
          }, 1200)
        }

        return {
          ...prev,
          tiles: newTiles,
          selectedTiles: newSelectedTiles,
        }
      })
    },
    [gameState.tiles, gameState.selectedTiles, playTileSound, playPositionTone, playFeedbackSound, speak],
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
          setTimeout(() => {
            speak(
              "Sound Match Game. Use arrow keys to navigate between tiles. Press Enter or Space to select a tile and hear its sound. Find matching pairs! Press R to restart.",
              0,
            )
          }, 200)
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
          <li>• Position indicated by musical tones</li>
          <li>• Clear audio feedback for matches</li>
        </ul>
      </div>
    </div>
  )
}
