exports.errorHandler = function(err, req, res, next) {
    console.error(err.message);
    console.error(err.stack);
    res.status(500);
    res.send("Oops, an error has occured");
    // res.render('error_template', { error: err });
}
