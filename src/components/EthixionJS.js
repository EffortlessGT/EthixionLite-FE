import React, { useEffect, useState } from 'react';

// ✅ move outside (stable reference)
const logs = [
  '[✔] Application request captured',
  '[✔] Header signature validated',
  '[✔] Token authentication passed',
  '[✔] Payload integrity confirmed',
  '[✔] Rate-limiting check clear',
  '[✔] Anomaly scan: CLEAN',
  '[✔] Policy checks passed',
];

function EthixionJS() {
  const [displayedLogs, setDisplayedLogs] = useState([]);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    let i = 0;

    const interval = setInterval(() => {
      if (i < logs.length) {
        setDisplayedLogs((prev) => [...prev, logs[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 1200);

    const verifyTimeout = setTimeout(() => {
      setVerified(true);
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(verifyTimeout);
    };
  }, []); // ✅ no dependency needed

  return (
    <div>
      <div
        id="logBox"
        style={{
          fontSize: '0.9em',
          maxHeight: '160px',
          overflowY: 'auto',
          border: '1px solid #ccc',
          borderRadius: '10px',
          padding: '15px',
          backgroundColor: '#fff',
        }}
      >
        {displayedLogs.map((log, index) => (
          <div
            key={index}
            style={{
              opacity: 1,
              padding: '4px 0',
              animation: 'fadeIn 0.6s ease forwards',
            }}
          >
            {log}
          </div>
        ))}
      </div>

      {verified && (
        <div
          style={{
            marginTop: '20px',
            fontSize: '1.3em',
            color: '#2e7d32',
            animation: 'bounce 1s ease infinite alternate',
          }}
        >
          Request Verified. Redirecting...
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          to { opacity: 1; }
        }
        @keyframes bounce {
          from { transform: scale(1); }
          to { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}

export default EthixionJS;
