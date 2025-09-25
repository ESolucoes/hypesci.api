import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsStringOrStringArray(options?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsStringOrStringArray',
      target: object.constructor,
      propertyName,
      options,
      validator: {
        validate(value: any) {
          return typeof value === 'string' || (Array.isArray(value) && value.every(v => typeof v === 'string'));
        }
      }
    });
  };
}
