import React, { useState, useEffect } from "react";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import "@leenguyen/react-flip-clock-countdown/dist/index.css";

// CSS FILE LINK
import "./CountDown.css";

function CountDown() {
  const [endTime, setEndTime] = useState(null);
  const [countdownComplete, setCountdownComplete] = useState(false);

  useEffect(() => {
    const storedEndTime = localStorage.getItem("endTime");
    if (storedEndTime) {
      setEndTime(parseInt(storedEndTime));
    } else {
      const targetDate = new Date(Date.UTC(2023, 1, 26, 4, 40, 5)); // YEAR: MONTH: DATE: HOUR: MINUTE: SECOND:
      const newEndTime = targetDate.getTime();
      setEndTime(newEndTime);
      localStorage.setItem("endTime", newEndTime.toString());
    }
  }, []);

  const handleComplete = () => {
    setCountdownComplete(true);
    localStorage.removeItem("endTime");
  };

  if (countdownComplete) {
    return null; // Return a message or component to replace the countdown after completion
  }

  return (
    <section className="countdown-container">
      <div className="clock_content">
        {endTime && (
          <>
            <h1 className="h1">Bid-Auction</h1>
            <div className="text__bg">
              <h3>Migration From V1 to V2 Start:.</h3>
            </div>
            {!countdownComplete && (
              <FlipClockCountdown
                className="flip-clock"
                to={endTime}
                labels={["DAYS", "HOURS", "MINUTES", "SECONDS"]}
                duration={0.5}
                onComplete={handleComplete}
              />
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default CountDown;

// import React, { useState, useEffect } from "react";
// import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
// import "@leenguyen/react-flip-clock-countdown/dist/index.css";

// // CSS FILE LINK
// import "./CountDown.css";

// function CountDown() {
//   const [endTime, setEndTime] = useState(null);
//   const [countdownComplete, setCountdownComplete] = useState(false);
//   const [readyToDisplay, setReadyToDisplay] = useState(true);

//   useEffect(() => {
//     const storedEndTime = localStorage.getItem("endTime");
//     if (storedEndTime) {
//       setEndTime(parseInt(storedEndTime));
//     } else {
//       const targetDate = new Date(Date.UTC(2023, 1, 22, 10, 50, 5)); // YEAR: MONTH: DATE: HOUR: MINUTE: SECOND:
//       const newEndTime = targetDate.getTime();
//       setEndTime(newEndTime);
//       localStorage.setItem("endTime", newEndTime.toString());
//     }
//   }, []);

//   useEffect(() => {
//     if (endTime && !countdownComplete) {
//       setReadyToDisplay(true);
//     }
//     if (countdownComplete) {
//       setReadyToDisplay(false);
//     }
//   }, [endTime, countdownComplete]);

//   const handleComplete = () => {
//     setCountdownComplete(true);
//     localStorage.removeItem("endTime");
//   };

//   if (!readyToDisplay) {
//     return null; // Return null until ready to display
//   }

//   if (countdownComplete) {
//     return <div>The countdown has completed!</div>; // Return a message or component to replace the countdown after completion
//   }

//   return (
//     <section className="countdown-container">
//       <div className="clock_content">
//         <h1>BidAuction</h1>
//         <h3>Migration From V1 to V2 Start:.</h3>
//         {endTime && (
//           <FlipClockCountdown
//             className="flip-clock"
//             to={endTime}
//             labels={["DAYS", "HOURS", "MINUTES", "SECONDS"]}
//             duration={0.5}
//             onComplete={handleComplete}
//           />
//         )}
//       </div>
//     </section>
//   );
// }

// export default CountDown;
