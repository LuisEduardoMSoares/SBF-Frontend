export function emailValidator(email: string) {
  var validation = /\S+@\S+\.\S+/;
  return validation.test(email);
}

export function passwordValidator (password: string, confirmPassword: string) { 
  if(password && confirmPassword) {
    return password == confirmPassword 
  }
}

export function numbersOnlyCNPJ(value: string) {
  return value.replace(/^[0-9]]/ig, '')
}