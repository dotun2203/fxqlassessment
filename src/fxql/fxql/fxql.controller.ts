import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FxqlService } from './fxql.service';
import { FxqlEntry } from '../entities/fxql-entry.entity';
import { CreateFxqlDto } from './dto/create-fxql.dto';
import { UpdateFxqlDto } from './dto/update-fxqk.dto';
import { RateLimiterGuard } from 'nestjs-rate-limiter';

@ApiTags('FXQL Statements')
@Controller('fxql-statements')
export class FxqlController {
  constructor(private readonly fxqlService: FxqlService) {}

  @Post()
  @ApiOperation({ summary: 'Parse and store FXQL statements' })
  @ApiResponse({
    status: 200,
    description: 'FXQL Statement parsed successfully.',
    type: [FxqlEntry],
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiBody({ type: CreateFxqlDto })
  @UseGuards(RateLimiterGuard)
  async create(@Body() createFxqlDto: CreateFxqlDto) {
    try {
      const result = await this.fxqlService.processFxql(createFxqlDto.FXQL);
      return {
        message: 'FXQL Statement parsed successfully.',
        code: 'FXQL-200',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          message: error.message,
          code: 'FXQL-400',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all FXQL statements' })
  @ApiResponse({
    status: 200,
    description: 'list of all FXQL statements',
    type: [FxqlEntry],
  })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async findAll(): Promise<FxqlEntry[]> {
    try {
      return await this.fxqlService.findAll();
    } catch (error) {
      throw new HttpException(
        {
          message: 'failed to Retrieve FXQL statements. ',
          code: 'FXQL-500',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a single FXQL statement by ID' })
  @ApiResponse({
    status: 200,
    description: 'FXQL statement retrieved successfully.',
    type: FxqlEntry,
  })
  @ApiResponse({ status: 404, description: 'FXQL statement not found ' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async findOne(@Param('id') id: number): Promise<FxqlEntry> {
    try {
      const entry = await this.fxqlService.findOne(id);
      if (!entry) {
        throw new HttpException(
          {
            message: `FXQL statement with ID ${id} not found.`,
            code: 'FXQL-404',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return entry;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          message: 'Failed to retrieve FXQL statement.',
          code: 'FXQL-500',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing FXQL statement by ID' })
  @ApiResponse({
    status: 200,
    description: 'FXQL statement updated successfully.',
    type: FxqlEntry,
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 404, description: 'FXQL statement not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @ApiBody({ type: UpdateFxqlDto })
  async update(
    @Param('id') id: number,
    @Body() updateFxqlDto: UpdateFxqlDto,
  ): Promise<{ message: string; code: string; data }> {
    try {
      const updatedEntry = await this.fxqlService.update(id, updateFxqlDto);
      return {
        message: 'FXQL Statement updated successfully.',
        code: 'FXQL-200',
        data: updatedEntry,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          message: 'Failed to update FXQL statement.',
          code: 'FXQL-500',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an existing FXQL statement by ID' })
  @ApiResponse({
    status: 200,
    description: 'FXQL statement deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'FXQL statement not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async remove(
    @Param('id') id: number,
  ): Promise<{ message: string; code: string }> {
    try {
      await this.fxqlService.remove(id);
      return {
        message: `FXQL statement with ID ${id} deleted successfully.`,
        code: 'FXQL-200',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          message: 'Failed to delete FXQL statement.',
          code: 'FXQL-500',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
