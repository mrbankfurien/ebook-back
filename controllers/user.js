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

		if(err) res.status(400).
			json({status : false ,
				message : "Erreur de connection à la base de donnée" ,
				error : "DB_ERROR"}) ;

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
															connect.release() ;

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
	}) ;

} ;


exports.login = (req,res,next) =>{

	pool.getConnection((err , connect)=>{

		if(err) res.status(400).
			json({status : false ,
				message : "Erreur de connection à la base de donnée" ,
				error : "DB_ERROR"}) ;


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

						connect.release() ;

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

	}) ;

};

exports.reset = (req,res,next) =>{

	pool.getConnection((err,connect)=>{

		if(err) res.status(400).
			json({status : false ,
				message : "Erreur de connection à la base de donnée" ,
				error : "DB_ERROR"}) ;

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
					connect.release() ;

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

	})

} ;
