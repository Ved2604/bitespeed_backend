import { PartialType } from '@nestjs/mapped-types';
import { CreateIdentifyDto } from './create-identify.dto';

export class UpdateIdentifyDto extends PartialType(CreateIdentifyDto) {}
