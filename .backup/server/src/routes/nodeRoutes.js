const express = require('express');
const router = express.Router();
const nodeController = require('../controllers/nodeController');

// Rutas base: /api/v1/nodes

router.get('/', nodeController.getNodes.bind(nodeController));
router.get('/:id', nodeController.getNode.bind(nodeController));
router.post('/ping', nodeController.pingNode.bind(nodeController));

module.exports = router;
