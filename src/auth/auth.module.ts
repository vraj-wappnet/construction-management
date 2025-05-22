// // src/auth/auth.module.ts
// import { Module } from '@nestjs/common';
// import { JwtModule } from '@nestjs/jwt';
// import { PassportModule } from '@nestjs/passport';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { User } from '../users/user.entity';
// import { AuthService } from './auth.service';
// import { JwtStrategy } from './jwt.strategy';
// import { AuthController } from './auth.controller';
// import { UsersModule } from '../users/users.module';
// import { MailModule } from '../mail/mail.module';
// import { Otp } from './otp.entity';
// import { ConfigModule } from '@nestjs/config'; // Import ConfigModule

// @Module({
//   imports: [
//     ConfigModule, // Add ConfigModule here
//     TypeOrmModule.forFeature([User, Otp]),
//     PassportModule.register({ defaultStrategy: 'jwt' }),
//     JwtModule.register({
//       secret: process.env.JWT_SECRET,
//       signOptions: { expiresIn: process.env.JWT_EXPIRATION },
//     }),
//     UsersModule,
//     MailModule,
//   ],
//   providers: [AuthService, JwtStrategy],
//   controllers: [AuthController],
//   exports: [JwtStrategy, PassportModule],
// })
// export class AuthModule {}
// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { User } from '../users/user.entity';
import { Otp } from './otp.entity';
import { MailService } from '../mail/mail.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Otp]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, JwtStrategy, MailService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}