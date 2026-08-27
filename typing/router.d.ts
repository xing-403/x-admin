export * from 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    /** 页面/菜单标题 */
    title?: string;
    /** 菜单图标：antd 图标名 / iconify 名称 / 远程图片地址 */
    icon?: string;
    /** 菜单排序，数值越小越靠前 */
    order?: number;
    /** 是否在菜单中隐藏 */
    hideInMenu?: boolean;
  }
}
