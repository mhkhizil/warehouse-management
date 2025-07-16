import { CreateStockUseCase } from '../use-cases/stock/create-stock.use-case';
import { DeleteStockUseCase } from '../use-cases/stock/delete-stock.use-case';
import { GetStockUseCase } from '../use-cases/stock/get-stock.use-case';
import { ListStocksUseCase } from '../use-cases/stock/list-stocks.use-case';
import { UpdateStockUseCase } from '../use-cases/stock/update-stock.use-case';
import { ApiResponseDto } from '../dtos/common/api-response.dto';
import { CreateStockDto } from '../dtos/stock/create-stock.dto';
import { UpdateStockDto } from '../dtos/stock/update-stock.dto';
import { StockResponseDto } from '../dtos/stock/stock-response.dto';
import { PaginationQueryDto, PaginatedResponseDto } from '../dtos/common/pagination.dto';
export declare class StocksController {
    private readonly createStockUseCase;
    private readonly deleteStockUseCase;
    private readonly getStockUseCase;
    private readonly listStocksUseCase;
    private readonly updateStockUseCase;
    constructor(createStockUseCase: CreateStockUseCase, deleteStockUseCase: DeleteStockUseCase, getStockUseCase: GetStockUseCase, listStocksUseCase: ListStocksUseCase, updateStockUseCase: UpdateStockUseCase);
    createStock(createStockDto: CreateStockDto): Promise<ApiResponseDto<StockResponseDto>>;
    getStocks(paginationQuery: PaginationQueryDto, refillAlert?: string, itemId?: string, minQuantity?: string, maxQuantity?: string): Promise<ApiResponseDto<PaginatedResponseDto<StockResponseDto>>>;
    getAllStocks(): Promise<ApiResponseDto<StockResponseDto[]>>;
    getLowStock(threshold?: string): Promise<ApiResponseDto<StockResponseDto[]>>;
    getStockById(id: number): Promise<ApiResponseDto<StockResponseDto>>;
    getStockByItemId(itemId: number): Promise<ApiResponseDto<StockResponseDto>>;
    updateStock(id: number, updateStockDto: UpdateStockDto): Promise<ApiResponseDto<StockResponseDto>>;
    deleteStock(id: number): Promise<ApiResponseDto<boolean>>;
}
