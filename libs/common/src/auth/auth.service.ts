import {
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from '@lib/entity/repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import { bcryptjs } from 'bcryptjs';
import { UserModel } from '@lib/entity';
import { ConfigService } from '@nestjs/config';
import {
  ENV_ACCESS_TOKEN_EXPIRESIN,
  ENV_JWT_SECRET,
  ENV_REFRESH_TOKEN_EXPIRESIN,
} from '@lib/common/constants/env-keys.const';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private readonly logger = new Logger(AuthService.name);

  extractTokenFromHeader(header: string, isBearer: boolean) {
    const splitToken = header.split(' ');
    const prefix = isBearer ? 'Bearer' : 'Basic';
    if (splitToken.length !== 2 || splitToken[0] !== prefix) {
      return 'error';
    }

    const token = splitToken[1];

    return token;
  }

  decodeBasicToken(base64String: string) {
    const decoded = Buffer.from(base64String, 'base64').toString('utf8');

    const split = decoded.split(':');

    if (split.length !== 2) {
      throw new UnauthorizedException('잘못된 로그인 토큰 입니다.');
    }

    const email = split[0];
    const password = split[1];

    return {
      email,
      password,
    };
  }

  signToken(
    user: Pick<UserModel, 'id' | 'name' | 'email'>,
    isRefreshToken: boolean,
  ) {
    const payload = {
      sub: user.id,
      nickname: user.name,
      email: user.email,
      type: isRefreshToken ? 'refresh' : 'access',
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>(ENV_JWT_SECRET),
      expiresIn: isRefreshToken
        ? this.configService.get<number>(ENV_REFRESH_TOKEN_EXPIRESIN)
        : this.configService.get<number>(ENV_ACCESS_TOKEN_EXPIRESIN),
    });
  }

  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get<string>(ENV_JWT_SECRET),
      });
    } catch (e) {
      console.log(e.toString());
      throw new UnauthorizedException('토큰이 만료 됐거나 유효하지 않습니다.');
    }
  }

  /**
   * 토큰 재발급
   * @param token
   * @param isRefreshToken
   * @returns
   */
  async rotateToken(token: string, isRefreshToken: boolean) {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: this.configService.get<string>(ENV_JWT_SECRET),
      });

      if (decoded.type !== 'refresh') {
        throw new UnauthorizedException(
          '토큰 재발급은 Refresh 토큰으로만 가능합니다.',
        );
      }

      // 데이터베이스에 있는 토큰과 비교
      // const member = await this.memberRepository.findOne({
      //   where: {
      //     id: decoded.sub,
      //   },
      // });
      const user = await this.userRepository.findByUserId(decoded.sub);

      const validToken = await bcryptjs.compareSync(token, user.refreshToken);
      console.log('validToken: ', validToken);
      if (!validToken) {
        throw new UnauthorizedException('Refresh 토큰이 유효하지 않습니다.');
      }

      return this.signToken(
        {
          ...decoded,
        },
        isRefreshToken,
      );
    } catch (e) {
      console.log(e.toString());
      throw new UnauthorizedException('토큰이 만료 됐거나 유효하지 않습니다.');
    }
  }

  /**
   * Refresh Token 데이터베이스에 저장
   * @param token
   */
  async saveRefreshToken(token) {
    const result = this.verifyToken(token);

    // 토큰 암호화 설정
    const hashedRefreshToken = await bcryptjs.hash(token, 12);

    try {
      const user = new UserModel();
      user.id = result.sub;
      user.refreshToken = hashedRefreshToken;

      await this.userRepository.updateUser(user);
    } catch (e) {
      console.log(e.toString());
      throw new ForbiddenException('Refresh 토큰 DB 저장 실패');
    }
  }

  async loginUser(user: Pick<UserModel, 'id' | 'name' | 'email'>) {
    const refreshToken = this.signToken(user, true);

    await this.saveRefreshToken(refreshToken);

    return {
      accessToken: this.signToken(user, false),
      refreshToken,
    };
  }

  async validRefreshToken(token: string) {
    const result = this.verifyToken(token);

    const user = await this.userRepository.findByUserId(result.sub);

    const validToken = await bcryptjs.compareSync(token, user.refreshToken);

    if (!validToken) {
      throw new UnauthorizedException('Refresh 토큰이 유효하지 않습니다.');
    }

    return user;
  }

  async authenticateWithEmailAndPassword(
    user: Pick<UserModel, 'email' | 'password'>,
  ) {
    const email = user.email;
    const exUser = await this.userRepository.findByEmail(email);

    if (!exUser) {
      this.logger.error('패사용자를 찾을 수 없음');
      throw new Error('사용자를 찾을 수 없음');
    }

    const validPassword = await bcryptjs.compareSync(
      user.password,
      exUser.password,
    );

    if (!validPassword) {
      this.logger.error('패스워드가 일치 하지 않음');
      throw new Error('패스워드가 일치 하지 않음');
    }

    const newUser = await this.userRepository.findByUserId(exUser.id);

    return newUser;
  }
}
