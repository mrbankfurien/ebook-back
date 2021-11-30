/*

	telesign : developersmens@gmail.com ,
	mdp : BanksFurien@5166
*/

// remotemysql :mdp : WwwHtaZ$@2R6gE2 , email : developersmens




const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../dbase/config');



exports.signup = (req,res,next) =>{

	pool.getConnection((err,connect) =>{

		if(err) {
			res.status(400).
			json({status : false ,
				message : "Erreur de connection à la base de donnée" ,
				error : "DB_ERROR"}) ;
		}

		else{
			connect.query('SELECT * FROM users WHERE email=?' , [req.body.email] , (err,rows)=>{
			if(!err)
			{
				if(rows.length==0)
				{

					connect.query('SELECT * FROM users WHERE number=?' , [req.body.numbers] , (err , rows)=>{

						if(!err)
						{
							if(rows.length==0)
							{
								connect.query('SELECT * FROM users WHERE pseudonyme=?' , [req.body.pseudonyme] , (err , rows)=>{

									if(!err)
									{
										if(rows.length==0)
										{
											bcrypt.hash(req.body.passwords,10).
											then(hash=>{

												connect.query('INSERT INTO users SET username = ? , email = ? , number = ? , pseudonyme = ? , gender = ? , passwords = ? , token = ? , add_date = ?' ,
												[req.body.username,req.body.email,req.body.numbers,req.body.pseudonyme,req.body.gender , hash , req.body.token ,new Date()] , (err , rows)=>{


														if(!err)
														{
															res.json(
															{
																status : true ,
																error : "INSERT_SUCCESS" ,
																message : " Vous avez  étè enregisté avec success, connectez-vous et profité pleinement des differents avantages de Banks Ebook ."
															}) ;
														}
														else
														{
															res.json(
															{
																status : false ,
																error : "INSERT_ERROR" ,
																message : "Une erreur s'est produite lors de votre enregistrement, veuillez réessayer plutard."
															}) ;
														}

												}) ;

											}).catch(err => res.json( {
												status : false ,
												error : "HASH_ERROR",
												message : "Erreur lors du cryptage du mot de passe "
											})) ;
										}
										else
										{
											res.json(
											{
												status : false ,
												error : "PSEUDO_IS_USED" ,
												message : "Ce pseudonyme n'est plus disponible, utilisé s'en un autre ."
											}) ;
										}
									}
									else
									{
										res.json(
										{
											status : false ,
											error : "REQUEST_ERROR" ,
											message : "Une erreur est survenu lors de la vérification des informations ."
										}) ;
									}

								}) ;
							}
							else
							{
								res.json(
								{
									status : false ,
									error : "NUMBER_IS_USED" ,
									message : "Le contact renseigné est déjà connu de nos registres, veuillez réessayer ."
								}) ;
							}
						}
						else
						{
							res.json(
							{
								status : false ,
								error : "REQUEST_ERROR" ,
								message : "Une erreur est survenu lors de la vérification des informations ."
							}) ;
						}

					}) ;

				}
				else
				{
					res.json(
					{
						status : false ,
						error : "EMAIL_IS_USED" ,
						message : "L'email renseigné est déjà connu de nos registres, veuillez réessayer ."
					}) ;
				}
			}
			else
			{
				res.json(
					{
						status : false ,
						error : "REQUEST_ERROR" ,
						message : "Une erreur est survenu lors de la vérification des informations ."
					}) ;
			}
		})
		}
	}) ;

} ;


exports.login = (req,res,next) =>{

	pool.getConnection((err , connect)=>{

		if(err) {
			res.status(400).
			json({status : false ,
				message : "Erreur de connection à la base de donnée" ,
				error : "DB_ERROR"}) ;
		}


		else{
			connect.query('SELECT * FROM users WHERE email=?' , [req.body.email] , (err , user)=>{


			if(err){

				res.json(
					{
						status : false ,
						error : "REQUEST_ERROR" ,
						message : "Une erreur est survenu lors de la vérification de vos informations ."
					}) ;
			}

			else{

				if(user.length!=0)
				{
					bcrypt.compare(req.body.passwords , user[0].passwords).
					then(valid =>{

						if(!valid){
							res.json({
								status : false ,
								error : "PASSWORD_ERROR" ,
								message : "Votre mot de passe est incorrect, veuillez réessayer ."
							})
						}

						else
						{
							res.json({

								status : true,
								userId : user[0].token ,
								data : user[0] ,
								token : jwt.sign(
										{userId : user[0].token} ,
										'EBOOK_BANKS_KEY',
										{ expiresIn: '48h' }
									)

							}) ;

						}

					}).catch(()=> res.json({
						status : false ,
						error : "PASSWORD_ERROR" ,
						message : "Votre mot de passe est incorrect, veuillez réessayer ."
					}))
				}
				else
				{
					res.json(
					{
						status : false ,
						error : "MAIL_ERROR" ,
						message : "Addresse email non reconnu, veuillez réessayer ."
					}) ;
				}

			}


		}) ;
		}

	}) ;

};

