import { PageLayout, SharedLayout, FullPageLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import CustomPageWrapper from "./quartz/components/CustomPageWrapper"


// 🧩 Required default Quartz layout exports
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({ links: {} }),
}

export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.Explorer(),
  ],
  right: [
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

export const defaultListPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.Explorer(),
  ],
  right: [],
}

// ✅ Your custom layout to inject <main> and <aside>
const fullPageLayout: FullPageLayout = {
  head: Component.Head(),
  header: [],
  beforeBody: [],
  pageBody: CustomPageWrapper,
  afterBody: [],
  left: defaultContentPageLayout.left,
  right: defaultContentPageLayout.right,
  footer: Component.Footer({ links: {} }),
}

// 🔥 This gets picked up automatically when you run `npx quartz build`
export default fullPageLayout