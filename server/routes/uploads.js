// server/routes/uploads.js
const express  = require('express');
const multer   = require('multer');
const passport = require('passport');
const { Upload } = require('../models');   // now resolves
const router   = express.Router();
const upload   = multer({ dest: 'uploads/' });

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  upload.single('file'),
  async (req, res) => {
    await Upload.create({
      userId:  req.user.id,
      filename: req.file.originalname,
      path:     req.file.path,
    });
    res.json({ success: true });
  }
);

router.get(
  '/count',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const count = await Upload.count({ where: { userId: req.user.id } });
    res.json({ count });
  }
);

module.exports = router;
