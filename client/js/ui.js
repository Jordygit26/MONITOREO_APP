/**
 * UI Rendering and DOM Manipulation
 */
const UI = {
  grid: document.getElementById('nodes-grid'),
  
  // Stats DOM
  statTotal: document.getElementById('stat-total'),
  statExcellent: document.getElementById('stat-excellent'),
  statAcceptable: document.getElementById('stat-acceptable'),
  statCritical: document.getElementById('stat-critical'),
  lastUpdate: document.getElementById('last-update'),

  // Modal DOM
  modal: document.getElementById('node-modal'),
  btnCloseModal: document.getElementById('btn-close-modal'),
  btnRunPing: document.getElementById('btn-run-ping'),
  pingResults: document.getElementById('ping-results'),
  
  currentNodeId: null,

  renderNodes(nodes) {
    this.grid.innerHTML = '';
    
    let excellent = 0, acceptable = 0, critical = 0;

    nodes.forEach(node => {
      // Calcular stats
      const level = Utils.getSignalLevel(node.signalDbm);
      if (level === 'excellent') excellent++;
      else if (level === 'acceptable') acceptable++;
      else critical++;

      // Crear tarjeta
      const card = document.createElement('div');
      card.className = 'node-card';
      card.onclick = () => window.appContext.openNodeModal(node.id);

      const signalText = node.signalDbm ? `${node.signalDbm} dBm` : 'N/A';
      const latencyText = node.latencyMs ? `${node.latencyMs} ms` : 'N/A';

      card.innerHTML = `
        <div class="node-header">
          <span class="node-hostname">${node.hostname}</span>
          <div class="node-status-indicator ${level}"></div>
        </div>
        <div class="node-metrics">
          <div class="metric">
            <span class="metric-label">IP</span>
            <span class="metric-value">${node.ip}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Señal</span>
            <span class="metric-value signal-${level}">${signalText}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Latencia</span>
            <span class="metric-value">${latencyText}</span>
          </div>
        </div>
      `;
      this.grid.appendChild(card);
    });

    // Actualizar stats
    this.statTotal.textContent = nodes.length;
    this.statExcellent.textContent = excellent;
    this.statAcceptable.textContent = acceptable;
    this.statCritical.textContent = critical;
    this.lastUpdate.textContent = `Última actualización: ${Utils.getCurrentTime()}`;
  },

  openModal(node) {
    this.currentNodeId = node.id;
    document.getElementById('modal-title').textContent = node.hostname;
    document.getElementById('modal-ip').textContent = node.ip;
    document.getElementById('modal-mac').textContent = node.mac;
    document.getElementById('modal-ssid').textContent = node.ssid;
    document.getElementById('modal-model').textContent = node.model;
    
    const level = Utils.getSignalLevel(node.signalDbm);
    const signalEl = document.getElementById('modal-signal');
    signalEl.textContent = node.signalDbm ? `${node.signalDbm} dBm` : 'N/A';
    signalEl.className = `signal-${level}`;
    
    document.getElementById('modal-uptime').textContent = Utils.formatUptime(node.uptime);
    
    this.pingResults.classList.add('hidden');
    this.btnRunPing.textContent = 'Ejecutar Ping';
    this.btnRunPing.disabled = false;
    
    this.modal.classList.add('active');
  },

  closeModal() {
    this.modal.classList.remove('active');
    this.currentNodeId = null;
  },

  showPingLoading() {
    this.btnRunPing.textContent = 'Enviando ráfaga...';
    this.btnRunPing.disabled = true;
    this.pingResults.classList.add('hidden');
  },

  showPingResults(data) {
    document.getElementById('ping-sent').textContent = data.sent;
    document.getElementById('ping-recv').textContent = data.received;
    
    const lostEl = document.getElementById('ping-lost');
    lostEl.textContent = data.lost;
    if (data.lost > 0) lostEl.style.color = 'var(--color-critical)';
    else lostEl.style.color = 'inherit';

    document.getElementById('ping-loss-perc').textContent = `${data.lossPercentage}%`;
    
    document.getElementById('ping-min').textContent = data.latency.min;
    document.getElementById('ping-avg').textContent = data.latency.avg;
    document.getElementById('ping-max').textContent = data.latency.max;
    document.getElementById('ping-jitter').textContent = data.latency.jitter;

    this.pingResults.classList.remove('hidden');
    this.btnRunPing.textContent = 'Ejecutar Ping';
    this.btnRunPing.disabled = false;
  }
};
