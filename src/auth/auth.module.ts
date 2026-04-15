import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JWT_SECRET } from 'src/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    UsersModule,
    // JWT Setup
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: JWT_SECRET,
        signOptions: {
          expiresIn: '1h',
        },
      }),
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
