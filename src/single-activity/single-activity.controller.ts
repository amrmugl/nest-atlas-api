import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UploadedFile,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { SingleActivityService } from './single-activity.service';
import { CreateSingleActivityDto } from './dto/create-single-activity.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public, Roles } from 'src/common/decorators';
import { Activities, Role, SingleActivity } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiFoundResponse } from '@nestjs/swagger';
import { AdminGuard } from '../common/guards/roles.guard';

@ApiTags('Single Activity routes')
@UseGuards(AdminGuard)
@Controller('single-activity')
export class SingleActivityController {
  constructor(private readonly singleActivityService: SingleActivityService) {}

  @Roles(Role.admin)
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Picture Uploaded' })
  @Post(':id/picture')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  uploadProfile(
    @UploadedFile() file: Express.Multer.File,
    @Param('id', ParseIntPipe) activityId: number,
  ): Promise<void | SingleActivity> {
    return this.singleActivityService.uploadPicture(file, activityId);
  }

  @Roles(Role.admin)
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Activity Created' })
  @ApiBody({ type: CreateSingleActivityDto })
  @ApiBearerAuth()
  @Post(':id')
  create(
    @Param('id', ParseIntPipe) activityId: number,
    @Body() dto: CreateSingleActivityDto,
  ): Promise<
    | void
    | (Activities & {
        activity: SingleActivity[];
      })
  > {
    return this.singleActivityService.create(dto, activityId);
  }

  @HttpCode(HttpStatus.FOUND)
  @ApiFoundResponse({ description: 'All activities found' })
  @ApiBearerAuth()
  @Get()
  findAll() {
    return this.singleActivityService.findAll();
  }

  @HttpCode(HttpStatus.FOUND)
  @ApiFoundResponse({ description: 'Activity Found' })
  @ApiBearerAuth()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.singleActivityService.findOne(+id);
  }

  @Roles(Role.admin)
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Activity updated' })
  @ApiBody({ type: CreateSingleActivityDto })
  @ApiBearerAuth()
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) activitiesId: number,
    @Body() dto: Partial<CreateSingleActivityDto>,
  ) {
    return this.singleActivityService.update(activitiesId, dto);
  }

  @Roles(Role.admin)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Activity deleted' })
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.singleActivityService.remove(+id);
  }
}