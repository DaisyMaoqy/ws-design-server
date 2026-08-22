import { IsOptional, IsIn, IsString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { APPLICATION_TYPES } from './enums';

/** 报表查询（GET /aws/v1/reports/dashboard） */
export class DashboardQueryDto {
  @IsOptional() @IsIn([...APPLICATION_TYPES]) type?: string;
  @IsOptional() @Type(() => Number) @IsInt() year?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(12) month?: number;
  @IsOptional() @IsString() department?: string;
}

export interface Slice {
  name: string;
  value: number;
}

export interface TrendPoint {
  month: string;
  value: number;
  unit: string;
}

export interface DashboardResponse {
  statusDistribution: Slice[];
  leaveTypeDistribution?: Slice[];
  monthlyTrend: TrendPoint[];
  totals: { count: number; budgetCents: number; leaveDays: number };
}
