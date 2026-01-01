import { ArrayNotEmpty, IsArray, IsInt } from 'class-validator';

export class ReorderCardLinkDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  orderedLinkIds: number[];
}
