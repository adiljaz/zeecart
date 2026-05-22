import React, { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';

const FlashSaleTimer = ({ hours = 24 }) => {
  const [timeLeft, setTimeLeft] = useState(hours * 3600);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const h = Math.floor(timeLeft / 3600);
  const m = Math.floor((timeLeft % 3600) / 60);
  const s = timeLeft % 60;

  const format = (num) => num.toString().padStart(2, '0');

  return (
    <div className="flex items-center gap-2 bg-terracotta text-white px-4 py-2 rounded-sm shadow-lg">
      <Timer size={14} className="animate-pulse" />
      <span className="text-[10px] font-black uppercase tracking-widest mr-2">Sale Ends In</span>
      <div className="flex gap-1 font-mono text-sm font-bold">
        <span className="bg-white/10 px-1 rounded">{format(h)}</span>
        <span>:</span>
        <span className="bg-white/10 px-1 rounded">{format(m)}</span>
        <span>:</span>
        <span className="bg-white/10 px-1 rounded">{format(s)}</span>
      </div>
    </div>
  );
};

export default FlashSaleTimer;
