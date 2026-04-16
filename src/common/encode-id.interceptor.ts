import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import Hashids from 'hashids';
import { HASHID_SALT } from 'src/config';

const hashids = new Hashids(HASHID_SALT, 10);
function encodeId(id: number) {
  return hashids.encode(id);
}

@Injectable()
export class EncodeIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((data) => {
        const transform = (item: any) => {
          // 👇 convert Sequelize instance → plain object
          const obj = item?.toJSON ? item.toJSON() : item;

          if (obj?.id) {
            obj.id = encodeId(obj.id);
          }

          return obj;
        };

        if (Array.isArray(data)) {
          return data.map(transform);
        }

        return transform(data);
      }),
    );
  }
}
