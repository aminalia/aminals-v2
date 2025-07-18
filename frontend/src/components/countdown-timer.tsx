import { useEffect, useState } from 'react';

interface CountdownTimerProps {
  endTime: number; // Unix timestamp in seconds
  onTimeUp?: () => void;
}

export default function CountdownTimer({
  endTime,
  onTimeUp,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = Math.floor(Date.now() / 1000); // Current time in seconds
      const difference = endTime - now;

      if (difference <= 0) {
        setTimeLeft(0);
        if (!isExpired) {
          setIsExpired(true);
          onTimeUp?.();
        }
        return 0;
      }

      setTimeLeft(difference);
      return difference;
    };

    // Calculate initial time
    calculateTimeLeft();

    // Set up interval to update every second
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endTime, isExpired, onTimeUp]);

  const formatTime = (seconds: number) => {
    if (seconds <= 0) return 'Auction Ended';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="text-xl">⏰</div>
      <div className="flex flex-col">
        <div className="text-sm text-gray-500">
          {isExpired ? 'Auction Status' : 'Time Remaining'}
        </div>
        <div
          className={`font-medium ${
            isExpired ? 'text-red-600' : 'text-gray-900'
          }`}
        >
          {formatTime(timeLeft)}
        </div>
      </div>
    </div>
  );
}
