import { PartialType } from '@nestjs/mapped-types';
import { CreateCardAppearanceDto } from './create-card-appearance.dto';

export class UpdateCardAppearanceDto extends PartialType(CreateCardAppearanceDto) {}
