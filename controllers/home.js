/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  res.render('home', {
    title: 'Home'
  });
};

exports.fourohfour = (req, res) => {
  res.render('fourohfour', {
    title: '404'
  });
}

exports.faq = (req, res) => {
  res.render('faq', {
    title: 'FAQ'
  });
}
