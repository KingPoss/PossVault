---
title: KP radio phone tree logic
draft: false
tags:
  - telecoms
---
# Phone tree logic for KPradio.net
![[phonetree.png]] 
 Once a caller presses #1, a time condition is checked. If it's too late (10:00 PM to 7:00 AM PST), the caller is sent to a voice mailbox that tells them to call back later, and gives them the option to leave a voicemail. 
 If the time condition does not flag, the caller will be moved to the KP Radio Calling Queue. 
 There, the main SIP and queue is checked. If the mainline SIP (microSIP on PC) is unavailable or no one is logged into the queue to answer calls, send caller to the KP Radio ringer group.
 The KP radio ringer group consists of the mobile softphone client, and rotary phone connected to VOIP via ATA.
 From here, the call can be answered by either the rotary or mobile phone. This allows me to receive calls to the station, even when away, or when a broadcast is not currently live.


```mermaid

kanban
  Todo
    [Create Documentation]
    docs[Create Blog about the new diagram]
  [In progress]
    id6[Create renderer so that it works in all cases. We also add som extra text here for testing purposes. And some more just for the extra flare.]
  id9[Ready for deploy]
    id8[Design grammar]@{ assigned: 'knsv' }
  id10[Ready for test]
    id4[Create parsing tests]@{ ticket: MC-2038, assigned: 'K.Sveidqvist', priority: 'High' }
    id66[last item]@{ priority: 'Very Low', assigned: 'knsv' }
  id11[Done]
    id5[define getData]
    id2[Title of diagram is more than 100 chars when user duplicates diagram with 100 char]@{ ticket: MC-2036, priority: 'Very High'}
    id3[Update DB function]@{ ticket: MC-2037, assigned: knsv, priority: 'High' }

  id12[Can't reproduce]
    id3[Weird flickering in Firefox]

```