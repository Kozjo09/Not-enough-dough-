/* --- DOUGH TECHNOLOGIES MONOCHROME TERMINAL SIMULATOR --- */

document.addEventListener('DOMContentLoaded', () => {
  const terminalBody = document.getElementById('terminal-body');
  const terminalInput = document.getElementById('terminal-input');

  if (!terminalInput || !terminalBody) return;

  const commands = {
    'help': `AVAILABLE DOUGH COMMANDS:
  - <span class="text-white">status</span>       : Display system status.
  - <span class="text-white">story</span>        : Read how Not Enough Dough started.
  - <span class="text-white">founders</span>     : Display info on Jordan & Kelly.
  - <span class="text-white">divisions</span>    : Display company divisions & sub-divisions.
  - <span class="text-white">clear</span>        : Clear terminal output.`,

    'status': `<span class="text-white">[SYSTEM STATUS OK]</span>
  - Site Status: ONLINE & ACTIVE
  - Co-Founders: Jordan & Kelly
  - Divisions: Dough Games, Dough Entertainment (incl. Dough Animations), Dough Technologies`,

    'story': `<span class="text-white">[OUR AUTHENTIC STORY]</span>
  In 2023, Jordan & Kelly created 'Not Enough Dough' as a running joke for school presentations.
  Fast-forward to today: we've turned our concept into a legitimate business entity!`,

    'founders': `<span class="text-white">[CO-FOUNDERS DOSSIER]</span>
  - <span class="text-white">JORDAN</span>: Co-Founder & Development Lead.
  - <span class="text-white">KELLY</span>: Co-Founder & Creative Director.`,

    'divisions': `<span class="text-white">[COMPANY DIVISIONS]</span>
  1. <span class="text-white">DOUGH GAMES</span>: Interactive arcade experiences & web mini-games.
  2. <span class="text-white">DOUGH ENTERTAINMENT</span>: Creative direction & media production.
     ↳ <span class="text-white">DOUGH ANIMATIONS</span>: Sub-division animation engine (Acquire -> Craft -> Release).
  3. <span class="text-white">DOUGH TECHNOLOGIES</span>: Web tools, physics engines & terminal software.`
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
    }
  });

  function escapeHtml(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
});
