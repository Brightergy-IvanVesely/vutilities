export default router => {
  router.get('/', (req, res, next) => {
    res.json({
      success: 'okay'
    });
  });
};
