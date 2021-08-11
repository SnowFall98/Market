/*=============================================
Exportamos la ruta para tomar imágenes
=============================================*/
export let Path = {

	url: 'http://localhost:4200/assets/'

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