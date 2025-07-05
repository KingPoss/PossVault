
# Template

1.  Set footer to always sit at bottom of webpage regardless of `<main>` size.
2.  I  think more time-based theme stuff would be cool. certain things only appearing on the weekend, or on certain days when I broadcast. Maybe set up some more elements to appear
3. Possibly add alternate theme(s), esp since all colors n such are currently being supplied w/ variables in css. (this will not work for elements like the tockify calendar/cbox widget)

# Index
1. Create more ads to go on the bulletin
2. Make some javascript to display different ads every 30 seconds or so, perhaps have another that show 'special events' from an asset folder, so putting a promotional image for an interview or something in there would automatically have it displayed. Maybe have that switch out with, if there IS no promotion, it automatically switches out to ads that are displayed depending on the day of the week
3. Link to friends directly on index, add 88x31s for all my friends
4. Round out border edges surrounding `personal news` and `site updates`, perhaps style as dots as bulletin is (i think this is the only instance of me using a dashed border)

# About Me

1. Perhaps refresh images used
2. Change text to something more up to date
3. Include a different section that includes different hobbies, or images of places I like or have seen. Let people get a better idea of who I am.
4. Do I really want people reaching out via telegram OR signal? maybe drop and just have phone/email and link to discord somewhere else? may be better

# Art
1. Add nature photos back/fix broken images
2. Re-establish NeoGallery synchronization
3. Style art modal w/ background and rounded edges, consistent w/ the rest of the site
4. Add hover effects on links/images so it's clear when it will take you elsewhere
5. Perhaps add some text explaining the page
6. Perhaps add a shuffle button or something to make it more clear you can refresh the random selection page
7. Re-add border to all art pages
8. Probably gonna have to re-do how NeoGallery deals w/ adding new genres to deal w/ this usecase (imgs/different style than simple stacked links. and a way to add the image you want to act as the 'cover' for the link case)
9. Add nature photos, and a fish photos section. maybe combine them


# Blog (formerly thoughts)
This will have to involve creating a custom layout for quartz that mirrors the site layout, and creating a different subdomain like blog.kingposs.com to host it. Clicking on any of the other buttons on the navbar will route you back to kingposs.com

I have already created a help thread on the quartz discord, but i think my lack of adequate wording has ruined my chances of getting help there. I will need to better understand the [documentation](https://quartz.jzhao.xyz/layout) regarding the subject, and link a new github for it entirely. Once this is done, I can mirror the same on my [knowledge base](https://kb.kingposs.com/)

# Radio
1. Create audio player layout for consistent styling across all browsers
2. Set tockify bottom border to orange or another color in the rotapallete
3. Set up radio widgets to stack when shrunk in a flexbox
4. Add all recordings (grandpa, carter, lunite chronological order)
5. Add the cbox that only shows up during live broadcasts

# Projects
Possibly scrap projects page? it's irritating to update as it's so different, and blog and knowledge base would be more than adequate to document all my goings-on, in a much more accessible (easier to update) way. Beyond this, the page hasn't been remade yet

# Programs
Possibly drop as well - Reassess the importance of this page/how much I update it. I could keep it going elsewhere under knowledge base, this way it's easier for me to update and keep track of. Otherwise, remake from blank.html template

# Cool sites
1. Remake page from blank.html template
2. Update, clean up old entries, readd paintkiller, add new ppl

# Guestbook
Remake page from blank.html template. Do I really want the guestbook in it's current iteration? I like it, but it's also dependent on google (i mean so is my calendar), and I cant censor slurs from coming through. The vector of putting something malicious like an IPGrabber/screamer in the website field is also not lost on me, since all it displays is 'website', and some people may not think before they click. I of course get updates near instantly when someone posts something, and it's not like I receive that much web traffic, but is it something I really want? 

Possibly figure out if there's another way to do the guest book that isn't dependent on these free guestbook services. (self host?) or figure out if I can have a script that runs on edit in google sheets that will automatically delete any entry w/ a slur detected. that brings to light more questions:

 - Is it possible to do this with regex without detecting words like 'night', etc etc?
 - If not, they will most likely just use basic substition or sub/super script to get away with writing it in a different way.
 - this isn't the biggest issue, just annoying
 - current implementation of this does not gather IP or anything, so it is impossible to ban a ner-do-well from commenting on the guestbook ( of course there are ways around this, everyone has a vpn)
