export interface LayoutMenuProps {
  collapsed: boolean;
  mode?: 'vertical' | 'horizontal';
}

/** 侧边栏菜单项（结构与 antd Menu 的 items 兼容） */
export interface LayoutMenuItem {
  key: string;
  label: string;
  icon?: string;
  children?: LayoutMenuItem[];
  /** 兼容 antd MenuItemType 的索引签名 */
  [key: string]: any;
}
