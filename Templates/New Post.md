---
title: <% newTitle %>
draft: false
tags:
---
<%*
const title = tp.file.title;
let splitTitle;
if (title.startsWith("Untitled")) { 
    newTitle = await tp.system.prompt("Enter note title");

    await tp.file.rename(newTitle);
}
-%>
