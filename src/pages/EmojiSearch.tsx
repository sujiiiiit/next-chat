import React, { useState, useEffect } from 'react';
import lodash from 'lodash';
import rawEmojiData from '@/assets/regularEmoji.json';
import keywordData from '../assets/searchEmoji.json';

type Emoji = {
  u: string;
  n: string;
  c: number;
};

const emojiData: Emoji[] = rawEmojiData.map((emoji) => ({
  ...emoji,
  c: Number(emoji.c),
}));

const emojiDataMap = lodash.memoize((emojiData: Emoji[]) => {
  return emojiData.reduce(
    (map: { [key: string]: Emoji }, emoji: Emoji) => {
      map[emoji.u] = emoji;
      return map;
    },
    {}
  );
});

const SearchEmojis = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filteredEmojis, setFilteredEmojis] = useState<typeof emojiData>([]);

  useEffect(() => {
    if (searchKeyword.trim() === '') {
      setFilteredEmojis([]);
      return;
    }

    const keyword = searchKeyword.toLowerCase();
    const matchedEmojis = keywordData
      .filter((keywordEntry: { k: string }) => keywordEntry.k.toLowerCase().includes(keyword))
      .flatMap((entry: { e: string[] }) => entry.e)
      .map((unified: string) => emojiDataMap(emojiData)[unified])
      .filter(Boolean);

    setFilteredEmojis(matchedEmojis);
  }, [searchKeyword]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(event.target.value);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search for emojis..."
        value={searchKeyword}
        onChange={handleSearchChange}
        className="search-input"
      />
      <div className="emoji-container">
        {filteredEmojis.map((emoji: typeof emojiData[0], index: number) => (
          <div key={`${emoji.u}-${index}`} className="emoji">
            <img
              src={`/static/assets/img/apple/64/${emoji.u}.png`}
              alt={emoji.n}
              className="emoji-image"
              loading='lazy'
            />
            <div className="emoji-name">{emoji.n}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchEmojis;