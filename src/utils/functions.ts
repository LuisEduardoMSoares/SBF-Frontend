export function emailValidator(email: string)
{
  var validation = /\S+@\S+\.\S+/;
  return validation.test(email);
}

export function passwordValidator (password: string, confirmPassword: string) { 
  if(password && confirmPassword) {
    return password == confirmPassword 
  }
}