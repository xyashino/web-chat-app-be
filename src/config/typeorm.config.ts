import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export class TypeormConfig {
  static getOrmConfig(configService: ConfigService): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: configService.get<string>('DB_HOST'),
      port: configService.get<number>('DB_PORT'),
      username: configService.get<string>('DB_USERNAME'),
      password: configService.get<string>('DB_PASSWORD'),
      database: configService.get<string>('DATABASE'),
      entities: [
        'dist/**/**/**/*.entity{.ts,.js}',
        'dist/**/**/*.entity{.ts,.js}',
        'dist/**/*.entity{.ts,.js}',
      ],
      bigNumberStrings: false,
      logging: configService.get<boolean>('DB_LOGGING'),
      migrations: ['dist/migration/*.js'],
      synchronize: configService.get<boolean>('DB_SYNCHRONIZE'),
      autoLoadEntities: true,
      extra: {
        decimalNumbers: true,
      },
    };
  }
}
export const typeormConfigAsync: TypeOrmModuleAsyncOptions = {
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => TypeormConfig.getOrmConfig(configService),
  inject: [ConfigService],
};
