import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.userModel.create(createUserDto as any);
  }

  async findOne(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ where: { email } });
    if (!user) return null;
    return user.get({ plain: true }) as User;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.findAll({
      attributes: ['id', 'name', 'email'], // ONLY these will be returned
    });
  }

  async findById(id: number): Promise<User | null> {
    return this.userModel.findByPk(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ where: { email } });
  }

  async update(id: number, attrs: Partial<User>): Promise<[number, User[]]> {
    return this.userModel.update(attrs, {
      where: { id },
      returning: true, // Only works for PostgreSQL
    });
  }

  async remove(id: number): Promise<void> {
    const user = await this.findById(id);
    if (user) {
      await user.destroy();
    }
  }
}
