import { IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateCardLinkDto {
  @IsString()
  @MaxLength(30)
  type: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  label?: string;

  @IsString()
  @MaxLength(255)
  value: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  position?: number;
}
