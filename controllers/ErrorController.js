exports.get404Error =  (req, res, next) => {
    res.render('404', { docTitle: '404: Error', errorCss: true, path: ''});
    // res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
}