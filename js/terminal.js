/* --- DOUGH TECHNOLOGIES MONOCHROME TERMINAL SIMULATOR --- */

document.addEventListener('DOMContentLoaded', () => {
  const terminalBody = document.getElementById('terminal-body');
  const terminalInput = document.getElementById('terminal-input');

  if (!terminalInput || !terminalBody) return;

  const commands = {
    'help': `AVAILABLE DOUGH COMMANDS:
  - <span class="text-white">status</span>       : Display system uptime & cloud status.
  - <span class="text-white">founders</span>     : Display dossier on Jordan & Kelly.
  - <span class="text-white">tech-specs</span>   : View DoughAI and Quantum Bake specs.
  - <span class="text-white">bake</span>         : Run AI algorithm simulation.
  - <span class="text-white">clear</span>        : Clear terminal output.`,

    'status': `<span class="text-white">[SYSTEM STATUS OK]</span>
  - DoughAI Cluster: ONLINE (99.99% Uptime)
  - Quantum Latency: 0.002ms
  - Global Nodes: Tokyo, New York, Amsterdam, Singapore, London
  - Security Clearance: LEVEL 5 (JORDAN & KELLY APPROVED)`,

    'founders': `<span class="text-white">[EXECUTIVE DOSSIER]</span>
  - <span class="text-white">JORDAN</span>: Co-Founder & CEO. Chief Architect of Dough Technologies.
  - <span class="text-white">KELLY</span>: Co-Founder & CCO. Chief Innovation Officer & Media Director.`,

    'tech-specs': `<span class="text-white">[SPECIFICATIONS ARCHITECTURE v4.2]</span>
  - Neural Engine: 100,000 TFLOPS Quantum Processing Unit (QDPU)
  - Consensus Mechanism: Proof-of-Stake-and-Bake (PoSB)
  - Encryption: 4096-bit Post-Quantum Lattice Cryptography`,

    'bake': `<span class="text-white">[EXECUTING AI ALGORITHM...]</span>
  > Analyzing market liquidity... [OK]
  > Calculating dough ratio... [OK]
  > <span class="text-white">BAKE COMPLETE! +$1,000,000 DOUGH CAPITAL GENERATED!</span>`
  };

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const commandText = terminalInput.value.trim().toLowerCase();
      terminalInput.value = '';

      const cmdLine = document.createElement('div');
      cmdLine.className = 'terminal-line';
      cmdLine.innerHTML = `<span class="terminal-prompt">dough-cli@tech:~$</span> ${escapeHtml(commandText)}`;
      terminalBody.appendChild(cmdLine);

      if (commandText === 'clear') {
        terminalBody.innerHTML = '';
        return;
      }

      const responseLine = document.createElement('div');
      responseLine.className = 'terminal-line';

      if (commands[commandText]) {
        responseLine.innerHTML = commands[commandText];
      } else if (commandText === '') {
        return;
      } else {
        responseLine.innerHTML = `<span class="text-muted">Command not recognized: '${escapeHtml(commandText)}'. Type <span class="text-white">help</span> for list.</span>`;
      }

      terminalBody.appendChild(responseLine);
      terminalBody.scrollTop = terminalBody.scrollHeight;

      if (typeof playSynthBeep === 'function') {
        playSynthBeep(800, 0.04);
      }
    }
  });

  function escapeHtml(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
});
