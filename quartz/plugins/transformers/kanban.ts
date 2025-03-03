import { QuartzTransformerPlugin } from "../types"  // adjust path as needed

export const Kanban: QuartzTransformerPlugin = () => {
  return {
    name: "Kanban",
    htmlPlugins() {
      return [
        () => (tree, file) => {
          // Only transform if frontmatter has kanban: true
          const fm: any = file.data.frontmatter || {}
          if (!fm.kanban) return

          const children = tree.children

          // Determine which heading level to use as columns
          const headingLevels = children
            .filter((node: any) => node.type === "element" && /^h\d$/.test(node.tagName))
            .map((node: any) => parseInt(node.tagName[1]))
          if (headingLevels.length === 0) return

          // Use the smallest heading level that occurs more than once (if available), else the first level
          let colLevel = headingLevels.sort()[0]
          for (const lvl of headingLevels) {
            if (headingLevels.filter((x: number) => x === lvl).length > 1) { 
              colLevel = lvl; 
              break 
            }
          }
          const colTag = "h" + colLevel

          // Build new Kanban board element
          const boardEl = {
            type: "element",
            tagName: "div",
            properties: { className: ["kanban-plugin__board"] },
            children: [] as any[]
          }

          // Iterate through children, grouping headings and their following list items
          for (let i = 0; i < children.length; i++) {
            const node: any = children[i]
            if (node.type === "element" && node.tagName === colTag) {
              // This is a column heading
              const headingEl = node
              const titleTextNodes = headingEl.children || []

              // Look ahead for a list (<ul> or <ol>) right after the heading for cards
              let listEl: any = null
              if (
                i + 1 < children.length &&
                children[i + 1].type === "element" &&
                (children[i + 1].tagName === "ul" || children[i + 1].tagName === "ol")
              ) {
                listEl = children[i + 1]
              }

              // Create column (lane) wrapper and lane container
              const laneWrapper = {
                type: "element",
                tagName: "div",
                properties: { className: ["kanban-plugin__lane-wrapper"] },
                children: [] as any[]
              }
              const lane = {
                type: "element",
                tagName: "div",
                properties: { className: ["kanban-plugin__lane"] },
                children: [] as any[]
              }
              laneWrapper.children.push(lane)

              // Column header
              const header = {
                type: "element",
                tagName: "div",
                properties: { className: ["kanban-plugin__lane-header-wrapper"] },
                children: [] as any[]
              }
              // Lane title element: wrap heading text nodes in a <p>
              const titleEl = {
                type: "element",
                tagName: "div",
                properties: { className: ["kanban-plugin__lane-title"] },
                children: [
                  {
                    type: "element",
                    tagName: "p",
                    properties: {},
                    children: titleTextNodes
                  }
                ]
              }
              header.children.push(titleEl)
              lane.children.push(header)

              // Items container for cards
              const itemsContainer = {
                type: "element",
                tagName: "div",
                properties: {
                  className: [
                    "kanban-plugin__lane-items",
                    "kanban-plugin__scroll-container",
                    "kanban-plugin__vertical"
                  ]
                },
                children: [] as any[]
              }

              // If a list of cards exists, move each list item into our structure
              if (listEl) {
                listEl.children.forEach((itemNode: any) => {
                  if (itemNode.type !== "element" || itemNode.tagName !== "li") return
                  const listItem = itemNode

                  // Determine if this card is a task (checkbox-based)
                  const isTask = listItem.properties?.className?.includes("task-list-item")
                  let checked = false
                  if (isTask) {
                    const checkboxIndex = listItem.children.findIndex((child: any) =>
                      child.type === "element" &&
                      child.tagName === "input" &&
                      child.properties?.type === "checkbox"
                    )
                    if (checkboxIndex !== -1) {
                      const checkbox = listItem.children[checkboxIndex]
                      // Cast properties as any to access 'checked'
                      checked = (checkbox.properties as any).checked ?? false
                      // Remove the checkbox from the content; we'll reinsert it
                      listItem.children.splice(checkboxIndex, 1)
                    }
                  }

                  // Wrap card content: if the first child is a paragraph, unwrap it
                  let contentNodes = listItem.children
                  if (contentNodes.length === 1 && contentNodes[0].tagName === "p") {
                    contentNodes = contentNodes[0].children
                  }

                  // Build card element
                  const cardWrapper = {
                    type: "element",
                    tagName: "div",
                    properties: { className: ["kanban-plugin__item-wrapper"] },
                    children: [] as any[]
                  }
                  const card = {
                    type: "element",
                    tagName: "div",
                    properties: {
                      className: ["kanban-plugin__item"].concat(checked ? ["is-complete"] : [])
                    },
                    children: [] as any[]
                  }
                  cardWrapper.children.push(card)

                  // Card content container
                  const cardContent = {
                    type: "element",
                    tagName: "div",
                    properties: { className: ["kanban-plugin__item-content-wrapper"] },
                    children: [] as any[]
                  }
                  const titleWrapper = {
                    type: "element",
                    tagName: "div",
                    properties: { className: ["kanban-plugin__item-title-wrapper"] },
                    children: [] as any[]
                  }

                  // If this is a task, add a checkbox prefix
                  if (isTask) {
                    const cbEl = {
                      type: "element",
                      tagName: "input",
                      properties: {
                        type: "checkbox",
                        disabled: true,
                        className: ["kanban-plugin__checkbox"]
                      },
                      children: [] as any[]
                    }
                    if (checked) (cbEl.properties as any).checked = true
                    const prefix = {
                      type: "element",
                      tagName: "div",
                      properties: { className: ["kanban-plugin__item-prefix-button-wrapper"] },
                      children: [cbEl]
                    }
                    titleWrapper.children.push(prefix)
                  }

                  // Card content markdown container
                  const contentContainer = {
                    type: "element",
                    tagName: "div",
                    properties: { className: ["kanban-plugin__item-markdown"] },
                    children: contentNodes
                  }
                  titleWrapper.children.push(contentContainer)
                  cardContent.children.push(titleWrapper)
                  card.children.push(cardContent)
                  itemsContainer.children.push(cardWrapper)
                })
              }

              lane.children.push(itemsContainer)
              boardEl.children.push(laneWrapper)
            }
          }

          // If we assembled at least one column, replace original content with the board
          if (boardEl.children.length > 0) {
            const firstColIndex = children.findIndex(
              (node: any) => node.type === "element" && node.tagName === colTag
            )
            let lastColIndex = firstColIndex
            for (let j = firstColIndex; j < children.length; j++) {
              const nd: any = children[j]
              if (nd.type === "element" && nd.tagName === colTag) {
                lastColIndex = j
                if (
                  j + 1 < children.length &&
                  children[j + 1].type === "element" &&
                  (children[j + 1].tagName === "ul" || children[j + 1].tagName === "ol")
                ) {
                  lastColIndex = j + 1
                }
              } else {
                break
              }
            }
            children.splice(firstColIndex, lastColIndex - firstColIndex + 1, boardEl)
          }
        }
      ]
    },
    externalResources() {
      return {
        css: [
          {
            content: `
/* Kanban board container */
.kanban-plugin__board {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 0.5rem;
  overflow-x: auto;
}
/* Column (lane) styling */
.kanban-plugin__lane-wrapper {
  flex: 0 0 auto;
}
.kanban-plugin__lane {
  width: 270px;
  border: 1px solid var(--lightgray, #ccc);
  background-color: var(--light, #f9f9f9);
  border-radius: 4px;
  display: flex;
  flex-direction: column;
}
/* Column header */
.kanban-plugin__lane-header-wrapper {
  padding: 4px 8px;
  border-bottom: 1px solid var(--lightgray, #ccc);
  background-color: var(--lightgray, #eee);
}
.kanban-plugin__lane-title p {
  margin: 0;
  font-weight: bold;
  font-size: 1.1em;
}
/* Items container */
.kanban-plugin__lane-items {
  padding: 8px;
}
.kanban-plugin__lane-items > .kanban-plugin__item-wrapper {
  margin-bottom: 8px;
}
/* Kanban card styling */
.kanban-plugin__item {
  background-color: var(--light, #fff);
  border: 1px solid var(--lightgray, #ccc);
  border-radius: 4px;
}
.kanban-plugin__item.is-complete .kanban-plugin__item-markdown {
  text-decoration: line-through;
  color: var(--darkgray, #888);
}
/* Card content layout */
.kanban-plugin__item-content-wrapper {
  padding: 6px;
}
.kanban-plugin__item-title-wrapper {
  display: flex;
  align-items: baseline;
}
/* Checkbox prefix */
.kanban-plugin__item-prefix-button-wrapper {
  margin-right: 6px;
  display: flex;
  align-items: center;
}
.kanban-plugin__checkbox {
  pointer-events: none;
}
/* Card content */
.kanban-plugin__item-markdown p {
  margin: 0;
}
.kanban-plugin__item-markdown ul, 
.kanban-plugin__item-markdown ol {
  margin: 0;
}
.kanban-plugin__item-markdown ul {
  padding-left: 1.2em;
}
.kanban-plugin__item-markdown li {
  margin-bottom: 0.25em;
}
`
          }
        ]
      }
    }
  }
}
