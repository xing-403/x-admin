import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { RouteLocationMatched } from 'vue-router'
import { translate } from '#/locales'

/** 面包屑项（结构与 antd Breadcrumb 的 items 兼容） */
export interface BreadcrumbItem {
  key: string
  title: string
  /** 可点击跳转的完整路径（末项不设置，用于区分是否可点击） */
  path?: string
  /** 兼容 antd ItemType 的 data-* 索引签名 */
  [key: `data-${string}`]: string
}

/** 拼接父子路由 path，得到完整绝对路径 */
function combinePath(parent: string, child: string): string {
  if (!parent || parent === '/') return child.startsWith('/') ? child : `/${child}`
  if (child.startsWith('/')) return child
  return `${parent.replace(/\/$/, '')}/${child}`
}

export function useLayoutBreadcrumbs() {
  const route = useRoute()

  const breadcrumbs = computed<BreadcrumbItem[]>(() => {
    let acc = ''
    const items: BreadcrumbItem[] = []
    route.matched.forEach((r: RouteLocationMatched) => {
      // 跳过无标题或纯重定向（非真实页面）的路由
      if (!r.meta?.title || r.redirect) return
      acc = combinePath(acc, r.path)
      items.push({
        key: r.name ? String(r.name) : acc,
        title: translate(`menus.${String(r.meta.title)}`),
        path: acc,
      })
    })
    // 末项无需跳转
    if (items.length > 0) items[items.length - 1].path = undefined
    return items
  })

  return { breadcrumbs }
}
