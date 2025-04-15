import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { CreateItemUseCase } from '../use-cases/item/create-item.use-case';
import { DeleteItemUseCase } from '../use-cases/item/delete-item.use-case';
import { GetItemUseCase } from '../use-cases/item/get-item.use-case';
import { ListItemsUseCase } from '../use-cases/item/list-items.use-case';
import { UpdateItemUseCase } from '../use-cases/item/update-item.use-case';
import { ApiResponseDto } from '../dtos/common/api-response.dto';
import { CreateItemDto } from '../dtos/item/create-item.dto';
import { UpdateItemDto } from '../dtos/item/update-item.dto';
import { ItemResponseDto } from '../dtos/item/item-response.dto';
import {
  PaginationQueryDto,
  PaginatedResponseDto,
} from '../dtos/common/pagination.dto';
import { ItemResponseSchema } from './documentation/item/ResponseSchema/ItemResponseSchema';
import { PaginatedItemResponseSchema } from './documentation/item/ResponseSchema/PaginatedItemResponseSchema';
import { ItemListResponseSchema } from './documentation/item/ResponseSchema/ItemListResponseSchema';
import { CoreApiResonseSchema } from '../../core/common/schema/ApiResponseSchema';

@Controller('items')
@ApiTags('items')
export class ItemsController {
  constructor(
    private readonly createItemUseCase: CreateItemUseCase,
    private readonly deleteItemUseCase: DeleteItemUseCase,
    private readonly getItemUseCase: GetItemUseCase,
    private readonly listItemsUseCase: ListItemsUseCase,
    private readonly updateItemUseCase: UpdateItemUseCase,
  ) {}

  @Post()
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new item' })
  @ApiBody({ type: CreateItemDto, description: 'Item data to create' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Item created successfully',
    type: ItemResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data or item with this name already exists',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async createItem(
    @Body() createItemDto: CreateItemDto,
  ): Promise<ApiResponseDto<ItemResponseDto>> {
    const item = await this.createItemUseCase.execute(createItemDto);
    return ApiResponseDto.success(
      new ItemResponseDto(item),
      'Item created successfully',
    );
  }

  @Get()
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a list of items with optional filtering' })
  @ApiQuery({ type: PaginationQueryDto, required: false })
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Filter by item name',
  })
  @ApiQuery({ name: 'brand', required: false, description: 'Filter by brand' })
  @ApiQuery({ name: 'type', required: false, description: 'Filter by type' })
  @ApiQuery({
    name: 'isSellable',
    required: false,
    enum: ['true', 'false'],
    description: 'Filter by whether item can be sold',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Items retrieved successfully',
    type: PaginatedItemResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async getItems(
    @Query() paginationQuery: PaginationQueryDto,
    @Query('name') name?: string,
    @Query('brand') brand?: string,
    @Query('type') type?: string,
    @Query('isSellable') isSellable?: string,
  ): Promise<ApiResponseDto<PaginatedResponseDto<ItemResponseDto>>> {
    const filter = {
      skip: paginationQuery.skip,
      take: paginationQuery.take,
      name,
      brand,
      type,
      isSellable:
        isSellable === 'true'
          ? true
          : isSellable === 'false'
            ? false
            : undefined,
    };

    const { items, total } = await this.listItemsUseCase.execute(filter);

    const itemDtos = items.map((item) => new ItemResponseDto(item));
    const paginatedResponse = new PaginatedResponseDto<ItemResponseDto>(
      itemDtos,
      total,
      paginationQuery.skip,
      paginationQuery.take,
    );

    return ApiResponseDto.success(
      paginatedResponse,
      'Items retrieved successfully',
    );
  }

  @Get('all')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all items without pagination' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'All items retrieved successfully',
    type: ItemListResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async getAllItems(): Promise<ApiResponseDto<ItemResponseDto[]>> {
    const items = await this.listItemsUseCase.findAll();
    const itemDtos = items.map((item) => new ItemResponseDto(item));
    return ApiResponseDto.success(itemDtos, 'All items retrieved successfully');
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get an item by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Item ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Item retrieved successfully',
    type: ItemResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Item not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async getItemById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponseDto<ItemResponseDto>> {
    const item = await this.getItemUseCase.execute(id);
    return ApiResponseDto.success(
      new ItemResponseDto(item),
      'Item retrieved successfully',
    );
  }

  @Get('name/:name')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get an item by name' })
  @ApiParam({ name: 'name', type: 'string', description: 'Item name' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Item retrieved successfully',
    type: ItemResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Item not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async getItemByName(
    @Param('name') name: string,
  ): Promise<ApiResponseDto<ItemResponseDto>> {
    const item = await this.getItemUseCase.findByName(name);
    return ApiResponseDto.success(
      new ItemResponseDto(item),
      'Item retrieved successfully',
    );
  }

  @Get(':id/sub-items')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get sub-items of an item' })
  @ApiParam({ name: 'id', type: 'number', description: 'Parent item ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Sub-items retrieved successfully',
    type: ItemListResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Parent item not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async getSubItems(
    @Param('id', ParseIntPipe) parentId: number,
  ): Promise<ApiResponseDto<ItemResponseDto[]>> {
    const subItems = await this.getItemUseCase.getSubItems(parentId);
    const subItemDtos = subItems.map((item) => new ItemResponseDto(item));
    return ApiResponseDto.success(
      subItemDtos,
      'Sub-items retrieved successfully',
    );
  }

  @Put(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an item' })
  @ApiParam({ name: 'id', type: 'number', description: 'Item ID' })
  @ApiBody({ type: UpdateItemDto, description: 'Item data to update' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Item updated successfully',
    type: ItemResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Item not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async updateItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateItemDto: UpdateItemDto,
  ): Promise<ApiResponseDto<ItemResponseDto>> {
    const item = await this.updateItemUseCase.execute(id, updateItemDto);
    return ApiResponseDto.success(
      new ItemResponseDto(item),
      'Item updated successfully',
    );
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an item' })
  @ApiParam({ name: 'id', type: 'number', description: 'Item ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Item deleted successfully',
    type: ItemResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Item not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async deleteItem(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponseDto<boolean>> {
    const deleted = await this.deleteItemUseCase.execute(id);
    return ApiResponseDto.success(deleted, 'Item deleted successfully');
  }
}
