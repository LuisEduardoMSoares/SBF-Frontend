export function emailValidator(email: string)
{
  var validation = /\S+@\S+\.\S+/;
  return validation.test(email);
}