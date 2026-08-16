import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ContentPage } from './pages/ContentPage'
import { Home } from './pages/Home'
import { SearchPage } from './pages/SearchPage'
import { ServiceStar } from './pages/ServiceStar'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route
            path="faq"
            element={
              <ContentPage
                kind="faq"
                title="常见问题"
                description="一线同事最高频的操作疑问与排查步骤，支持按分类快速定位。"
              />
            }
          />
          <Route
            path="sop"
            element={
              <ContentPage
                kind="sop"
                title="SOP 文档"
                description="标准作业流程与时效要求，保证服务动作一致、可追踪。"
              />
            }
          />
          <Route
            path="tools"
            element={
              <ContentPage
                kind="tool"
                title="常用工具"
                description="CRM 及相关支持系统的快捷入口，减少收藏夹分散。"
              />
            }
          />
          <Route
            path="manuals"
            element={
              <ContentPage
                kind="manual"
                title="操作手册"
                description="分模块操作指引，适合新人上手与不常用功能复习。"
              />
            }
          />
          <Route
            path="recordings"
            element={
              <ContentPage
                kind="recording"
                title="录屏教程"
                description="演示类视频与场景实录，边看边练更快上手。"
              />
            }
          />
          <Route
            path="rules"
            element={
              <ContentPage
                kind="rule"
                title="常用业务规则"
                description="归属、SLA、审批等关键规则说明，减少口径不一致。"
              />
            }
          />
          <Route
            path="notices"
            element={
              <ContentPage
                kind="notice"
                title="系统通知"
                description="升级维护、规则变更与活动公告，重要信息置顶展示。"
              />
            }
          />
          <Route path="service-star" element={<ServiceStar />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
