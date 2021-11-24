const pool = require('../dbase/config') ;

exports.lovedPoster = (req,res,next) =>{

  const loved = req.body.liked ? req.body.liked : 0 ;

  pool.getConnection((err,connect)=>{

    if(err) {
      res.status(400).
        json({status : false ,
          message : "Erreur de connection à la base de donnée" ,
          error : "DB_ERROR"}) ;
    }

    else{
      connect.query('SELECT * FROM poster_descrbile WHERE id_poster=? and id_user=?',[req.params.id,req.body.userId],(err,rows)=>{

      if(err) res.json(
              {
                status : false ,
                error : "USER_ERROR" ,
                message : "Utilisateur introuvable, veuillez vous reconnecter."
              }) ;

        else
        {
          if(rows.length==0)
          {
              connect.query('INSERT INTO poster_descrbile SET id_user=? , id_poster=? , likers=? , loved_counter=? , disloved_counter=? , add_date=?',[req.body.userId,req.params.id,loved, loved ? 1 : 0 , loved ? 0 : 1 ,new Date()],(err,success)=>{


                if(err)
                  {
                    res.json(
                      {
                        status : false ,
                        error : "UPDATE_ERROR" ,
                        message : "Une erreur s'est produite , veuillez réessayer plutard."
                      })
                  }


              }) ;
          }
          else
          {
            connect.query('UPDATE poster_descrbile SET likers=? , loved_counter=? , disloved_counter=?  WHERE id_poster=? and id_user=?',[loved, loved ? 1 : 0 , loved ? 0 : 1 ,req.params.id,req.body.userId],(err,rows)=>{


              if(err)
                {
                  res.json(
                    {
                      status : false ,
                      error : "UPDATE_ERROR" ,
                      message : "Une erreur s'est produite , veuillez réessayer plutard."
                    })
                }
            }) ;
          }

          connect.query('SELECT * FROM poster_descrbile WHERE id_poster=?',[req.params.id],(err,allLiked)=>{



            if(err)
            {
              res.json(
                {
                  status : false ,
                  error : "UPDATE_ERROR" ,
                  message : "Une erreur s'est produite , veuillez réessayer plutard."
                }) ;
            }

            else
            {
              counterOfLike = 0 ;
              counterOfDisLike = 0 ;

              allLiked.forEach((like) => {

                if(like.loved_counter==1)
                {
                  counterOfLike++;
                }

                if(like.disloved_counter==1)
                {
                  counterOfDisLike++;
                }
              });

              connect.query('UPDATE posters_counters SET likers_counters=? , dislikers_counters=? WHERE id_poster_liked=?' , [counterOfLike,counterOfDisLike,req.params.id],(err,success)=>{



                  if(err)
                  {
                    res.json(
                      {
                        status : false ,
                        error : "UPDATE_ERROR" ,
                        message : "Une erreur s'est produite , veuillez réessayer plutard."
                      }) ;
                  }

                  else
                  {
                    res.json(
                      {
                        status : true ,
                        error : "UPDATE_SUCCESS" ,
                        message : '....'
                      }) ;
                  }


              }) ;

            }

          })
        }
    }) ;
    }
    
  }) ;

} ;


exports.user_poster = (req,res,next)=>{

  pool.getConnection((err,connect)=>{

    if(err) {
      res.status(400).
        json({status : false ,
          message : "Erreur de connection à la base de donnée" ,
          error : "DB_ERROR"}) ;
    }


      else{
        connect.query('SELECT posters.id , posters.visibility , posters.title , posters.msg, posters.status , posters.unite , posters.delais , posters.addDate , users.pseudonyme , users.token ,poster_descrbile.likers,poster_descrbile.loved_counter,poster_descrbile.disloved_counter,posters_counters.likers_counters,posters_counters.dislikers_counters,posters_counters.comment_counters FROM posters INNER JOIN users ON users.token=posters.id_user INNER JOIN poster_descrbile ON poster_descrbile.id_poster=posters.id and users.token=poster_descrbile.id_user INNER JOIN posters_counters ON posters_counters.id_poster_liked=posters.id WHERE visibility=? and posters.id_user=? ORDER BY posters.id DESC',['Public',req.params.userId],(err,rows)=>{



        if(!err)
        {
          res.json(
                {
                  status : true ,
                  counters : rows.length,
                  message : rows
                }) ;
        }
        else
        {
          res.json(
                {
                  status : false ,
                  error : "USER_ERROR" ,
                  message : "Utilisateur introuvable, veuillez vous reconnecter."
                }) ;
        }

      }) ;
      }

  }) ;

} ;


