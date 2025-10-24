import React from 'react';

export default function Slider({ index=0, children }) {
  const count = React.Children.count(children);
  return (
    <div className="relative overflow-hidden">
      <div
        className="flex transition-transform duration-300"
        style={{ width: `${count*100}%`, transform: `translateX(-${index * (100/count)}%)` }}
      >
        {React.Children.map(children, (child, i) => (
          <div className="w-full shrink-0 px-0">{child}</div>
        ))}
      </div>
    </div>
  );
}
