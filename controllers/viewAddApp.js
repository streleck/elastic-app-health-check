module.exports = (req, res, next) => {
  res.render('addApp', {
    pageTitle: 'Monitor a New App',
    pageName: 'addApp'
  });
}