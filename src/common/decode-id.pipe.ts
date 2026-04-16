import { Injectable, PipeTransform, ArgumentMetadata } from '@nestjs/common';
import Hashids from 'hashids';
import { HASHID_SALT } from 'src/config';

const hashids = new Hashids(HASHID_SALT, 10);

// 🔧 convert camelCase → snake_case
function toSnakeCase(str: string): string {
  return str
    .replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
    .toLowerCase();
}

// 🔍 check if key is ID-like
function isIdField(key: string): boolean {
  const snake = toSnakeCase(key);
  return key === 'id' || snake.endsWith('_id');
}

// 🔧 decode value
function decodeValue(value: any): any {
  if (typeof value !== 'string') return value;

  const decoded = hashids.decode(value);

  if (decoded.length) {
    return decoded;
  }

  return value; // keep original if not decodable
}

// 🔁 recursive transform
function transformDeep(data: any): any {
  if (data === null || data === undefined) return data;

  // Array
  if (Array.isArray(data)) {
    return data.map(transformDeep);
  }

  // Object
  if (typeof data === 'object') {
    const result: any = {};

    for (const key of Object.keys(data)) {
      const value = data[key];

      if (isIdField(key)) {
        result[key] = decodeValue(value);
      } else {
        result[key] = transformDeep(value);
      }
    }

    return result;
  }

  return data;
}

@Injectable()
export class DecodeIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // Only process incoming request data
    if (
      metadata.type === 'query' ||
      metadata.type === 'body' ||
      metadata.type === 'param'
    ) {
      return transformDeep(value);
    }

    // console.log({ value });

    return value;
  }
}
