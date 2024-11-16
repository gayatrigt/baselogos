import classNames from 'classnames';
import React, { useEffect,useState } from 'react';

const BaseLogoPreview: React.FC<{className?: string}> = ({className}) => {
  const [color, setColor] = useState('#ff0000');

  // Generate a random color in hex format
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let newColor = '#';
    for (let i = 0; i < 6; i++) {
      newColor += letters[Math.floor(Math.random() * 16)];
    }
    return newColor;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setColor(getRandomColor());
    }, 500); // Change color every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={classNames(
      "flex items-center justify-center min-h-[200px] relative rounded-lg shadow-lg overflow-hidden",
      className
    )}>
      <div 
        className="w-full aspect-square transition-colors duration-1000 ease-in-out"
        style={{ backgroundColor: color }}
      />
      <img className='h-full w-full absolute top-0 left-0 scale-150' src="/base-overlay.png" alt="" />
    </div>
  );
};

export default BaseLogoPreview;