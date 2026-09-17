import { plainToInstance } from 'class-transformer';
import { IsBooleanString, IsNumberString, IsString, validateSync } from 'class-validator';

export class EnvironmentVariables {
  @IsString()
  DB_HOST!: string;

  @IsNumberString()
  DB_PORT!: string;

  @IsString()
  DB_USER!: string;

  @IsString()
  DB_PASSWORD!: string;

  @IsString()
  DB_NAME!: string;

  @IsString()
  NODE_ENV!: string;

  @IsBooleanString()
  ORM_SYNC!: string;

  @IsNumberString()
  SERVER_PORT!: string;
}

export function validateEnv(config: Record<string, unknown>): EnvironmentVariables {
  const validated = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: false,
  });
  const errors = validateSync(validated, { skipMissingProperties: false });
  if (errors.length > 0) {
    throw new Error(`Config validation failed: ${errors.toString()}`);
  }
  return validated;
}
