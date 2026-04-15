import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import Hashids from 'hashids';

const hashids = new Hashids('your-salt', 10);
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