exports.all_poster = (req,res,next) =>{

  pool.getConnection((err,connect)=>{

      if(err) {
        res.status(400).
        json({status : false ,
          message : "Erreur de connection à la base de donnée" ,
          error : "DB_ERROR"}) ;
      }

        else{
          connect.query('SELECT * FROM posters INNER JOIN users ON users.token=posters.id_user WHERE visibility=? ORDER BY posters.id DESC',['Public'],(error,rows)=>{



          if(!error)
          {
            res.json(
                  {
                    status : true ,
                    counters : rows.length,
                    message : rows
                  }) ;
          }
          else
          {
            res.json(
                  {
                    status : false ,
                    error : "USER_ERROR" ,
                    message : "Erreur, veuillez relancer l'application ."
                  }) ;
          }

        }) ;
        }

  }) ;


}

exports.members_poster = (req,res,next)=>{

  pool.getConnection((err,connect)=>{

    if(err) {
      res.status(400).
        json({status : false ,
          message : "Erreur de connection à la base de donnée" ,
          error : "DB_ERROR"}) ;
    }


      else{
        connect.query('SELECT posters.id , posters.visibility , posters.title , posters.msg, posters.status , posters.unite , posters.delais , posters.addDate , users.pseudonyme  , poster_descrbile.id_user ,poster_descrbile.likers,poster_descrbile.loved_counter,poster_descrbile.disloved_counter,posters_counters.likers_counters,posters_counters.dislikers_counters,posters_counters.comment_counters FROM posters INNER JOIN users ON users.token=posters.id_user INNER JOIN poster_descrbile ON poster_descrbile.id_poster=posters.id and poster_descrbile.id_user!=users.token INNER JOIN posters_counters ON posters_counters.id_poster_liked=posters.id WHERE visibility=? and posters.id_user!=? ORDER BY posters.id DESC',['Public',req.params.userId],(err,allLikerPoster)=>{


        currentUserToLiked  = [] ;

        allLikerPoster.forEach((data)=>{
          if(data.id_user==req.params.userId)
          {
            currentUserToLiked.push(data) ;
          }
        }) ;

        if(err)
        {

            res.
            json({status : false ,
            message : "Une erreur s'est produite" ,
            error : "SQL_ERROR"}) ;

        }
        else
        {

          if(currentUserToLiked.length==0)
          {
              connect.query('SELECT posters.id , posters.visibility , posters.title , posters.msg, posters.status , posters.unite , posters.delais , posters.addDate , users.pseudonyme,posters_counters.likers_counters,posters_counters.dislikers_counters,posters_counters.comment_counters FROM posters INNER JOIN users ON users.token=posters.id_user INNER JOIN posters_counters ON posters_counters.id_poster_liked=posters.id WHERE visibility=? and posters.id_user!=? ORDER BY posters.id DESC',['Public',req.params.userId],(err,rows)=>{

                if(!err)
                {
                  res.json(
                        {
                          status : true ,
                          counters : rows.length,
                          message : rows
                        }) ;
                }
                else
                {
                  res.json(
                        {
                          status : false ,
                          error : "USER_ERROR" ,
                          message : "Utilisateur introuvable, veuillez vous reconnecter."
                        }) ;
                }

              }) ;
          }

          else
          {

                connect.query('SELECT posters.id , posters.visibility , posters.title , posters.msg, posters.status , posters.unite , posters.delais , posters.addDate , posters.id_user ,users.pseudonyme,posters_counters.likers_counters,posters_counters.dislikers_counters,posters_counters.comment_counters FROM posters INNER JOIN users ON users.token=posters.id_user INNER JOIN posters_counters ON posters_counters.id_poster_liked=posters.id WHERE visibility=? and posters.id_user!=? and posters.id NOT IN (SELECT id_poster FROM poster_descrbile WHERE id_user='+req.params.userId+') ORDER BY posters.id DESC',['Public',req.params.userId],(err,rows)=>{


                                if(err)
                                {
                                  res.json(
                                        {
                                          status : false ,
                                          error : "USER_ERROR" ,
                                          message : "Utilisateur int;l,knjbhjnk,l;rouvable, veuillez vous reconnecter."
                                        }) ;
                                }
                                else
                                {


                                    all = [...rows , ...currentUserToLiked ] ;


                                    res.json(
                                      {
                                        status : true ,
                                        counters : all.length,
                                        message : all
                                      }) ;

                                }

                              }) ;

          }

        }


      }) ;
      }

  }) ;

} ;


