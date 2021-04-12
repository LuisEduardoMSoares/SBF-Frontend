export function emailValidator(email)
{
  var validation = /\S+@\S+\.\S+/;
  return validation.test(email);
}