import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserEntity) 
    private userRepo: Repository<UserEntity>,
    private configSer: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // On récupère la clé secrète depuis le ConfigService (via .env)
      secretOrKey: configSer.get<string>('SECRET_KEY'),
    });
  }

  async validate(payload: any) {
    // Payload contient les données décodées du token (ex: id, email, role)
    console.log('Payload reçu:', payload);

    const user = await this.userRepo.findOne({ where: { id: payload.id } });

    if (!user) {
      // Si l'utilisateur a été supprimé de la DB mais possède encore un token valide
      throw new UnauthorizedException('Utilisateur non trouvé');
    }

    console.log('Utilisateur trouvé:', user);

    // Ce qui est retourné ici est attaché à l'objet Request (req.user)
    return { 
      userId: user.id, 
      userRole: user.role,
      username: user.username 
    };
  }
}