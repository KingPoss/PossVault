import { QuartzTransformerPlugin } from "../types"  // import Quartz types (adjust path as needed)

export const Kanban: QuartzTransformerPlugin = () => {
  return {
    name: "Kanban",
    htmlPlugins() {
      return [
        () => (tree, file) => {
          // Only transform if frontmatter has kanban: true
          const fm: any = file.data.frontmatter || {}
          if (!fm.kanban) return

          // Determine the heading level used for columns (e.g., H2 by default)
          const children = tree.children
          const headingLevels = children
            .filter((node: any) => node.type === "element" && /^h\d$/.test(node.tagName))
            .map((node: any) => parseInt(node.tagName[1]))
          if (headingLevels.length === 0) return
          // Use the smallest heading level that occurs more than once (i.e., multiple columns).
          // If only one level appears, use that.
          let colLevel = headingLevels.sort()[0]
          for (const lvl of headingLevels) {
            if (headingLevels.filter(x => x === lvl).length > 1) { colLevel = lvl; break }
          }
          const colTag = "h" + colLevel

          // Build new Kanban board element
          const boardEl = {
            type: "element",
            tagName: "div",
            properties: { className: ["kanban-plugin__board"] },
            children: [] as any[]
          }

          // Iterate through children, grouping headings and their list items
          for (let i = 0; i < children.length; i++) {
            const node: any = children[i]
            if (node.type === "element" && node.tagName === colTag) {
              // This is a column heading
              const headingEl = node
              const headingTextNodes = headingEl.children  // text and formatting nodes of heading
              const titleText = headingTextNodes  // we will reuse these in the new structure

              // Look ahead for a list (<ul> or <ol>) right after the heading for cards
              let listEl: any = null
              if (i + 1 < children.length && children[i+1].type === "element" && (children[i+1].tagName === "ul" || children[i+1].tagName === "ol")) {
                listEl = children[i+1]
              }

              // Create column (lane) wrapper
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
              // Lane title element (wrap heading text in a <p> for styling consistency)
              const titleEl = {
                type: "element",
                tagName: "div",
                properties: { className: ["kanban-plugin__lane-title"] },
                children: [
                  {
                    type: "element",
                    tagName: "p",
                    properties: {},
                    children: titleTextNodes  // reuse the heading's text content nodes here
                  }
                ]
              }
              header.children.push(titleEl)
              lane.children.push(header)

              // Items container
              const itemsContainer = {
                type: "element",
                tagName: "div",
                properties: { className: ["kanban-plugin__lane-items", "kanban-plugin__scroll-container", "kanban-plugin__vertical"] },
                children: [] as any[]
              }

              // If a list of cards exists, move each list item into our structure
              if (listEl) {
                // Collect all list items (each will become a card)
                listEl.children.forEach((itemNode: any) => {
                  if (itemNode.type !== "element" || itemNode.tagName !== "li") return
                  const listItem = itemNode

                  // Determine if this card is a checked task
                  const isTask = listItem.properties?.className?.includes("task-list-item")
                  let checked = false
                  if (isTask) {
                    // Find any checkbox input in the list item
                    const checkboxIndex = listItem.children.findIndex((child: any) =>
                      child.type === "element" && child.tagName === "input" && child.properties?.type === "checkbox")
                    if (checkboxIndex !== -1) {
                      const checkbox = listItem.children[checkboxIndex]
                      checked = checkbox.properties.checked ?? false
                      // Remove the checkbox from content; we'll re-insert it in the card prefix
                      listItem.children.splice(checkboxIndex, 1)
                    }
                  }

                  // Wrap card content (everything in the <li> after removing the checkbox)
                  // If the first child is a paragraph tag created by the Markdown parser, unwrap it (we’ll just use its children)
                  let contentNodes = listItem.children
                  if (contentNodes.length === 1 && contentNodes[0].tagName === "p") {
                    contentNodes = contentNodes[0].children
                  }

                  // Build the card element
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

                  // If was a task item, add a checkbox prefix
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
                    if (checked) cbEl.properties.checked = true
                    // Prefix wrapper for checkbox (for styling/spacing)
                    const prefix = {
                      type: "element",
                      tagName: "div",
                      properties: { className: ["kanban-plugin__item-prefix-button-wrapper"] },
                      children: [ cbEl ]
                    }
                    titleWrapper.children.push(prefix)
                  }

                  // Card content markdown
                  const contentContainer = {
                    type: "element",
                    tagName: "div",
                    properties: { className: ["kanban-plugin__item-markdown"] },
                    children: contentNodes  // use the list item's remaining content nodes
                  }
                  titleWrapper.children.push(contentContainer)
                  cardContent.children.push(titleWrapper)
                  card.children.push(cardContent)
                  itemsContainer.children.push(cardWrapper)
                });
              }

              lane.children.push(itemsContainer)
              boardEl.children.push(laneWrapper)
            } // if heading matches colLevel
          }

          // If we assembled at least one column, replace original content with the board
          if (boardEl.children.length > 0) {
            // Remove original Kanban sections (headings and lists) from the AST
            /** 
             * We find the start index of the first Kanban column and the end index of the last.
             * Everything in between (inclusive) will be removed. This assumes the Kanban columns 
             * are contiguous in the document, which is typical if the note is just the board.
             */
            const firstColIndex = children.findIndex((node: any) => node.type === "element" && node.tagName === colTag)
            let lastColIndex = firstColIndex
            for (let j = firstColIndex; j < children.length; j++) {
              const nd: any = children[j]
              if (nd.type === "element" && nd.tagName === colTag) {
                lastColIndex = j
                // skip the list immediately following this heading
                if (j + 1 < children.length && children[j+1].type === "element" && (children[j+1].tagName === "ul" || children[j+1].tagName === "ol")) {
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
      // Inject CSS styles for Kanban board appearance
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
  width: 270px;  /* fixed column width; adjust as needed */
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
/* Column items container */
.kanban-plugin__lane-items {
  padding: 8px;
  /* no border on container (we use card borders instead) */
}
.kanban-plugin__lane-items > .kanban-plugin__item-wrapper {
  margin-bottom: 8px;
}
/* Kanban card (item) styling */
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
/* Checkbox prefix (for task cards) */
.kanban-plugin__item-prefix-button-wrapper {
  margin-right: 6px;
  display: flex;
  align-items: center;
}
/* Style the checkbox (optional: use if default checkbox needs tweak) */
.kanban-plugin__checkbox {
  pointer-events: none;
}
/* Card content (markdown within card) */
.kanban-plugin__item-markdown p {
  margin: 0;
}
.kanban-plugin__item-markdown ul, .kanban-plugin__item-markdown ol {
  margin: 0;
}
.kanban-plugin__item-markdown ul {
  padding-left: 1.2em; /* indent sub-items slightly */
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
