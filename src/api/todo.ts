/**
 * 待办模块接口（对接 RuoYi-Vue-Plus 后端 /todo/*）
 */
import request from '#/utils/request';

/** 待办分组视图 */
export interface TodoGroupVo {
  groupId: number;
  groupName: string;
  orderNum?: number;
  createBy?: number;
  createByName?: string;
  createTime?: string;
}

/** 待办分组表单（新增/编辑） */
export interface TodoGroupBo {
  groupId?: number;
  groupName: string;
  orderNum?: number;
}

/** 待办事项视图 */
export interface TodoItemVo {
  todoId: number;
  todoName: string;
  todoDesc?: string;
  /** 后端返回格式 yyyy-MM-dd HH:mm:ss */
  deadline?: string;
  groupId: number;
  /** 完成状态 0未 1已 */
  status?: string;
  createBy?: number;
  createByName?: string;
  createTime?: string;
}

/** 待办事项表单（新增/编辑） */
export interface TodoItemBo {
  todoId?: number;
  todoName: string;
  todoDesc?: string;
  deadline?: string;
  groupId: number;
  status?: string;
}

const BASE = '/todo';

/** 分组列表 */
export function listGroups(): Promise<TodoGroupVo[]> {
  return request.get(`${BASE}/group/list`) as unknown as Promise<TodoGroupVo[]>;
}
export function getGroup(id: number): Promise<TodoGroupVo> {
  return request.get(`${BASE}/group/${id}`) as unknown as Promise<TodoGroupVo>;
}
export function addGroup(data: TodoGroupBo): Promise<void> {
  return request.post(`${BASE}/group`, data) as unknown as Promise<void>;
}
export function updateGroup(data: TodoGroupBo): Promise<void> {
  return request.put(`${BASE}/group`, data) as unknown as Promise<void>;
}
export function removeGroups(ids: number[]): Promise<void> {
  return request.delete(`${BASE}/group/${ids.join(',')}`) as unknown as Promise<void>;
}

/** 待办列表（按分组） */
export function listItems(groupId: number): Promise<TodoItemVo[]> {
  return request.get(`${BASE}/item/list`, { params: { groupId } }) as unknown as Promise<TodoItemVo[]>;
}
export function getItem(id: number): Promise<TodoItemVo> {
  return request.get(`${BASE}/item/${id}`) as unknown as Promise<TodoItemVo>;
}
export function addItem(data: TodoItemBo): Promise<void> {
  return request.post(`${BASE}/item`, data) as unknown as Promise<void>;
}
export function updateItem(data: TodoItemBo): Promise<void> {
  return request.put(`${BASE}/item`, data) as unknown as Promise<void>;
}
export function removeItems(ids: number[]): Promise<void> {
  return request.delete(`${BASE}/item/${ids.join(',')}`) as unknown as Promise<void>;
}
/** 切换完成状态 */
export function updateItemStatus(id: number, status: string): Promise<void> {
  return request.put(`${BASE}/item/status/${id}/${status}`) as unknown as Promise<void>;
}
