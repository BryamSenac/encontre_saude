/**
 * validation.middleware.js
 * Valida os dados do formulário de pré-prontuário antes de processar
 */

const { body, validationResult } = require('express-validator');

const prontuarioValidationRules = [
  body('nome')
    .trim()
    .notEmpty().withMessage('O nome completo é obrigatório.')
    .isLength({ min: 3, max: 150 }).withMessage('Nome deve ter entre 3 e 150 caracteres.'),

  body('dataNascimento')
    .notEmpty().withMessage('A data de nascimento é obrigatória.')
    .isDate({ format: 'YYYY-MM-DD' }).withMessage('Data de nascimento inválida.'),

  body('cpf')
    .trim()
    .notEmpty().withMessage('O CPF é obrigatório.')
    .matches(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/).withMessage('CPF inválido.'),

  body('sexo')
    .notEmpty().withMessage('O sexo é obrigatório.')
    .isIn(['Masculino', 'Feminino', 'Outro']).withMessage('Sexo inválido.'),

  body('telefone')
    .trim()
    .notEmpty().withMessage('O telefone é obrigatório.'),

  body('canalEnvio')
    .notEmpty().withMessage('Selecione um canal de envio.')
    .isIn(['email', 'whatsapp', 'download']).withMessage('Canal de envio inválido.'),

  body('email')
    .if(body('canalEnvio').equals('email'))
    .trim()
    .notEmpty().withMessage('O e-mail é obrigatório para envio por e-mail.')
    .isEmail().withMessage('E-mail inválido.')
    .normalizeEmail(),

  body('whatsapp')
    .if(body('canalEnvio').equals('whatsapp'))
    .trim()
    .notEmpty().withMessage('O número de WhatsApp é obrigatório.')
    .matches(/^\+?[1-9]\d{10,14}$/).withMessage(
      'Número de WhatsApp inválido. Use formato internacional: +5546999998888'
    ),

  body('queixaPrincipal')
    .trim()
    .notEmpty().withMessage('A queixa principal é obrigatória.')
    .isLength({ min: 3, max: 1000 }).withMessage('Descreva a queixa com pelo menos 3 caracteres.'),

  body('sintomas')
    .optional()
    .isArray().withMessage('Sintomas deve ser uma lista.'),

  body('pressaoArterial').optional({ nullable: true }).trim().isLength({ max: 20 }),
  body('frequenciaCardiaca').optional({ nullable: true }).isNumeric(),
  body('temperatura').optional({ nullable: true }).isFloat({ min: 30, max: 45 }),
  body('saturacaoOxigenio').optional({ nullable: true }).isFloat({ min: 50, max: 100 }),
  body('peso').optional({ nullable: true }).isFloat({ min: 1, max: 500 }),
  body('altura').optional({ nullable: true }).isFloat({ min: 30, max: 300 }),

  body('alergias').optional({ nullable: true }).trim().isLength({ max: 500 }),
  body('medicamentosEmUso').optional({ nullable: true }).trim().isLength({ max: 500 }),
  body('doencasPreexistentes').optional({ nullable: true }).trim().isLength({ max: 500 }),
  body('historicoFamiliar').optional({ nullable: true }).trim().isLength({ max: 500 }),
  body('observacoesAdicionais').optional({ nullable: true }).trim().isLength({ max: 1000 }),
];

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Dados inválidos. Verifique os campos abaixo.',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
}

module.exports = { prontuarioValidationRules, handleValidationErrors };
