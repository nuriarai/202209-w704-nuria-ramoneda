# Endpoints

- (POST) /users/login -> debe comprobar en base de datos si las credenciales son correctas, y en caso afirmativo devolver un token.

- (POST) /users/register -> debe crear un usuario (si no existe ya) con la contraseña encriptada.

- (GET) /items/list -> debe devolver los items del usuario, y sólo debe funcionar si el usuario se ha autentificado.
