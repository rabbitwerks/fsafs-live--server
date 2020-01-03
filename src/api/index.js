const router = require('express').Router();

router.get('/', (req, res, next) => {
  res.json({
    user: req.user
  });
})

module.exports = router;
