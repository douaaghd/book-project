import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Roles } from './generics/role.enum';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    private jwtSer: JwtService
  ) {}

  async signUp(informations) {
    let newUserEntity = this.userRepo.create({
      email: informations.email,
      username: informations.username,
      role: informations.role || Roles.ROLE_USER,
      salt: await bcrypt.genSalt()
    });

    newUserEntity.password = await bcrypt.hash(
      informations.password,
      newUserEntity.salt
    );

    try {
      return await this.userRepo.save(newUserEntity);
    } catch {
      throw new ConflictException();
    }
  }

  async signIn(informations) {
    // 1. On récupère l'identifiant (soit email, soit username)
    // On vérifie les deux au cas où tu envoies l'un ou l'autre
    let identifiant = informations.email || informations.username;
    let password = informations.password;

    // 2. On cherche l'utilisateur
    let user = await this.userRepo.findOne({
      where: [
        { username: identifiant },
        { email: identifiant }
      ]
    });

    if (!user) {
      throw new NotFoundException("Identifiant inexistant");
    }

    // 3. Comparaison du mot de passe
    let resultMatching = await bcrypt.compare(password, user.password);

    if (!resultMatching) {
      // Conseil : change NotFoundException en UnauthorizedException plus tard
      throw new NotFoundException("Mot de passe erroné");
    }

    // 4. Génération du token
    let token = this.jwtSer.sign({
      id: user.id,
      role: user.role,
      username: user.username,
      email: user.email
    });

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      access_token: token
    };
}
}