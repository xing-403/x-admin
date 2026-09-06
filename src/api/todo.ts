/**
 * 待办模块接口（对接 RuoYi-Vue-Plus 后端 /todo/*）
 */
import request from '#/utils/request';

/** 待办分组视图 */
export interface TodoGroupVo {
  groupId: string;
  groupName: string;
  parentGroupId?: string;
  orderNum?: number;
  createBy?: number;
  createByName?: string;
  createTime?: string;
  children?: TodoGroupVo[];
}

/** 待办分组表单（新增/编辑） */
export interface TodoGroupBo {
  groupId?: string;
  groupName: string;
  parentGroupId?: string;
  orderNum?: number;
}

/** 待办事项视图 */
export interface TodoItemVo {
  todoId: string;
  todoName: string;
  todoDesc?: string;
  deadline?: string;
  groupId: string;
  status?: string;
  createBy?: number;
  createByName?: string;
  createTime?: string;
}

/** 待办事项表单（新增/编辑） */
export interface TodoItemBo {
  todoId?: string;
  todoName: string;
  todoDesc?: string;
  deadline?: string;
  groupId: string;
  status?: string;
}

const BASE = '/todo';

/** 分组列表（平铺） */
export function listGroups(): Promise<TodoGroupVo[]> {
  return request.get(`${BASE}/group/list`) as unknown as Promise<TodoGroupVo[]>;
}
/** 分组树（按 parentGroupId 组装层级） */
export function listGroupTree(): Promise<TodoGroupVo[]> {
  return request.get(`${BASE}/group/tree`) as unknown as Promise<TodoGroupVo[]>;
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
export function removeGroups(ids: string[]): Promise<void> {
  return request.delete(`${BASE}/group/${ids.join(',')}`) as unknown as Promise<void>;
}

/** 待办列表（按分组） */
export function listItems(groupId: string): Promise<TodoItemVo[]> {
  return request.get(`${BASE}/item/list`, { params: { groupId } }) as unknown as Promise<
    TodoItemVo[]
  >;
}
export function getItem(id: string): Promise<TodoItemVo> {
  return request.get(`${BASE}/item/${id}`) as unknown as Promise<TodoItemVo>;
}
export function addItem(data: TodoItemBo): Promise<void> {
  return request.post(`${BASE}/item`, data) as unknown as Promise<void>;
}
export function updateItem(data: TodoItemBo): Promise<void> {
  return request.put(`${BASE}/item`, data) as unknown as Promise<void>;
}
export function removeItems(ids: string[]): Promise<void> {
  return request.delete(`${BASE}/item/${ids.join(',')}`) as unknown as Promise<void>;
}
/** 切换完成状态 */
export function updateItemStatus(id: string, status: string): Promise<void> {
  return request.put(`${BASE}/item/status/${id}/${status}`) as unknown as Promise<void>;
}
