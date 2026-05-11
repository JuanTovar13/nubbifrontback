export type UserRole = "familia" | "gestor";// Tipo de dato para representar los roles de usuario en la aplicación, lo que permite a este tipo ser utilizado en diferentes partes de la aplicación para manejar la lógica relacionada con los roles de los usuarios, mejorando la gestión de usuarios en la aplicación al proporcionar una forma clara y estructurada de manejar los roles de los usuarios en el código

export interface RegisterDTO {// Interfaz para representar los datos necesarios para registrar un nuevo usuario, lo que permite a los componentes de esta pantalla enviar esta información en la solicitud HTTP al backend para realizar la operación de registro de un nuevo usuario, mejorando la gestión de datos al proporcionar una estructura clara para los datos necesarios en esta operación
  email: string;
  password: string;
  full_name: string;
  role?: UserRole;
}

export interface LoginDTO {// Interfaz para representar los datos necesarios para iniciar sesión de un usuario, lo que permite a los componentes de esta pantalla enviar esta información en la solicitud HTTP al backend para realizar la operación de inicio de sesión de un usuario, mejorando la gestión de datos al proporcionar una estructura clara para los datos necesarios en esta operación
  email: string;
  password: string;
}

export interface AuthSessionDTO {// Interfaz para representar la información de la sesión de autenticación de un usuario, lo que permite a los componentes de esta pantalla recibir esta información en la respuesta HTTP del backend después de realizar la operación de inicio de sesión o actualización del token de autenticación, mejorando la gestión de datos al proporcionar una estructura clara para los datos relacionados con la sesión de autenticación del usuario
  access_token: string;
  refresh_token: string;
  expires_at?: number;// Campo opcional para representar la fecha de expiración del token de acceso, lo que permite a los componentes que utilicen esta información manejar la lógica relacionada con la expiración del token de acceso de manera adecuada al proporcionar esta información cuando esté disponible, mejorando la gestión de autenticación en la aplicación al proporcionar información clara sobre la expiración del token de acceso para que los componentes puedan manejar esta información de manera adecuada
}

export interface AuthResponse {// Interfaz para representar la respuesta de autenticación de un usuario, lo que permite a los componentes de esta pantalla recibir esta información en la respuesta HTTP del backend después de realizar la operación de inicio de sesión o actualización del token de autenticación, mejorando la gestión de datos al proporcionar una estructura clara para los datos relacionados con la autenticación del usuario
  user: {
    id: string;
    email: string;
    role: UserRole;
    full_name: string;
  };
  session: AuthSessionDTO;// Campo para representar la información de la sesión de autenticación del usuario, lo que permite a los componentes que utilicen esta información manejar la lógica relacionada con la sesión de autenticación de manera adecuada al proporcionar esta información en la respuesta de autenticación, mejorando la gestión de autenticación en la aplicación al proporcionar información clara sobre la sesión de autenticación del usuario para que los componentes puedan manejar esta información de manera adecuada
}

export interface JwtPayload {// Interfaz para representar la información contenida en el token JWT de autenticación, lo que permite a los componentes que utilicen esta información manejar la lógica relacionada con la autenticación de manera adecuada al proporcionar una estructura clara para los datos contenidos en el token JWT, mejorando la gestión de autenticación en la aplicación al proporcionar información clara sobre los datos contenidos en el token JWT para que los componentes puedan manejar esta información de manera adecuada
  sub: string;
  email: string;
  role: UserRole;
}
