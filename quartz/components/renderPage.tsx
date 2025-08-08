import { render } from "preact-render-to-string"
import { QuartzComponent, QuartzComponentProps } from "./types"
import HeaderConstructor from "./Header"
import BodyConstructor from "./Body"
import { JSResourceToScriptElement, StaticResources } from "../util/resources"
import { FullSlug, RelativeURL, joinSegments, normalizeHastElement } from "../util/path"
import { clone } from "../util/clone"
import { visit } from "unist-util-visit"
import { Root, Element, ElementContent } from "hast"
import { GlobalConfiguration } from "../cfg"
import { i18n } from "../i18n"

interface RenderComponents {
  head: QuartzComponent
  header: QuartzComponent[]
  beforeBody: QuartzComponent[]
  pageBody: QuartzComponent
  afterBody: QuartzComponent[]
  left: QuartzComponent[]
  right: QuartzComponent[]
  footer: QuartzComponent
}

const headerRegex = new RegExp(/h[1-6]/)
export function pageResources(
  baseDir: FullSlug | RelativeURL,
  staticResources: StaticResources,
): StaticResources {
  const contentIndexPath = joinSegments(baseDir, "static/contentIndex.json")
  const contentIndexScript = `const fetchData = fetch("${contentIndexPath}").then(data => data.json())`

  const resources: StaticResources = {
    css: [
      {
        content: joinSegments(baseDir, "index.css"),
      },
      ...staticResources.css,
    ],
    js: [
      {
        src: joinSegments(baseDir, "prescript.js"),
        loadTime: "beforeDOMReady",
        contentType: "external",
      },
      {
        loadTime: "beforeDOMReady",
        contentType: "inline",
        spaPreserve: true,
        script: contentIndexScript,
      },
      ...staticResources.js,
    ],
    additionalHead: staticResources.additionalHead,
  }

  resources.js.push({
    src: joinSegments(baseDir, "postscript.js"),
    loadTime: "afterDOMReady",
    moduleType: "module",
    contentType: "external",
  })

  return resources
}

function renderTranscludes(
  root: Root,
  cfg: GlobalConfiguration,
  slug: FullSlug,
  componentData: QuartzComponentProps,
) {
  // process transcludes in componentData
  visit(root, "element", (node, _index, _parent) => {
    if (node.tagName === "blockquote") {
      const classNames = (node.properties?.className ?? []) as string[]
      if (classNames.includes("transclude")) {
        const inner = node.children[0] as Element
        const transcludeTarget = (inner.properties["data-slug"] ?? slug) as FullSlug
        const page = componentData.allFiles.find((f) => f.slug === transcludeTarget)
        if (!page) {
          return
        }

        let blockRef = node.properties.dataBlock as string | undefined
        if (blockRef?.startsWith("#^")) {
          // block transclude
          blockRef = blockRef.slice("#^".length)
          let blockNode = page.blocks?.[blockRef]
          if (blockNode) {
            if (blockNode.tagName === "li") {
              blockNode = {
                type: "element",
                tagName: "ul",
                properties: {},
                children: [blockNode],
              }
            }

            node.children = [
              normalizeHastElement(blockNode, slug, transcludeTarget),
              {
                type: "element",
                tagName: "a",
                properties: { href: inner.properties?.href, class: ["internal", "transclude-src"] },
                children: [
                  { type: "text", value: i18n(cfg.locale).components.transcludes.linkToOriginal },
                ],
              },
            ]
          }
        } else if (blockRef?.startsWith("#") && page.htmlAst) {
          // header transclude
          blockRef = blockRef.slice(1)
          let startIdx = undefined
          let startDepth = undefined
          let endIdx = undefined
          for (const [i, el] of page.htmlAst.children.entries()) {
            // skip non-headers
            if (!(el.type === "element" && el.tagName.match(headerRegex))) continue
            const depth = Number(el.tagName.substring(1))

            // lookin for our blockref
            if (startIdx === undefined || startDepth === undefined) {
              // skip until we find the blockref that matches
              if (el.properties?.id === blockRef) {
                startIdx = i
                startDepth = depth
              }
            } else if (depth <= startDepth) {
              // looking for new header that is same level or higher
              endIdx = i
              break
            }
          }

          if (startIdx === undefined) {
            return
          }

          node.children = [
            ...(page.htmlAst.children.slice(startIdx, endIdx) as ElementContent[]).map((child) =>
              normalizeHastElement(child as Element, slug, transcludeTarget),
            ),
            {
              type: "element",
              tagName: "a",
              properties: { href: inner.properties?.href, class: ["internal", "transclude-src"] },
              children: [
                { type: "text", value: i18n(cfg.locale).components.transcludes.linkToOriginal },
              ],
            },
          ]
        } else if (page.htmlAst) {
          // page transclude
          node.children = [
            {
              type: "element",
              tagName: "h1",
              properties: {},
              children: [
                {
                  type: "text",
                  value:
                    page.frontmatter?.title ??
                    i18n(cfg.locale).components.transcludes.transcludeOf({
                      targetSlug: page.slug!,
                    }),
                },
              ],
            },
            ...(page.htmlAst.children as ElementContent[]).map((child) =>
              normalizeHastElement(child as Element, slug, transcludeTarget),
            ),
            {
              type: "element",
              tagName: "a",
              properties: { href: inner.properties?.href, class: ["internal", "transclude-src"] },
              children: [
                { type: "text", value: i18n(cfg.locale).components.transcludes.linkToOriginal },
              ],
            },
          ]
        }
      }
    }
  })
}

