import React from 'react';
import emojiData from 'emoji-datasource-apple';
import Image from 'next/image';

function App() {
  // Filter emojis by category (e.g., 'Smileys & Emotion')
  const filteredEmojis = emojiData.filter(emoji => emoji.category === 'Smileys & Emotion');
  const sortedData = filteredEmojis.slice().sort((a, b) => a.sort_order - b.sort_order);

  // Get the local path to the emoji image
  const getEmojiImageUrl = (emoji: { image: string }) => {
    return `/assets/img/apple/64/${emoji.image}`;
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Emoji List: Smileys & Emotion</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {sortedData.map((emoji: { unified: string; short_name: string; image: string }) => (
          <div key={emoji.unified} style={{ textAlign: 'center' }}>
            <Image
              src={getEmojiImageUrl(emoji)}
              alt={emoji.short_name}
              width="32"
              height="32"
            />
            {/* <p style={{ fontSize: '12px', margin: '5px 0 0' }}>{emoji.short_name}</p> */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