exports.comment = (req,res,next) =>{


  pool.getConnection((err,connect)=>{

      if(err) {
        res.status(400).
        json({status : false ,
          message : "Erreur de connection à la base de donnée" ,
          error : "DB_ERROR"}) ;
      }

      else{
        connect.query('INSERT INTO comment SET id_user=? , id_poster=? , msg=? , add_date=?',[req.body.userId,req.body.id,req.body.msg,new Date()],(err,rows)=>{

        if(err)
        {
           res.json(
              {
                status : false ,
                error : "USER_ERROR" ,
                message : "Impossible de valider votre commentaire, veuillez réessayer ." 
              }) 
        }

        else
        {
           
           connect.query('SELECT comment_counters FROM posters_counters WHERE id_poster_liked=?',[req.body.id],(err,rows)=>{

            data = 0 ;

             rows.forEach((counter)=>{
              data = counter.comment_counters ;
             }) ;


                if(err)
                {
                   res.json(
                      {
                        status : false ,
                        error : "USER_ERROR" ,
                        message : "Impossible de valider votre commentaire, veuillez réessayer ." 
                      }) 
                }

                else
                {

                  connect.query('UPDATE posters_counters SET comment_counters=? WHERE id_poster_liked=?',[data+1 , req.body.id],(err,success)=>{

                      if(err)
                      {
                         res.json(
                            {
                              status : false ,
                              error : "USER_ERROR" ,
                              message : "Impossible de valider votre commentaire, veuillez réessayer ." 
                            }) 
                      }
                      else
                      {
                        res.json(
                            {
                              status : true ,
                              error : "INSERT_TRUE" ,
                              message : "..." 
                            }) 
                      }
                  }) ;

                }

           }) ;
        }

      })
      }

  }) ;

} ;

exports.current_comment_of_poster = (req,res,next) =>{

  pool.getConnection((err,connect)=>{

      if(err) {
        res.status(400).
        json({status : false ,
          message : "Erreur de connection à la base de donnée" ,
          error : "DB_ERROR"}) ;
      }

      else{
        connect.query('SELECT comment.id_user , comment.msg , comment.id_poster , comment.add_date , users.pseudonyme FROM comment INNER JOIN users ON comment.id_user=users.token WHERE comment.id_poster=?',[req.params.id],(err,rows)=>{

          if(err)
          {
            res.json({status : false ,
                  message : "Une erreur est survenu, veuillez réessayer plutard ." ,
                  error : "DB_ERROR"}) ;
          }
          else
          {
            res.json({status : true ,
              message : rows,
              counters:rows.length ,
              error : "SUCESS"}) ;
          }

      }) ;
      }

  }) ;

} ;