---
title: How to set up Grandstream HT802v1 to use a rotary phone with VOIP.MS
draft: false
tags:
  - communications
  - "#telecoms"
---
Gotten from the [voip.ms wiki](https://wiki.voip.ms/article/Grandstream_HandyTone_802_-_HT802), this YT vid from [Abraham Moller](https://www.youtube.com/watch?v=rktWAJB2EHU)

Click on FXS PORT1 and configure your settings accordingly:  
**Notice that it is necessary to use the same server for both the device and the DID number in order to get incoming calls correctly**

# Required settings

- **Primary SIP Server**: servername.voip.ms (one of VoIP.ms multiple [_**servers**_](https://wiki.voip.ms/article/Choosing_Server#Choosing_a_Server "Choosing Server"), you can choose the one closest to your location.)
- **Failover SIP Server**: (Please leave this Blank)
- **Outbound Proxy**: servername.voip.ms (Use the same server you used as **Primary SIP Server**.  
    _For firmware 1.0.15.4 and higher we recommend leaving blank the outbound proxy field_
- **NAT Traversal**: Keep-Alive
- **SIP User ID**: (Replace with your Main SIP account or Subaccount UserID, e.g. 100000 or 100000_sub)
- **Authenticate ID**: (Replace with your Main SIP account or Subaccount UserID, e.g. 100000 or 100000_sub)
- **Authenticate Password**: ****** (Use the SIP account password - By default this is the same as the Customer Portal)
- **Name**: Outbound callerID Name* **See the requirements below.**
- **DNS Mode**: A Record
- **SIP Registration**: Yes
- **Unregister On Reboot**: No
- **Outgoing Call Without Registration**: Yes
- **Register Expiration**: 5
- **Allow Incoming SIP Messages from SIP Proxy Only**: Yes
- **Preferred DTMF method**: SIP INFO, RFC2833, In-audio
- **Use P-Access-Network-Info Header**: No
- **Use P-Emergency-info Header**: No
- **Enable Call Features**: No
- **Dial Plan**: {[x*]+}
- **Preferred Vocoder**: PCMU, PCMA, G729
- **Enable Pulse Dialing**: Yes
- **Pulse Dialing Standard**: General Standard
- **Enable Hook Flash**: No
- **Enable High Ring Power**: Yes

# Optional Settings

- **Gain RX**: 0dB
- **Dial Tone**: f1=600@-17,c=4/4;  
    this gives it the old dial tone sound