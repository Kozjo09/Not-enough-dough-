/* --- DOUGH TECHNOLOGIES INTERACTIVE TERMINAL SIMULATOR --- */

document.addEventListener('DOMContentLoaded', () => {
  const terminalBody = document.getElementById('terminal-body');
  const terminalInput = document.getElementById('terminal-input');

  if (!terminalInput || !terminalBody) return;

  const commands = {
    'help': `AVAILABLE DOUGH COMMANDS:
  - <span class="text-gold">status</span>       : Display real-time quantum network & cloud status.
  - <span class="text-gold">founders</span>     : Display intelligence dossier on Jordan & Kelly.
  - <span class="text-gold">tech-specs</span>   : View DoughAI and Quantum Bake architecture specs.
  - <span class="text-gold">bake</span>         : Run AI baking algorithm simulation.
  - <span class="text-gold">clear</span>        : Clear the terminal output display.
  - <span class="text-gold">matrix</span>       : Toggle quantum visual stream.`,

    'status': `<span class="text-cyan">[SYSTEM STATUS OK]</span>
  - DoughAI Cluster: ONLINE (99.99% Uptime)
  - Quantum Bake Latency: 0.002ms
  - Global Nodes: Tokyo, New York, Amsterdam, Singapore, London
  - Security Clearance: LEVEL 5 ALPHA (JORDAN & KELLY APPROVED)`,

    'founders': `<span class="text-gold">[EXECUTIVE DOSSIER]</span>
  - <span class="text-gold">JORDAN</span>: Co-Founder & CEO. Chief Architect of Dough Technologies. Mastermind of the global expansion strategy.
  - <span class="text-gold">KELLY</span>: Co-Founder & CCO. Creative Director & Chief Innovation Officer. Pioneer of Dough UI/UX & media systems.`,

    'tech-specs': `<span class="text-purple">[SPECIFICATIONS ARCHITECTURE v4.2]</span>
  - Neural Engine: 100,000 TFLOPS Quantum Dough Processing Unit (QDPU)
  - Consensus Mechanism: Proof-of-Stake-and-Bake (PoSB)
  - Encryption: 4096-bit Post-Quantum Lattice Encryption`,

    'bake': `<span class="text-gold">[EXECUTING AI BAKE ALGORITHM...]</span>
  > Analyzing market liquidity... [OK]
  > Calculating optimal dough ratio... [OK]
  > Infusing cyber-yeast data packets... [OK]
  > <span class="text-cyan">BAKE COMPLETE! +$1,000,000 DOUGH CAPITAL GENERATED!</span>`
  };

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const commandText = terminalInput.value.trim().toLowerCase();
      terminalInput.value = '';

      // Print command entry line
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
        responseLine.innerHTML = `<span class="text-pink">Command not recognized: '${escapeHtml(commandText)}'. Type <span class="text-gold">help</span> for command list.</span>`;
      }

      terminalBody.appendChild(responseLine);
      terminalBody.scrollTop = terminalBody.scrollHeight;

      if (typeof playSynthBeep === 'function') {
        playSynthBeep(1000, 0.05);
      }
    }
  });

  function escapeHtml(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
});
