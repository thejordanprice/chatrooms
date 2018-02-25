/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  res.render('home', {
    title: 'Home'
  });
};

exports.faq = (req, res) => {
  res.render('faq', {
    title: 'FAQ'
  });
}
