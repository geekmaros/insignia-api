import { Optional } from '@nestjs/common';
import { IsString } from 'class-validator';

export class CreateCardDto {
  @IsString()
  displayName: string;

  @IsString()
  @Optional()
  title?: string;

  @IsString()
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
  company?: string;

  @IsString()
  @Optional()
  headline?: string;
}
