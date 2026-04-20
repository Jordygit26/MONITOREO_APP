const nodesData = require('../data/nodes.json');

/**
 * Service to handle node operations and logic.
 */
class NodeService {
  /**
   * Fetches all nodes. Simulates dynamic signal fluctuation.
   * @returns {Promise<Array>} List of nodes
   */
  async getAllNodes() {
    // Simulamos un poco de fluctuación en la señal para que se vea más realista
    return nodesData.map(node => {
      if (node.status !== 'offline' && node.signalDbm) {
        // Variación aleatoria entre -2 y +2 dBm
        const variation = Math.floor(Math.random() * 5) - 2;
        node.signalDbm += variation;
      }
      return node;
    });
  }

  /**
   * Retrieves a specific node by ID.
   * @param {string} id - Node identifier
   * @returns {Promise<Object|null>} Node object or null
   */
  async getNodeById(id) {
    const node = nodesData.find(n => n.id === id);
    return node || null;
  }

  /**
   * Simulates a ping burst to check link stability.
   * Generates realistic metrics based on current node status.
   * @param {string} id - Node identifier
   * @param {number} packetCount - Number of ICMP packets to simulate
   * @returns {Promise<Object>} Ping results
   */
  async simulatePing(id, packetCount = 10) {
    const node = await this.getNodeById(id);
    
    if (!node) {
      throw new Error('Node not found');
    }

    if (node.status === 'offline') {
      return {
        nodeId: id,
        sent: packetCount,
        received: 0,
        lost: packetCount,
        lossPercentage: 100,
        latency: { min: 0, avg: 0, max: 0, jitter: 0 },
        timestamp: new Date().toISOString()
      };
    }

    // Lógica para simular pérdida de paquetes y latencia basada en la señal
    let lossPercentage = 0;
    let baseLatency = node.latencyMs || 20;

    if (node.signalDbm < -80) {
      lossPercentage = Math.floor(Math.random() * 30) + 10; // 10-40% loss
      baseLatency += 50;
    } else if (node.signalDbm < -60) {
      lossPercentage = Math.floor(Math.random() * 5); // 0-5% loss
      baseLatency += 10;
    }

    const lost = Math.floor(packetCount * (lossPercentage / 100));
    const received = packetCount - lost;
    
    // Calcular jitter (variación de latencia)
    const jitter = Math.floor(Math.random() * 15);
    const min = baseLatency > 5 ? baseLatency - 5 : baseLatency;
    const max = baseLatency + jitter;
    const avg = Math.floor((min + max) / 2);

    return {
      nodeId: id,
      targetIp: node.ip,
      sent: packetCount,
      received,
      lost,
      lossPercentage: Math.round((lost / packetCount) * 100),
      latency: { min, avg, max, jitter },
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = new NodeService();
