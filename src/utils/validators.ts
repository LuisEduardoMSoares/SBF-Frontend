export const validatorsPatternList = {
  email: /([a-z]){1,}([a-z0-9._-]){1,}([@]){1}([a-z]){2,}([.]){1}([a-z]){2,}([.]?){1}([a-z]?){2,}$/,
  phone: /([0-9]){10,11}/,
  cnpj: /([0-9]){14,14}/,
  name: /([0-9,A-Z,a-z, ]){3,64}/,
  productSize: /([A-Z,a-z,0-9]){1,2}/
}

export function validatePattern(expressionRegex: RegExp, value: any) {
  return expressionRegex.test(value);
}