exports.reset = (req,res,next) =>{

	pool.getConnection((err,connect)=>{

		if(err) {
			res.status(400).
			json({status : false ,
				message : "Erreur de connection à la base de donnée" ,
				error : "DB_ERROR"}) ;
		}

		else{
			connect.query('SELECT * FROM users WHERE email=?',[req.body.email],(err,user)=>{

			if(err)
			{
				res.json(
					{
						status : false ,
						error : "REQUEST_ERROR" ,
						message : "Une erreur est survenu lors de la vérification de vos informations ."
					}) ;
			}

			else
			{
				if(user.length!=0)
				{
					res.json(
					{
						status : true ,
						error : "IS_FOUND" ,
						message : "Ok ..."
					}) ;
				}
				else
				{
					res.json(
					{
						status : false ,
						error : "MAIL_ERROR" ,
						message : "Addresse email non reconnu, veuillez réessayer ."
					}) ;
				}
			}

		}) ;
		}

	})

} ;

exports.updateData = (req,res,next) =>{


	pool.getConnection((err,connect)=>{

		if(err) {
			res.status(400).
			json({status : false ,
				message : "Erreur de connection à la base de donnée" ,
				error : "DB_ERROR"}) ;
		}
		else{

			connect.query("SELECT * FROM users WHERE token!=?",[req.body.token],(err,rows)=>{

				errorTable = { 	
					'email'  : {'status':false , 'msg':''} ,
					'pseudo' : {'status':false , 'msg':''} ,
					'number' : {'status':false , 'msg':''},
				} ;

				rows.forEach((el)=>{
					if(el.email==req.body.email){
						errorTable['email'] = {'status':true , 'msg':'Cet addresse email appartient déjà à un autre internaute .'} ;
					}
				}) ;

				if(errorTable['email']['status']){
					res.json(
                      {
                        status : false ,
                        error : "EMAIL_ERROR" ,
                        message : errorTable['email']['msg']
                      }) ;
				}
				else
				{
					rows.forEach((el)=>{
						if(el.pseudonyme==req.body.pseudonyme){
							errorTable['pseudo'] = {'status':true , 'msg':'Pseudonyme non disponible, veuillé utiliser un autre .'} ;
						}
					}) ;

					if(errorTable['pseudo']['status']){
						res.json(
	                      {
	                        status : false ,
	                        error : "PSEUDO_ERROR" ,
	                        message : errorTable['pseudo']['msg']
	                      }) ;
					}
					else
					{
						rows.forEach((el)=>{
							if(el.number==req.body.numbers){
								errorTable['number'] = {'status':true , 'msg':'Ce contact appartient déjà à un autre internaute .'} ;
							}
						}) ;

						

						if(errorTable['number']['status']){
							res.json(
		                      {
		                        status : false ,
		                        error : "NUMBER_ERROR" ,
		                        message : errorTable['number']['msg']
		                      }) ;
						}
						else
						{
							connect.query("UPDATE users SET username=?,email=?,number=?,pseudonyme=? WHERE token=?",[req.body.username,req.body.email,req.body.numbers,req.body.pseudonyme,req.body.token],(err,success)=>{

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
				                        message : "to update"
				                      }) ;
								}

							}) ;
						}

					}
				}
				

			}) ;


		}

	}) ;



}

/*exports.dataUser = (req,res,next) => {

	pool.getConnection((err,connect)=>{

		if(err) {
			res.status(400).
			json({status : false ,
				message : "Erreur de connection à la base de donnée" ,
				error : "DB_ERROR"}) ;
		}
		else{
			connect.query('SELECT * FROM users  WHERE token=?',[req.params.token],(err,user)=>{

				if(err)
				{
					res.json(
					{
						status : false ,
						error : "REQUEST_ERROR" ,
						message : "Une erreur est survenu lors de la vérification de vos informations ."
					}) ;
				}
				else
				{
					res.json(
					{
						status : true ,
						error : "IS_SUCCESS" ,
						message : user[0]
					}) ;
				}
			});
		}

	}) ;

}
*/

exports.updatePassword= (req,res,next) =>{


	pool.getConnection((err,connect)=>{

		if(err) {
			res.status(400).
			json({status : false ,
				message : "Erreur de connection à la base de donnée" ,
				error : "DB_ERROR"}) ;
		}
		else
		{
			connect.query('SELECT * FROM users WHERE token=?',[req.params.token],(err,user)=>{

				if(err)
				{
					res.json(
					{
						status : false ,
						error : "REQUEST_ERROR" ,
						message : "Une erreur est survenu lors de la vérification de vos informations ."
					}) ;
				}
				else
				{
					bcrypt.compare(req.body.lastPassword , user[0].passwords).
					then(valid =>{

						if(!valid){
							res.json({
								status : false ,
								error : "LAST_PASSWORD_ERROR" ,
								message : "Votre ancien mot de passe est incorrect ."
							})
						}

						else
						{
							bcrypt.hash(req.body.newPassword,10).
											then(hash=>{

												connect.query('UPDATE users SET passwords=? WHERE token=?' ,
												[hash,req.params.token] , (err , rows)=>{


														if(!err)
														{
															res.json(
															{
																status : true ,
																error : "UPDATE_SUCCESS" ,
																message : "Votre mot de passe a belle et bien été mise à jour ."
															}) ;
														}
														else
														{
															res.json(
															{
																status : false ,
																error : "UPDATE_ERROR" ,
																message : "Une erreur s'est produite lors de la mise à jour, veuillez réessayer plutard."
															}) ;
														}

												}) ;

											}).catch(err => res.json( {
												status : false ,
												error : "HASH_ERROR",
												message : "Erreur lors du cryptage du mot de passe "
											})) ;
						}

					}).catch(()=> res.json({
						status : false ,
						error : "PASSWORD_ERROR" ,
						message : "Votre mot de passe est incorrect, veuillez réessayer ."
					}))
				}

			}) ;
		}

	}) ;

}