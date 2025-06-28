import { QuartzComponentProps } from "./types"

export default function CustomPageWrapper({ children }: QuartzComponentProps) {
  return (
    <div className="page-shell">
      <aside id="quartz-left" />
      <main id="quartz-main">{children}</main>
      <aside id="quartz-right" />
    </div>
  )
}