export function renderPage(
  cfg: GlobalConfiguration,
  slug: FullSlug,
  componentData: QuartzComponentProps,
  components: RenderComponents,
  pageResources: StaticResources,
): string {
  // make a deep copy of the tree so we don't remove the transclusion references
  // for the file cached in contentMap in build.ts
  const root = clone(componentData.tree) as Root
  renderTranscludes(root, cfg, slug, componentData)

  // set componentData.tree to the edited html that has transclusions rendered
  componentData.tree = root

  const {
    head: Head,
    header,
    beforeBody,
    pageBody: Content,
    afterBody,
    left,
    right,
    footer: Footer,
  } = components
  const Header = HeaderConstructor()
  const Body = BodyConstructor()

  const LeftComponent = (
    <div class="left sidebar">
      {left.map((BodyComponent) => (
        <BodyComponent {...componentData} />
      ))}
    </div>
  )

  const RightComponent = (
    <div class="right sidebar">
      {right.map((BodyComponent) => (
        <BodyComponent {...componentData} />
      ))}
    </div>
  )

  const lang = componentData.fileData.frontmatter?.lang ?? cfg.locale?.split("-")[0] ?? "en"
  const doc = (
    <html lang={lang}>
      <Head {...componentData} />
            <>
        <div className="headerflex">
          <span className="rainbow" id="siteheader">
            {`88888888888 888    888 8888888888
    888     888    888 888       
    888     888    888 888       
    888     8888888888 8888888   
    888     888    888 888       
    888     888    888 888       
    888     888    888 888       
    888     888    888 8888888888`}
          </span>
          <span className="rainbow" id="siteheader">
            {`8888888b.   .d88888b.   .d8888b.   .d8888b.  888     888 888b     d888
888   Y88b d88P" "Y88b d88P  Y88b d88P  Y88b 888     888 8888b   d8888
888    888 888     888 Y88b.      Y88b.      888     888 88888b.d88888
888   d88P 888     888  "Y888b.    "Y888b.   888     888 888Y88888P888
8888888P"  888     888     "Y88b.     "Y88b. 888     888 888 Y888P 888
888        888     888       "888       "888 888     888 888  Y8P  888
888        Y88b. .d88P Y88b  d88P Y88b  d88P Y88b. .d88P 888   "   888
888         "Y88888P"   "Y8888P"   "Y8888P"   "Y88888P"  888       888`}
          </span>
          <span className="rainbow" id="siteheader">
            {`8888888b.  8888888888 888b    888
888  "Y88b 888        8888b   888
888    888 888        88888b  888
888    888 8888888    888Y88b 888
888    888 888        888 Y88b888
888    888 888        888  Y88888
888  .d88P 888        888   Y8888
8888888P"  8888888888 888    Y888`}
          </span>
        </div>

        {/* Mobile navigation */}
        <div className="topnav" id="myTopnav">
          <a href="/index.html" className="active">
            <img class="mobileheaderimage" src="/static/mobileheader.gif" alt="" />
            <div className="rainbow">The Possum Den</div>
          </a>

          <div id="myLinks">
            <a href="https://kingposs.com/index">Home</a>
            <a href="https://kingposs.com/about">About Me</a>
            <a href="https://kingposs.com/art">Art/Media</a>
            <a href="https://blog.kingposs.com">Blog</a>
            <a href="https://kingposs.com/radio">Radio</a>
            <a href="https://kb.kingposs.com">Brain Bank</a>
            <a href="https://kingposs.com/sites">Cool Sites</a>
            <a href="https://kingposs.com/guestbook">Guestbook</a>
          </div>

          <a href="javascript:void(0);" className="icon" id="icon">
            <div className="mobilemenu"></div>
          </a>
        </div>

        {/* Desktop navigation */}
        <nav className="navbar">
            <a href="https://kingposs.com/index">Home</a>
            <a href="https://kingposs.com/about">About Me</a>
            <a href="https://kingposs.com/art">Art/Media</a>
            <a href="https://blog.kingposs.com">Blog</a>
            <a href="https://kingposs.com/radio">Radio</a>
            <a href="https://kb.kingposs.com">Brain Bank</a>
            <a href="https://kingposs.com/sites">Cool Sites</a>
            <a href="https://kingposs.com/guestbook">Guestbook</a>
        </nav>
      </>

 
      <body data-slug={slug}>
        <div id="quartz-root" class="page">
          <Body {...componentData}>
            {LeftComponent}
            <div class="center">
              <div class="page-header">
                <Header {...componentData}>
                  {header.map((HeaderComponent) => (
                    <HeaderComponent {...componentData} />
                  ))}
                </Header>
                <div class="popover-hint">
                  {beforeBody.map((BodyComponent) => (
                    <BodyComponent {...componentData} />
                  ))}
                </div>
              </div>
              <Content {...componentData} />
              <hr />
              <div class="page-footer">
                {afterBody.map((BodyComponent) => (
                  <BodyComponent {...componentData} />
                ))}
              </div>
            </div>
            {RightComponent}
            <Footer {...componentData} />
          </Body>
        </div>
      </body>
      <footer>
  <a href="https://kingposs.com" target="_blank" rel="noopener noreferrer">
    <img className="h-swing" src="/static/buttons/PossBadge.gif" alt="" />
  </a>
  <a href="https://neocities.org/" target="_blank" rel="noopener noreferrer">
    <img className="h-swing" src="/static/buttons/NeoCitiesGreen.gif" alt="" />
  </a>
  <a href="https://32bit.cafe/" target="_blank" rel="noopener noreferrer">
    <img className="h-swing" src="/static/buttons/32bitty.png" alt="" />
  </a>
  <img className="h-swing" src="/static/buttons/twopaws.png" alt="" />
  <img className="h-swing" src="/static/buttons/piracy.png" alt="" />
  <img className="h-swing" src="/static/buttons/defund_badge.gif" alt="" />
  <img className="h-swing" src="/static/buttons/htmldream.gif" alt="" />
  <a href="https://archive.org/" target="_blank" rel="noopener noreferrer">
    <img className="h-swing" src="/static/buttons/internetarchive.gif" alt="" />
  </a>
  <a href="https://modarchive.org/" target="_blank" rel="noopener noreferrer">
    <img className="h-swing" src="/static/buttons/modarchive.png" alt="" />
  </a>
  <a href="subrosa.html" target="_blank" rel="noopener noreferrer">
    <img className="h-swing" src="/static/buttons/PossButtonRosa.gif" alt="" />
  </a>
</footer>
           <script dangerouslySetInnerHTML={{
  __html: `
    console.log('script loaded')

    function myFunction() {
      const x = document.getElementById("myLinks")
      const y = document.getElementById("icon")

      if (x?.style.display === "block") {
        x.style.display = "none"
      } else {
        x.style.display = "block"
      }

      document.getElementById("myTopnav")?.classList.toggle("responsive")
    }

    document.addEventListener("DOMContentLoaded", () => {
      console.log("DOM fully loaded")
      document.getElementById("icon")?.addEventListener("click", myFunction)
    });

  `
}} />
      {pageResources.js
        .filter((resource) => resource.loadTime === "afterDOMReady")
        .map((res) => JSResourceToScriptElement(res))}
    </html>
  )

  return "<!DOCTYPE html>\n" + render(doc)
}
