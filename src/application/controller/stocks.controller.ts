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
import { CreateStockUseCase } from '../use-cases/stock/create-stock.use-case';
import { DeleteStockUseCase } from '../use-cases/stock/delete-stock.use-case';
import { GetStockUseCase } from '../use-cases/stock/get-stock.use-case';
import { ListStocksUseCase } from '../use-cases/stock/list-stocks.use-case';
import { UpdateStockUseCase } from '../use-cases/stock/update-stock.use-case';
import { ApiResponseDto } from '../dtos/common/api-response.dto';
import { CreateStockDto } from '../dtos/stock/create-stock.dto';
import { UpdateStockDto } from '../dtos/stock/update-stock.dto';
import { StockResponseDto } from '../dtos/stock/stock-response.dto';
import {
  PaginationQueryDto,
  PaginatedResponseDto,
} from '../dtos/common/pagination.dto';
import { StockResponseSchema } from './documentation/stock/ResponseSchema/StockResponseSchema';
import { PaginatedStockResponseSchema } from './documentation/stock/ResponseSchema/PaginatedStockResponseSchema';
import { StockListResponseSchema } from './documentation/stock/ResponseSchema/StockListResponseSchema';
import { CoreApiResonseSchema } from '../../core/common/schema/ApiResponseSchema';

@Controller('stocks')
@ApiTags('stocks')
export class StocksController {
  constructor(
    private readonly createStockUseCase: CreateStockUseCase,
    private readonly deleteStockUseCase: DeleteStockUseCase,
    private readonly getStockUseCase: GetStockUseCase,
    private readonly listStocksUseCase: ListStocksUseCase,
    private readonly updateStockUseCase: UpdateStockUseCase,
  ) {}

  @Post()
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new stock entry' })
  @ApiBody({ type: CreateStockDto, description: 'Stock data to create' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Stock created successfully',
    type: StockResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data or stock already exists for this item',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Item not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async createStock(
    @Body() createStockDto: CreateStockDto,
  ): Promise<ApiResponseDto<StockResponseDto>> {
    const stock = await this.createStockUseCase.execute(createStockDto);
    return ApiResponseDto.success(
      new StockResponseDto(stock),
      'Stock created successfully',
    );
  }

  @Get()
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get a list of stock entries with optional filtering',
  })
  @ApiQuery({ type: PaginationQueryDto, required: false })
  @ApiQuery({
    name: 'refillAlert',
    required: false,
    type: 'boolean',
    description: 'Filter by refill alert status',
  })
  @ApiQuery({
    name: 'itemId',
    required: false,
    type: 'number',
    description: 'Filter by item ID',
  })
  @ApiQuery({
    name: 'minQuantity',
    required: false,
    type: 'number',
    description: 'Filter by minimum quantity',
  })
  @ApiQuery({
    name: 'maxQuantity',
    required: false,
    type: 'number',
    description: 'Filter by maximum quantity',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Stock entries retrieved successfully',
    type: PaginatedStockResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async getStocks(
    @Query() paginationQuery: PaginationQueryDto,
    @Query('refillAlert') refillAlert?: string,
    @Query('itemId') itemId?: string,
    @Query('minQuantity') minQuantity?: string,
    @Query('maxQuantity') maxQuantity?: string,
  ): Promise<ApiResponseDto<PaginatedResponseDto<StockResponseDto>>> {
    const filter = {
      skip: paginationQuery.skip,
      take: paginationQuery.take,
      refillAlert:
        refillAlert === 'true'
          ? true
          : refillAlert === 'false'
            ? false
            : undefined,
      itemId: itemId ? parseInt(itemId) : undefined,
      minQuantity: minQuantity ? parseInt(minQuantity) : undefined,
      maxQuantity: maxQuantity ? parseInt(maxQuantity) : undefined,
    };

    const { stocks, total } = await this.listStocksUseCase.execute(filter);

    const stockDtos = stocks.map((stock) => new StockResponseDto(stock));
    const paginatedResponse = new PaginatedResponseDto<StockResponseDto>(
      stockDtos,
      total,
      paginationQuery.skip,
      paginationQuery.take,
    );

    return ApiResponseDto.success(
      paginatedResponse,
      'Stock entries retrieved successfully',
    );
  }

  @Get('all')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all stock entries without pagination' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'All stock entries retrieved successfully',
    type: StockListResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async getAllStocks(): Promise<ApiResponseDto<StockResponseDto[]>> {
    const stocks = await this.listStocksUseCase.findAll();
    const stockDtos = stocks.map((stock) => new StockResponseDto(stock));
    return ApiResponseDto.success(
      stockDtos,
      'All stock entries retrieved successfully',
    );
  }

  @Get('low')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get stock entries with low quantity' })
  @ApiQuery({
    name: 'threshold',
    required: false,
    type: 'number',
    description: 'Optional threshold value (default defined by system)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Low stock entries retrieved successfully',
    type: StockListResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async getLowStock(
    @Query('threshold') threshold?: string,
  ): Promise<ApiResponseDto<StockResponseDto[]>> {
    const thresholdValue = threshold ? parseInt(threshold) : undefined;
    const stocks = await this.getStockUseCase.getLowStock(thresholdValue);
    const stockDtos = stocks.map((stock) => new StockResponseDto(stock));
    return ApiResponseDto.success(
      stockDtos,
      'Low stock entries retrieved successfully',
    );
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a stock entry by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Stock ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Stock entry retrieved successfully',
    type: StockResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Stock entry not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async getStockById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponseDto<StockResponseDto>> {
    const stock = await this.getStockUseCase.execute(id);
    return ApiResponseDto.success(
      new StockResponseDto(stock),
      'Stock entry retrieved successfully',
    );
  }

  @Get('item/:itemId')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get stock by item ID' })
  @ApiParam({ name: 'itemId', type: 'number', description: 'Item ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Stock entry retrieved successfully',
    type: StockResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Stock entry not found for the item',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async getStockByItemId(
    @Param('itemId', ParseIntPipe) itemId: number,
  ): Promise<ApiResponseDto<StockResponseDto>> {
    const stock = await this.getStockUseCase.getByItemId(itemId);
    return ApiResponseDto.success(
      new StockResponseDto(stock),
      'Stock entry retrieved successfully',
    );
  }

  @Put(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a stock entry' })
  @ApiParam({ name: 'id', type: 'number', description: 'Stock ID' })
  @ApiBody({ type: UpdateStockDto, description: 'Stock data to update' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Stock entry updated successfully',
    type: StockResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Stock entry not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async updateStock(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStockDto: UpdateStockDto,
  ): Promise<ApiResponseDto<StockResponseDto>> {
    const stock = await this.updateStockUseCase.execute(id, updateStockDto);
    return ApiResponseDto.success(
      new StockResponseDto(stock),
      'Stock entry updated successfully',
    );
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a stock entry' })
  @ApiParam({ name: 'id', type: 'number', description: 'Stock ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Stock entry deleted successfully',
    type: StockResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Stock entry not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async deleteStock(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponseDto<boolean>> {
    const deleted = await this.deleteStockUseCase.execute(id);
    return ApiResponseDto.success(deleted, 'Stock entry deleted successfully');
  }
}
