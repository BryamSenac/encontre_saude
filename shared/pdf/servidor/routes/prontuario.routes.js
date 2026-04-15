/**
 * prontuario.routes.js
 */

const { Router } = require('express');
const { prontuarioValidationRules, handleValidationErrors } = require('../middleware/validation.middleware');
const { criarProntuario } = require('../controllers/prontuario.controller');

const router = Router();

router.post(
  '/pre-prontuario',
  prontuarioValidationRules,
  handleValidationErrors,
  criarProntuario
);

module.exports = router;
