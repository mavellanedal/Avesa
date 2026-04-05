export const ErrorMessages = {
  isEmail: 'El campo $property debe ser una dirección de correo electrónico',
  isNotEmpty: 'El campo $property no debe estar vacío',
  isNumber: 'El campo $property debe ser un número',
  isPhoneNumber: 'El campo $property debe ser un número de teléfono válido',
  isString: 'El campo $property debe ser una cadena de texto',
  maxLength:
    'El campo $property debe tener como máximo $constraint1 caracteres',
  minLength: 'El campo $property debe tener al menos $constraint1 caracteres',
  isIp: 'El campo $property debe ser una dirección IP válida',
  isDate: 'El campo $property debe ser una fecha válida',
  isBoolean: 'El campo $property debe ser un valor booleano',
  isEnum: 'El valor seleccionado para $property no es válido',
};

Object.freeze(ErrorMessages);
