import {
  Module,
  RequestMethod,
  type MiddlewareConsumer,
  type NestModule,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { BooksModule } from './books/books.module';
import { FirstMiddleware } from './middlewares/first/first.middleware';
import { SecondMiddleware } from './middlewares/second/second.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        // Utilisation de 127.0.0.1 pour contourner les problèmes de résolution localhost sur Windows
        host: configService.get<string>('DB_HOST') || '127.0.0.1',
        port: configService.get<number>('DB_PORT') || 3307,
        username: configService.get<string>('DB_USERNAME') || 'root',
        // On s'assure que si la variable est vide dans le .env, on envoie bien une chaîne vide
        password: configService.get<string>('DB_PASSWORD') ?? '',
        database: configService.get<string>('DB_NAME') || 'isids26',
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    TasksModule,
    BooksModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Middleware appliqué à toutes les routes
    consumer.apply(SecondMiddleware).forRoutes('*'); 
    
    // Middleware appliqué uniquement aux requêtes GET sur /tasks
    consumer.apply(FirstMiddleware).forRoutes({
      path: 'tasks',
      method: RequestMethod.GET,
    });
  }
}