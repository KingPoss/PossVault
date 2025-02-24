---
<%*
let newTitle = tp.file.title;
// 1) If file is named "Untitled...", prompt for a new name
if (newTitle.startsWith("Untitled")) {
  newTitle = await tp.system.prompt("Enter note title");
  await tp.file.rename(newTitle);
}
// 2) Now build the front matter as a string:
tR += `title: ${newTitle}\n`
tR += `draft: false\n`
tR += `tags: []\n`
%>
---