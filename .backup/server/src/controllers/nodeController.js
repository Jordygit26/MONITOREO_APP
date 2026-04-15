const nodeService = require('../services/nodeService');

/**
 * Controller methods for node endpoints.
 */
class NodeController {
  
  /**
   * Handler for GET /api/v1/nodes
   */
  async getNodes(req, res, next) {
    try {
      const nodes = await nodeService.getAllNodes();
      res.status(200).json({
        success: true,
        count: nodes.length,
        data: nodes
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handler for GET /api/v1/nodes/:id
   */
  async getNode(req, res, next) {
    try {
      const { id } = req.params;
      const node = await nodeService.getNodeById(id);
      
      if (!node) {
        res.status(404);
        throw new Error('CPE Node not found in inventory');
      }

      res.status(200).json({
        success: true,
        data: node
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handler for POST /api/v1/nodes/ping
   */
  async pingNode(req, res, next) {
    try {
      const { nodeId, packetCount } = req.body;

      if (!nodeId) {
        res.status(400);
        throw new Error('Missing required parameter: nodeId');
      }

      const results = await nodeService.simulatePing(nodeId, packetCount || 10);
      
      res.status(200).json({
        success: true,
        data: results
      });
    } catch (error) {
      if (error.message === 'Node not found') {
        res.status(404);
      }
      next(error);
    }
  }
}

module.exports = new NodeController();
