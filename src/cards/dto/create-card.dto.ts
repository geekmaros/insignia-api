import { Optional } from '@nestjs/common';
import {
  IsBoolean,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateCardDto {
  @IsString()
  @Length(1, 100)
  displayName: string;

  @IsString()
  @Optional()
  @Length(1, 80)
  title?: string;

  @IsString()
  @Length(3, 60)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: 'slug must be kebab-case' })
  slug: string;

  @IsString()
  @Optional()
  prefix?: string;

  @IsString()
  @Optional()
  suffix?: string;

  @IsString()
  @Optional()
  accreditation?: string;

  @IsString()
  @Optional()
  department?: string;

  @IsString()
  @Optional()
  @Length(1, 100)
  company?: string;

  @IsString()
  @Optional()
  headline?: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
