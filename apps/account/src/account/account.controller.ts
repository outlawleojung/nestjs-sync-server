import { Controller, Get, Post, Headers, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { ApiOperation } from '@nestjs/swagger';
import { RefreshTokenGuard } from '@lib/common/auth/guard/bearer-token.guard';
import { AuthService } from '@lib/common/auth/auth.service';

@Controller()
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  getHello(): string {
    return this.accountService.getHello();
  }

  /**
   * 액세스 토큰 재발급
   * @param rawToken
   * @returns accessToken
   */

  // @ApiOperation({ summary: '액세스 토큰 재발급 받기' })
  // @Post('token/access')
  // @UseGuards(RefreshTokenGuard)
  // async createTokenAccess(@Headers('authorization') rawToken: string) {
  //   console.log('token : ', rawToken);
  //   const token = this.authService.extractTokenFromHeader(rawToken, true);
  //
  //   const accessToken = await this.authService.rotateToken(token, false);
  //
  //   return { accessToken };
  // }
}
