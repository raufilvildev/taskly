export const constants: {
  displayMessageTime: number;
  appName: string;
  generalServerError: string;
  fields: { [key: string]: string };
  messages: { [key: string]: string };
} = {
  displayMessageTime: 3000,
  appName: 'Taskly',
  generalServerError: 'Ha ocurrido un error inesperado. Vuelve a intentarlo más tarde.',
  fields: {
    first_name: 'nombre',
    last_name: 'apellidos',
    birth_date: 'fecha de nacimiento',
    email: 'correo electrónico',
    username: 'usuario',
    password: 'contraseña',
    password_confirmation: 'confirmación de la contraseña',
  },
  messages: {
    required: 'es obligatorio',
    minlength: 'tiene que tener al menos 2 caracteres',
    maxlength: 'no puede tener más de 100 caracteres',
    email: 'no tiene un formato correcto',
    pattern:
      'debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula, un número y un carácter especial',
  },
};
