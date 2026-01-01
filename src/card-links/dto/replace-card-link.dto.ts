import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CardLinkInputDto {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  label?: string;

  @IsString()
  value: string;
}

export class ReplaceCardLinksDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CardLinkInputDto)
  links: CardLinkInputDto[];
}
