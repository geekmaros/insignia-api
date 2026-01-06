import { IsObject, IsOptional, IsString } from 'class-validator';

export class CreateCardAppearanceDto {
  @IsOptional()
  @IsString()
  theme?: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;

  @IsOptional()
  @IsObject()
  config?: Record<string, any>;
}
