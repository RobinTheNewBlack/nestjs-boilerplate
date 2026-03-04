import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const authServerUrl = process.env.KEYCLOAK_AUTH_SERVER_URL;
    const realm = process.env.KEYCLOAK_REALM;

    super({
      secretOrKeyProvider: passportJwtSecret({
        jwksUri: `${authServerUrl}/realms/${realm}/protocol/openid-connect/certs`,
        cache: true,
        rateLimit: true,
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: process.env.KEYCLOAK_CLIENT_ID,
      issuer: `${authServerUrl}/realms/${realm}`,
      algorithms: ['RS256'],
    });
  }

  validate(payload: Record<string, any>) {
    return {
      sub: payload.sub,
      email: payload.email,
      username: payload.preferred_username,
      roles: (payload.realm_access?.roles ?? []) as string[],
    };
  }
}
