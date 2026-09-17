import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateRegistrationDto {
  @IsString()
  @MinLength(1)
  firstName!: string;

  @IsString()
  @MinLength(1)
  lastName!: string;

  @IsOptional()
  @IsString()
  profession?: string;

  @IsString()
  @MinLength(1)
  address1!: string;

  @IsOptional()
  @IsString()
  address2?: string;

  @IsString()
  @MinLength(1)
  postalCode!: string;

  @IsString()
  @MinLength(1)
  city!: string;

  @IsString()
  @MinLength(1)
  country!: string;

  @IsEmail()
  email!: string;

  @IsEmail()
  emailConfirm!: string;

  @IsBoolean()
  paintingDay!: boolean;

  @IsBoolean()
  photographyDay!: boolean;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  groupSize!: number;

  @IsOptional()
  @IsString()
  promoCode?: string;
}
