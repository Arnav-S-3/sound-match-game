# 🔊 Sound Match! - Accessible Audio Memory Game

An inclusive, audio-first memory game designed specifically for children with visual impairments, but enjoyable for all players.

## 🎯 Game Overview

Sound Match is a 3x2 grid memory game where players find matching pairs of sounds using only audio cues and keyboard navigation. The game emphasizes accessibility, inclusion, and fun gameplay without requiring any visual elements.

## 🎮 How to Play

1. **Navigate**: Use arrow keys to move between tiles (1-6)
2. **Select**: Press Enter or Space to select a tile and hear its sound
3. **Match**: Find pairs of matching sounds by remembering their positions
4. **Win**: Match all 3 pairs to complete the game!

## ♿ Accessibility Features

- **Full keyboard navigation** - No mouse required
- **Screen reader compatible** - Proper ARIA labels and semantic HTML
- **Audio-first design** - Game is fully playable without visuals
- **Speech synthesis** - Announces game state and tile positions
- **High contrast visuals** - Optional visual indicators for low vision users
- **Cognitive accessibility** - Simple interactions with clear audio feedback

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Modern web browser with Web Audio API support

### Installation
\`\`\`bash
# Clone the repository
git clone https://github.com/yourusername/sound-match-game.git

# Navigate to project directory
cd sound-match-game

# Install dependencies
npm install

# Start development server
npm run dev
\`\`\`

### Deployment
This project is optimized for deployment on Vercel:

\`\`\`bash
# Deploy to Vercel
npx vercel --prod
\`\`\`

## 🎵 Technical Implementation

- **Framework**: Next.js 14 with React 18
- **Audio**: Web Audio API for sound generation
- **Speech**: Web Speech API for announcements
- **Styling**: Tailwind CSS with shadcn/ui components
- **Accessibility**: WCAG 2.1 AA compliant

## 🎯 Target Audience

**Primary**: Children with visual impairments (ages 6-12)
**Secondary**: All children and adults who enjoy audio-based games

## 🏆 Design Philosophy

1. **Audio-First**: Every interaction provides audio feedback
2. **Inclusive by Design**: Built for accessibility from the ground up
3. **Cognitive Simplicity**: Easy to learn, engaging to master
4. **Universal Appeal**: Fun for everyone, not just the target audience

## 🎮 Controls

| Key | Action |
|-----|--------|
| Arrow Keys | Navigate between tiles |
| Enter/Space | Select tile and play sound |
| H | Help and instructions |
| R | Restart game |

## 🔧 Browser Compatibility

- Chrome 66+
- Firefox 60+
- Safari 12+
- Edge 79+

## 📱 Future Enhancements

- Multiple difficulty levels
- Real sound effects (animals, instruments)
- Multiplayer mode
- Progress tracking
- Custom sound packs

## 🤝 Contributing

This project was created for a hackathon focused on accessibility and inclusion. Contributions that improve accessibility are especially welcome!

## 📄 License

MIT License - See LICENSE file for details

---

**Built with ❤️ for accessibility and inclusion**
