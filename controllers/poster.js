const pool = require('../dbase/config');

exports.all = (req,res,next) =>{

	pool.getConnection((err,connect)=>{

		if(err) res.status(400).
			json({status : false ,
				message : "Erreur de connection à la base de donnée" ,
				error : "DB_ERROR"}) ;

		connect.query('SELECT * FROM posters WHERE id_user=? and visibility=? ORDER BY id DESC',[req.params.userId,'Privé'],(err,rows)=>{

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


	}) ;

}

exports.create = (req , res , next) =>{

	const unite = req.body.unite ? req.body.unite : 'null';
	const delais = req.body.delais ? req.body.delais : 'null';
	const status = req.body.status ? req.body.status : 'null';

	pool.getConnection((err,connect)=>{

		if(err) res.status(400).
			json({status : false ,
				message : "Erreur de connection à la base de donnée" ,
				error : "DB_ERROR"}) ;

		if(req.body.visibility=='Public')
		{
			connect.query('INSERT INTO posters SET id_user=?,visibility=?,title=?,msg=?,status=?,unite=?,delais=?,addDate=?' ,
			[req.body.userId,req.body.visibility,req.body.title,req.body.msg,status,unite,delais,new Date()], (err,new_poster_insert)=>{

				if(!err)
				{
					connect.query('INSERT INTO poster_descrbile SET id_user=? , id_poster=? , likers=? , loved_counter=? , disloved_counter=? , add_date=?',[req.body.userId,new_poster_insert.insertId,2,2,2,new Date()],(err,rows)=>{

						if(err)
						{
						  res.json(
										  {
							  status : false ,
							  error : "INSERT_ERROR" ,
							  message : "Une erreur s'est produite , veuillez réessayer plutard."
										  }) ;
						}

						else
						{
						  connect.query('INSERT INTO posters_counters SET id_poster_liked=? , likers_counters=? , dislikers_counters=? , comment_counters=? , add_date=?',[new_poster_insert.insertId,0,0,0,new Date()],(err,rows)=>{

										if(!err)
										{
											res.json(
											        {
											  status : true ,
											  error : "INSERT_SUCCESS" ,
											  message : rows
											        }) ;
										}
										else
										{
											res.json(
															{
												status : false ,
												error : "INSERT_ERROR" ,
												message : "Une erreur s'est produite , veuillez réessayer plutard."
															}) ;
										}

							}) ;
						}

					}) ;
				}
				else
				{
					res.json(
							{
								status : false ,
								error : "INSERT_ERROR" ,
								message : "Une erreur s'est produite lors la sauvegarde, veuillez réessayer plutard."
							}) ;
				}

			} ) ;
		}
		else
		{
			connect.query('INSERT INTO posters SET id_user=?,visibility=?,title=?,msg=?,status=?,unite=?,delais=?,addDate=?' ,
			[req.body.userId,req.body.visibility,req.body.title,req.body.msg,status,unite,delais,new Date()], (err,rows)=>{

				if(!err)
				{
					res.json(
							{
								status : true ,
								error : "INSERT_SUCCESS" ,
								message : "..."
							}) ;
				}
				else
				{
					res.json(
							{
								status : false ,
								error : "INSERT_ERROR" ,
								message : "Une erreur s'est produite lors la sauvegarde, veuillez réessayer plutard."
							}) ;
				}

			} ) ;
		}

	}) ;

}

exports.deleted = (req,res,next) =>{

	pool.getConnection((err,connect)=>{

		if(err) res.status(400).
			json({status : false ,
				message : "Erreur de connection à la base de donnée" ,
				error : "DB_ERROR"}) ;

		connect.query('DELETE FROM posters WHERE id=?',[req.params.id],(error,starus)=>{

			if(!error)
			{
				res.json(
							{
								status : true ,
								error : "DELETED_SUCCESS" ,
								message : "..."
							}) ;
			}
			else
			{
				res.json(
							{
								status : false ,
								error : "DELETED_ERREUR" ,
								message : "Suppression impossible, merci de réessayer plutard ."
							}) ;
			}

		}) ;

	}) ;

}

exports.update = (req,res,next) =>{

	const unite = req.body.unite ? req.body.unite : 'null';
	const delais = req.body.delais ? req.body.delais : 'null';
	const status = req.body.status ? req.body.status : 'null';

	pool.getConnection((err,connect)=>{

		if(err) res.status(400).
			json({status : false ,
				message : "Erreur de connection à la base de donnée" ,
				error : "DB_ERROR"}) ;

		connect.query('UPDATE posters SET visibility=?,title=?,msg=?,status=?,unite=?,delais=? WHERE id=?',
			[req.body.visibility,req.body.title,req.body.msg,status,unite,delais,req.params.id],
			(error,status)=>{

				if(error)
				{
					res.json(
							{
								status : false ,
								error : "UPDATE_ERREUR" ,
								message : "Mise à jour impossible, merci de réessayer plutard ."
							}) ;
				}

				else
				{
					res.json(
							{
								status : true ,
								error : "UPDATE_SUCESS" ,
								message : "..."
							}) ;
				}

			}) ;
	}) ;

}

exports.getOnPost = (req,res,next)=>{

	pool.getConnection((err,connect)=>{

		if(err)
			res.status(400).
			json({status : false ,
				message : "Erreur de connection à la base de donnée" ,
				error : "DB_ERROR"}) ;

		connect.query('SELECT * FROM posters WHERE id=?',[req.params.id],(error,rows)=>{


			if(!error)
			{
				res.json(
							{
								status : true ,
								error : "IS_FOUND" ,
								message : rows
							}) ;
			}
			else
			{
				res.json(
							{
								status : false ,
								error : "NO_FOUND" ,
								message : "Erreur, merci de réessayer plutard ."
							}) ;
			}


		}) ;
	});

}
