export function emailValidator(email: string) {
  var validation = /\S+@\S+\.\S+/;
  return validation.test(email);
}

export function numbersOnlyCNPJ(value: string) {
  return value.replaceAll('.', '').replaceAll('/', '').replaceAll('-');
}