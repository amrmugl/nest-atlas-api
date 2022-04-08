import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AmenitiesService } from './amenities.service';
import { CreateAmenityDto } from './dto/create-amenity.dto';
import { ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators';
import { Hotel, Amenity } from '@prisma/client';

@ApiTags('Amnities Routes')
@Controller('amenities')
export class AmenitiesController {
  constructor(private readonly amenitiesService: AmenitiesService) {}

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Amenity Created' })
  @ApiBody({ type: CreateAmenityDto })
  @Post(':id')
  create(
    @Param('id', ParseIntPipe) hotelId: number,
    @Body() dto: CreateAmenityDto,
  ): Promise<
    | void
    | (Hotel & {
        amenities: Amenity;
      })
  > {
    return this.amenitiesService.create(dto, hotelId);
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Amenity Updated' })
  @ApiBody({ type: CreateAmenityDto })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateAmenityDto,
  ): Promise<
    | void
    | (Hotel & {
        amenities: Amenity;
      })
  > {
    return this.amenitiesService.update(id, dto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({ description: 'Amenity Deleted' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void | Amenity> {
    return this.amenitiesService.remove(id);
  }
}