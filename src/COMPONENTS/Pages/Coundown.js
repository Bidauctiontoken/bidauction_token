import { useEffect, useState } from "react";
import "./Countdown.css";

function Countdown() {
  const [countdown, setCountdown] = useState(true);

  const calculateTimeLeft = () => {
    const difference = +new Date("2023-02-16T05:00:00.000Z") - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      setCountdown(false);
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  const { hours, minutes, seconds } = timeLeft;

  return (
    <>
      {countdown && (
        <div className="countdown-container">
          <p className="countdown-text">Migration period Start in</p>
          <div className="countdown">
            <span>{hours}</span>
            <span>{minutes}</span>
            <span>{seconds}</span>
          </div>
        </div>
      )}
    </>
  );
}

export default Countdown;
