const jwt = require('jsonwebtoken');


exports.default = (req,res,next) =>{

  try {
    const auth = req.headers.authorization.split(' ')[0] ;
    const user = req.headers.authorization.split(' ')[1] ;

    if(auth=='BANKS_EBOOK_APPS' && user=='DEFAULT_USER_EBOOK')
    {
      next();
    }
    else
    {
      res.json({
        status : false ,
        message : "Vous n'êtes pas autorisé à utiliser cette appli .",
        error : "INTRUS"
      }) ;
    }
  }
  catch
  {
    res.json({
      status : false ,
        message : "Erreur de demarrage, veuillé réessayer plutard .",
        error : "ERROR_HEADERS"
    });
  }

} ;

exports.userApp = (req, res, next) => {
  try {
    const user = req.headers.authorization.split(' ')[0] ;
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'EBOOK_BANKS_KEY');
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      
      res.json({
      status : false ,
        message : "Vous devez vous reconnectez pour effectuer un telle action.",
        error : "ERROR_HEADERS"
    });

    } else {
      next();
    }
  } catch {
    res.json({
      status : false ,
        message : "Vous devez vous reconnectez pour effectuer un telle action.",
        error : "ERROR_HEADERS"
    });
  }
};