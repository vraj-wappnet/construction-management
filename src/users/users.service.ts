import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import { UserRole } from './user.entity';
import { CloudinaryService } from 'src/documents/cloudinary.service';
import { Logger } from '@nestjs/common';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(
    createUserDto: CreateUserDto,
    file?: Express.Multer.File,
  ): Promise<User> {
    this.logger.log(`Creating user with email: ${createUserDto.email}`);

    // Explicitly map DTO to entity to avoid type issues
    const user = this.usersRepository.create({
      email: createUserDto.email,
      password: await bcrypt.hash(createUserDto.password, 10),
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      role: createUserDto.role,
      phone: createUserDto.phone,
      company: createUserDto.company,
      profilePicture: null,
    });

    if (file) {
      this.logger.log(
        `Uploading profile picture for user: ${createUserDto.email}`,
      );
      if (!file.mimetype.match(/image\/(jpeg|png|gif)/)) {
        this.logger.error(`Invalid file type: ${file.mimetype}`);
        throw new BadRequestException(
          'Profile picture must be an image (JPEG, PNG, or GIF)',
        );
      }
      const folder = `users/${user.id}/profile`;
      user.profilePicture = await this.cloudinaryService.uploadFile(
        file,
        folder,
        'image',
      );
      this.logger.log(`Profile picture uploaded: ${user.profilePicture}`);
    }

    const savedUser = await this.usersRepository.save(user);
    this.logger.log(`User created with ID: ${savedUser.id}`);
    return savedUser;
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    file?: Express.Multer.File,
  ): Promise<User> {
    this.logger.log(`Updating user with ID: ${id}`);
    const user = await this.findOne(id);

    if (updateUserDto.password) {
      if (!updateUserDto.currentPassword) {
        throw new BadRequestException(
          'Current password is required to update password',
        );
      }
      const isPasswordValid = await bcrypt.compare(
        updateUserDto.currentPassword,
        user.password,
      );
      if (!isPasswordValid) {
        throw new BadRequestException('Current password is incorrect');
      }
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    if (file) {
      this.logger.log(`Uploading new profile picture for user ID: ${id}`);
      if (!file.mimetype.match(/image\/(jpeg|png|gif)/)) {
        this.logger.error(`Invalid file type: ${file.mimetype}`);
        throw new BadRequestException(
          'Profile picture must be an image (JPEG, PNG, or GIF)',
        );
      }
      const folder = `users/${id}/profile`;
      user.profilePicture = await this.cloudinaryService.uploadFile(
        file,
        folder,
        'image',
      );
      this.logger.log(`New profile picture uploaded: ${user.profilePicture}`);
    } else if (updateUserDto.profilePicture === 'null') {
      user.profilePicture = null; // Allow clearing profile picture
      this.logger.log(`Profile picture cleared for user ID: ${id}`);
    } else {
      user.profilePicture = user.profilePicture || null;
    }

    Object.assign(user, updateUserDto);
    const updatedUser = await this.usersRepository.save(user);
    this.logger.log(
      `User updated with ID: ${id}, profilePicture: ${updatedUser.profilePicture}`,
    );
    return updatedUser;
  }

  async remove(id: number): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async getContractors(): Promise<User[]> {
    return this.usersRepository.find({
      where: { role: UserRole.CONTRACTOR },
    });
  }

  async getSiteEngineers(): Promise<User[]> {
    return this.usersRepository.find({
      where: { role: UserRole.SITE_ENGINEER },
    });
  }
}
