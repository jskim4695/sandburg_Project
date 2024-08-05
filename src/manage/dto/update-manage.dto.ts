import { PartialType } from '@nestjs/mapped-types';
import { CreateManageDto } from './create-manage.dto';

export class UpdateManageDto extends PartialType(CreateManageDto) {}
