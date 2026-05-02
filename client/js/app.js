/**
 * Application Core Logic
 */
class App {
  constructor() {
    this.refreshInterval = null;
    this.init();
  }

  async init() {
    this.setupEventListeners();
    await this.fetchAndRenderNodes();
    
    // Auto-refresh every 30 seconds
    this.refreshInterval = setInterval(() => {
      this.fetchAndRenderNodes();
    }, 30000);
  }

  setupEventListeners() {
    document.getElementById('btn-refresh').addEventListener('click', () => {
      this.fetchAndRenderNodes();
    });

    UI.btnCloseModal.addEventListener('click', () => {
      UI.closeModal();
    });

    // Close modal when clicking outside
    UI.modal.addEventListener('click', (e) => {
      if (e.target === UI.modal) {
        UI.closeModal();
      }
    });

    UI.btnRunPing.addEventListener('click', () => {
      this.runPingTest();
    });

    // Navegación del Sidebar
    const navItems = document.querySelectorAll('#sidebar-nav li');
    const views = {
      'dashboard-view': document.getElementById('dashboard-view'),
      'alertas-view': document.getElementById('alertas-view'),
      'topologia-view': document.getElementById('topologia-view'),
      'config-view': document.getElementById('config-view')
    };

    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        navItems.forEach(nav => nav.classList.remove('active'));
        e.currentTarget.classList.add('active');

        const targetId = e.currentTarget.getAttribute('data-target');
        
        // Hide all views
        Object.values(views).forEach(view => {
          if (view) view.classList.add('hidden');
        });
        
        // Show target
        if (views[targetId]) {
          views[targetId].classList.remove('hidden');
        }
      });
    });

    // Evento de Configuración
    const btnSaveConfig = document.getElementById('btn-save-config');
    if (btnSaveConfig) {
      btnSaveConfig.addEventListener('click', () => {
        const interval = document.getElementById('config-refresh').value;
        this.updateRefreshInterval(parseInt(interval) * 1000);
        
        // Efecto visual simple de guardado
        const originalText = btnSaveConfig.textContent;
        btnSaveConfig.textContent = '¡Guardado!';
        btnSaveConfig.style.background = 'var(--color-excellent)';
        setTimeout(() => {
          btnSaveConfig.textContent = originalText;
          btnSaveConfig.style.background = '';
        }, 2000);
      });
    }
  }

  updateRefreshInterval(ms) {
    if (this.refreshInterval) clearInterval(this.refreshInterval);
    this.refreshInterval = setInterval(() => {
      this.fetchAndRenderNodes();
    }, ms);
  }

  async fetchAndRenderNodes() {
    try {
      const nodes = await api.getNodes();
      UI.renderNodes(nodes);
    } catch (error) {
      console.error('Error in fetchAndRenderNodes:', error);
      // Podríamos mostrar un toast de error en el UI aquí
    }
  }

  // Public method for UI inline onclick handler
  async openNodeModal(id) {
    try {
      const node = await api.getNodeDetails(id);
      UI.openModal(node);
    } catch (error) {
      console.error('Error fetching node details:', error);
    }
  }

  async runPingTest() {
    const nodeId = UI.currentNodeId;
    if (!nodeId) return;

    UI.showPingLoading();
    try {
      const results = await api.pingNode(nodeId);
      UI.showPingResults(results);
    } catch (error) {
      console.error('Error running ping test:', error);
      alert('Error ejecutando el test de enlace. Revisa la consola.');
      UI.closeModal();
    }
  }
}

// Inicializar la app y exponer un contexto global para onclick events en HTML
window.addEventListener('DOMContentLoaded', () => {
  window.appContext = new App();
});
