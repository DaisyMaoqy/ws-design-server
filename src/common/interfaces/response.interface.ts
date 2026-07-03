/**
 * 统一返回体接口定义
 */

/** 标准返回体结构 */
export interface ApiResponse<T = any> {
  /** 业务状态码: '200' 成功, '400'/'401'/'403'/'404'/'500' 等异常 */
  code: string;
  /** 提示信息 */
  msg: string;
  /** 返回数据 */
  data: T | null;
}

/** 响应元数据（用于拦截器标记是否已包装） */
export const RESPONSE_WRAPPED = "response_wrapped";
