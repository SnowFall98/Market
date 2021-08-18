/*=============================================
Exportamos la ruta para tomar imágenes
=============================================*/
export let Path = {

	url: 'http://localhost:4200/assets/'

	/*Cuando necestiemos trabajar con certificado SSL (registro o ingreso con facebook)
	comentamos la linea 6 y quitamos el comentario de la linea 10. Revisar el README.md para más información*/
	//url: 'https://localhost:4200/assets/'

}

/*=============================================
Exportamos el endPoint de la APIREST de Firebase
=============================================*/
export let Api = {

	url: 'https://market-place-363dc-default-rtdb.firebaseio.com/'

}

/*=============================================
Exportamos el endPoint para el registro de usuarios en Firebase Authentication
=============================================*/

export let Register = {

	url: 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBR9IUBZFVT4l1shmmdo1FDELSCOlER3zw'
}

/*=============================================
Exportamos el endPoint para el ingreso de usuarios en Firebase Authentication
=============================================*/

export let Login = {

	url: 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBR9IUBZFVT4l1shmmdo1FDELSCOlER3zw'
}

/*=============================================
Exportamos el endPoint para enviar verificación de correo electrónico
=============================================*/

export let SendEmailVerification = {

	url: 'https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyBR9IUBZFVT4l1shmmdo1FDELSCOlER3zw'

}

/*=============================================
Exportamos el endPoint para confirmar email de verificación
=============================================*/

export let ConfirmEmailVerification = {

	url: 'https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyBR9IUBZFVT4l1shmmdo1FDELSCOlER3zw'

}

/*=============================================
Exportamos el endPoint para tomar la data del usuario en Firebase auth
=============================================*/

export let GetUserData = {

	url: 'https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyBR9IUBZFVT4l1shmmdo1FDELSCOlER3zw'

}

/*=============================================
Exportamos el endPoint para Resetear la contraseña
=============================================*/

export let SendPasswordResetEmail = {

	url: 'https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyBR9IUBZFVT4l1shmmdo1FDELSCOlER3zw'
   
}

/*=============================================
Exportamos el endPoint para confirmar el cambio de la contraseña
=============================================*/

export let VerifyPasswordResetCode = {

	url: 'https://identitytoolkit.googleapis.com/v1/accounts:resetPassword?key=AIzaSyBR9IUBZFVT4l1shmmdo1FDELSCOlER3zw'

}

/*=============================================
Exportamos el endPoint para enviar la contraseña
=============================================*/

export let ConfirmPasswordReset = {

	url:'https://identitytoolkit.googleapis.com/v1/accounts:resetPassword?key=AIzaSyBR9IUBZFVT4l1shmmdo1FDELSCOlER3zw'

}

/*=============================================
Exportamos el endPoint para cambiar la contraseña
=============================================*/

export let ChangePassword = {

	url:'https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyBR9IUBZFVT4l1shmmdo1FDELSCOlER3zw'
}

/*=============================================
Exportamos el endPoint del servidor para administrar archivos
=============================================*/

export let Server = {

	url:'http://localhost/Market/src/assets/img/index.phpkey=AIzaSyBR9IUBZFVT4l1shmmdo1FDELSCOlER3zw'
}
