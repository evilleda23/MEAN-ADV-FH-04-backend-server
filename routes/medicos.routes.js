/**
 * Ruta: /api/medicos
 */

const { Router } = require('express');
const router = Router();

//midlewares
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
//const { validarJWT } = require('../middlewares/validar-jwt');
//Para que no valide el jwt mientras tanto
const validarJWT = (req, res, next) => next();
const {
  getMedicos,
  postMedico,
  putMedico,
  deleteMedico,
} = require('../controllers/Medicos.controller');

router.get('/', validarJWT, getMedicos);
router.post('/', [validarCampos], postMedico);

router.put('/:id', [validarJWT, validarCampos], putMedico);

router.delete('/:id', validarJWT, deleteMedico);
module.exports = router;
