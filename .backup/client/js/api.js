/**
 * API Wrapper using fetch and async/await
 */
class ApiClient {
  constructor() {
    this.baseUrl = 'http://localhost:3001/api/v1';
  }

  async getNodes() {
    try {
      const response = await fetch(`${this.baseUrl}/nodes`);
      if (!response.ok) throw new Error('Error fetching nodes');
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async getNodeDetails(id) {
    try {
      const response = await fetch(`${this.baseUrl}/nodes/${id}`);
      if (!response.ok) throw new Error('Error fetching node details');
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async pingNode(nodeId) {
    try {
      const response = await fetch(`${this.baseUrl}/nodes/ping`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodeId, packetCount: 10 })
      });
      if (!response.ok) throw new Error('Ping request failed');
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
}

const api = new ApiClient();
