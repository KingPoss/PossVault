---
{"title":"How to set up Grandstream HT802v1 to use a rotary phone with VOIP.MS","draft":false,"tags":["telecoms"],"publish":true,"path":"content/telecoms/Grandstream HT802v1 Rotary Phone Configuration (voip.ms).md","permalink":"/content/telecoms/grandstream-ht-802v1-rotary-phone-configuration-voip-ms/","PassFrontmatter":true}
---

Gotten from the [voip.ms wiki](https://wiki.voip.ms/article/Grandstream_HandyTone_802_-_HT802), this YT vid from [Abraham Moller](https://www.youtube.com/watch?v=rktWAJB2EHU)

Click on FXS PORT1 and configure your settings accordingly:  
**Notice that it is necessary to use the same server for both the device and the DID number in order to get incoming calls correctly**

# Required settings

- _**Primary SIP Server**_: servername.voip.ms (one of VoIP.ms multiple [_**servers**_](https://wiki.voip.ms/article/Choosing_Server#Choosing_a_Server "Choosing Server"), you can choose the one closest to your location.)
- _**Failover SIP Server**_: (Please leave this Blank)
- _**Outbound Proxy**_: servername.voip.ms (Use the same server you used as _**Primary SIP Server**_.  
    _For firmware 1.0.15.4 and higher we recommend leaving blank the outbound proxy field_
- _**NAT Traversal**_: Keep-Alive
- _**SIP User ID**_: (Replace with your Main SIP account or Subaccount UserID, e.g. 100000 or 100000_sub)
- _**Authenticate ID**_: (Replace with your Main SIP account or Subaccount UserID, e.g. 100000 or 100000_sub)
- _**Authenticate Password**_: ****** (Use the SIP account password - By default this is the same as the Customer Portal)
- _**Name**_: Outbound callerID Name* **See the requirements below.**
- _**DNS Mode**_: A Record
- _**SIP Registration**_: Yes
- _**Unregister On Reboot**_: No
- _**Outgoing Call Without Registration**_: Yes
- _**Register Expiration**_: 5
- _**Allow Incoming SIP Messages from SIP Proxy Only**_: Yes
- _**Preferred DTMF method**_: SIP INFO, RFC2833, In-audio
- _**Use P-Access-Network-Info Header**_: No
- _**Use P-Emergency-info Header**_: No
- _**Enable Call Features**_: No
- _**Dial Plan**_: {[x*]+}
- _**Preferred Vocoder**_: PCMU, PCMA, G729
- _**Enable Pulse Dialing**_: Yes
- _**Pulse Dialing Standard**_: General Standard
- _**Enable Hook Flash**_: No
- _**Enable High Ring Power**_: Yes

# Optional Settings

- _**Gain RX**_: 0dB
- _**Dial Tone**_: f1=600@-17,c=4/4;  
    this gives it the old dial tone sound