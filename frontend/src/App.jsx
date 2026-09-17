// import React, { useState } from 'react';
// import axios from 'axios';

// function App() {
//   const [prompt, setPrompt] = useState('');
//   const [logs, setLogs] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   const runCommand = async (e) => {
//     e.preventDefault();
//     if (!prompt) return;

//     const newLog = { role: 'user', text: prompt };
//     setLogs((prev) => [...prev, newLog]);
//     setPrompt('');
//     setIsLoading(true);

//     try {
//       const response = await axios.post('http://localhost:5000/api/run-command', { prompt: newLog.text });
//       const { generated_command, execution_status, system_output } = response.data;
      
//       setLogs((prev) => [
//         ...prev,
//         { role: 'agent', text: `> Generated PowerShell: ${generated_command}` },
//         { role: 'system', text: system_output || `Status: ${execution_status}` }
//       ]);
//     } catch (error) {
//       setLogs((prev) => [...prev, { role: 'system', text: "Error connecting to Node.js backend!" }]);
//     }
//     setIsLoading(false);
//   };

//   return (
//     <div className="min-h-screen p-8 flex flex-col items-center font-mono">
//       <h1 className="text-3xl font-bold text-cyan-400 mb-2">AI SysAdmin Orchestrator</h1>
//       <p className="text-gray-400 mb-8">Multi-Agent System Control Panel</p>

//       <div className="w-full max-w-4xl bg-gray-900 border border-gray-700 rounded-lg shadow-2xl overflow-hidden flex flex-col">
//         <div className="h-96 p-4 overflow-y-auto bg-black text-sm space-y-3">
//           <div className="text-green-500">System initialized. Waiting for natural language commands...</div>
          
//           {logs.map((log, index) => (
//             <div key={index} className={
//               log.role === 'user' ? 'text-blue-400' :
//               log.role === 'agent' ? 'text-yellow-400' : 'text-gray-300 whitespace-pre-wrap'
//             }>
//               {log.role === 'user' ? `[User]: ${log.text}` : log.text}
//             </div>
//           ))}
//           {isLoading && <div className="text-cyan-500 animate-pulse">AI Agent is thinking and executing...</div>}
//         </div>

//         <form onSubmit={runCommand} className="flex border-t border-gray-700">
//           <input
//             type="text"
//             value={prompt}
//             onChange={(e) => setPrompt(e.target.value)}
//             placeholder="E.g., What is my IP address? or List running Python processes"
//             className="flex-1 bg-gray-800 text-white px-4 py-3 outline-none"
//             disabled={isLoading}
//           />
//           <button 
//             type="submit" 
//             className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 font-bold transition"
//             disabled={isLoading}
//           >
//             EXECUTE
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default App;





import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [prompt, setPrompt] = useState('');
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const logsEndRef = useRef(null);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs, isLoading]);

  const runCommand = async (e) => {
    e.preventDefault();
    if (!prompt) return;

    const newLog = { role: 'user', text: prompt };
    setLogs((prev) => [...prev, newLog]);
    setPrompt('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/run-command', { prompt: newLog.text });
      const { generated_command, execution_status, system_output } = response.data;
      
      setLogs((prev) => [
        ...prev,
        { role: 'agent', text: generated_command },
        { role: 'system', text: system_output || `Status: ${execution_status}` }
      ]);
    } catch (error) {
      setLogs((prev) => [...prev, { role: 'system', text: "Error: Connection to AI Orchestrator failed." }]);
    }
    setIsLoading(false);
  };

  return (
    // Modern Dark Background with subtle gradient
    <div className="min-h-screen bg-slate-950 text-slate-300 font-mono p-4 md:p-8 flex flex-col items-center bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(34,211,238,0.15),rgba(255,255,255,0))]">
      
      {/* Premium Title */}
      <div className="text-center mb-10 mt-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 drop-shadow-sm">
          AI SysAdmin Orchestrator
        </h1>
        <p className="text-slate-400 text-sm tracking-widest uppercase">Multi-Agent System Control Panel</p>
      </div>

      {/* Main Terminal Window with Glassmorphism */}
      <div className="w-full max-w-5xl bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-xl shadow-[0_0_50px_rgba(8,_112,_184,_0.1)] overflow-hidden flex flex-col">
        
        {/* macOS Style Window Header */}
        <div className="bg-slate-800/80 px-4 py-3 border-b border-slate-700/50 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_5px_rgba(239,68,68,0.5)]"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-[0_0_5px_rgba(234,179,8,0.5)]"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-[0_0_5px_rgba(34,197,94,0.5)]"></div>
          <span className="ml-4 text-xs text-slate-500 tracking-wider">root@ai-orchestrator:~</span>
        </div>

        {/* Terminal Screen */}
        <div className="h-[32rem] p-6 overflow-y-auto font-mono text-sm leading-relaxed space-y-6">
          <div className="text-green-400/90 flex items-center gap-2">
            <span className="animate-pulse">▶</span> System initialized. Natural language interface online...
          </div>
          
          {logs.map((log, index) => (
            <div key={index} className="flex flex-col gap-1">
              {log.role === 'user' && (
                <div className="text-cyan-400 flex items-start gap-2">
                  <span className="text-slate-500 mt-0.5">❯</span> 
                  <span className="font-semibold">{log.text}</span>
                </div>
              )}
              {log.role === 'agent' && (
                <div className="text-yellow-300/90 pl-4 border-l-2 border-yellow-500/30 py-1 bg-yellow-500/5 rounded-r-md px-3">
                  <span className="text-xs text-yellow-500/70 uppercase block mb-1">Generated PowerShell</span>
                  {log.text}
                </div>
              )}
              {log.role === 'system' && (
                <div className="text-slate-300 whitespace-pre-wrap pl-4 pb-2">
                  {log.text}
                </div>
              )}
            </div>
          ))}
          
          {/* Loading Animation */}
          {isLoading && (
            <div className="text-cyan-500 flex items-center gap-3 pl-4">
              <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
              <span>Synthesizing command...</span>
            </div>
          )}
          <div ref={logsEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={runCommand} className="flex border-t border-slate-700/50 bg-slate-900/50 p-2">
          <span className="text-cyan-500 font-bold px-4 py-3">❯</span>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="E.g., Clear my DNS cache or Show disk space..."
            className="flex-1 bg-transparent text-slate-100 placeholder-slate-600 outline-none pr-4"
            disabled={isLoading}
            autoFocus
          />
          <button 
            type="submit" 
            className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-2 rounded-md font-semibold tracking-wider transition-all duration-200 shadow-[0_0_15px_rgba(8,_145,_178,_0.4)] hover:shadow-[0_0_25px_rgba(8,_145,_178,_0.6)] disabled:opacity-50 disabled:cursor-not-allowed m-1"
            disabled={isLoading}
          >
            EXECUTE
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;