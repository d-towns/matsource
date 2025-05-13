import React from 'react';
import './Ticker.css';
import { Separator } from '../ui/separator';

interface TickerProps {
  items: string[];
}

const Ticker: React.FC<TickerProps> = ({ items }) => {
  // Duplicate items to create a seamless scrolling effect
  const tickerItems = [...items, ...items];

  return (
    <div className="ticker-container">
      <div className="ticker-content">
        {tickerItems.map((item, index) => (
            <div key={index} className="flex items-center ">
          <span key={index} className="ticker-item">
            {item}
          </span>
          <Separator key={`${item}-${index}-separator`} orientation="vertical" className="h-4 hidden md:block" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ticker;
