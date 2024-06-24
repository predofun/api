import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/user.dto';
import { User } from '../user/user.schema';
import { BaseHelper } from 'src/common/utils/helper';
import { LoginDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(payload: CreateUserDto): Promise<User> {
    return await this.userService.createUser(payload);
  }

  async login(payload: LoginDto) {
    const { email, type = 'local', password } = payload;

    const user = await this.userService.getUserByEmailIncludePassword(email);

    if (!user) {
      throw new BadRequestException('Invalid Credentials');
    }

    const passwordMatch = await BaseHelper.compareHashedData(
      password,
      user.password,
    );

    if (!passwordMatch) {
      throw new BadRequestException('Incorrect Password');
    }

    const token = this.jwtService.sign({ id: user._id }, { expiresIn: '7d' });

    return {
      ...user.toJSON(),
      password: null,
      accessToken: token,
    };
  }

  async googleLogin(payload: any) {
    // Your Google OAuth 2.0 client ID
    const { googleToken } = payload;
    const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID';
    const client = new OAuth2Client(CLIENT_ID);

    try {
      const ticket = await client.verifyIdToken({
        idToken: googleToken,
        audience: CLIENT_ID, // Specify the CLIENT_ID of your app
      });

      const payload = ticket.getPayload();
      const userid = payload['sub']; // Google user ID
      const email = payload['email'];

      const user = await this.userService.getUserByEmailIncludePassword(email);

      if (!user) {
        throw new BadRequestException('Invalid Credentials');
      }
      const token = this.jwtService.sign({ id: user._id }, { expiresIn: '7d' });

      return {
        ...user.toJSON(),
        accessToken: token,
      };
    } catch (error) {
      throw new BadRequestException('Invalid Credentials');
    }
  }
}
