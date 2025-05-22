// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/user.entity';
import { Otp } from './otp.entity';
import { authenticator } from 'otplib';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Otp)
    private otpRepository: Repository<Otp>,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async forgotPassword(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      // Don't reveal if user doesn't exist for security
      return { message: 'If the email exists, a reset code has been sent' };
    }

    // Generate OTP
    const otpSecret = process.env.OTP_SECRET;
    if (!otpSecret) {
      throw new Error('OTP_SECRET environment variable is not set');
    }
    const otp = authenticator.generate(otpSecret);
    const expiresAt = new Date();
    expiresAt.setMinutes(
      expiresAt.getMinutes() +
        parseInt(process.env.OTP_EXPIRATION_MINUTES ?? '10'),
    );

    // Save OTP to database
    await this.otpRepository.save({
      email,
      otp,
      expiresAt,
    });

    // Send email with OTP
    await this.mailService.sendPasswordResetOtp(email, otp);

    return { message: 'If the email exists, a reset code has been sent' };
  }

  async verifyOtp(email: string, otp: string) {
    const otpRecord = await this.otpRepository.findOne({
      where: { email, otp },
      order: { createdAt: 'DESC' },
    });

    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    // Mark OTP as used
    await this.otpRepository.update(otpRecord.id, { used: true });

    return { valid: true };
  }

  async resetPassword(email: string, otp: string, newPassword: string) {
    // Verify OTP first
    await this.verifyOtp(email, otp);

    // Update password
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await this.userRepository.save(user);

    return { message: 'Password reset successfully' };
  }
}
