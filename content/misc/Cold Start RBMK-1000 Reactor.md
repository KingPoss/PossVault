---
title: Cold Start RBMK-1000 Reactor
draft: false
tags:
  - misc
---
The following is a guide on how to cold start the RBMK-1000 Nuclear reactor within a simulator

You can download the simulator [here](https://github.com/gdzx/chernobyl-simulator)

CONDENSER CIRCULATING WATER PUMPS
1. Start Condenser Circulating Water Pumps 1 and 2
# WATER TREATMENT PUMPS AND CONDENSATE STORAGE
2. Start Water Treatment Pumps 1 and 2, and open associated flow valves
# CONDENSATE SYSTEM
3. Start 1 Condensate Pump, set DA Level Control to Auto, and set Polishers 1 and 2 to "IN"
# FEEDWATER PUMPS AND SYSTEM
4. Open inlet valve, wait until pressure reaches 100 percent, and turn on corresponding pump
5. Open corresponding discharge valve (it is done in this order to prevent cavitation in the pump system)
# OFF-LINE CORE COOLING SYSTEM
6. Turn off pumps in loop-1 and loop-2, and close outlet valves
# EMERGENCY CORE COOLING SYSTEM
7. Set ECC cooling valve to auto. this will cool the reactor if all else fails
# DEAERATOR STEAM SUPPLY 
8. Set to Auto
9. Set DA vent vlv to 50.0%
# REACTOR DRAIN CONTROL
10. setpoint to 4.0 inches, set to auto
# LOOP 1-2 RECIRCULATION PUMPS
11. Open inlet valve, wait until pressure reaches 100 percent, and turn on corresponding pump
12. Open corresponding discharge valve
# TURBINE SUPPORT SYSTEMS
13. Start lube oil
14. Start hydraulic oil
15. Open steam drain
# TURBINE CONTROLS
16. Reset turbine trip
17. Set turning gear to on
18. Once Speed Setpoint is at 20.0 RPM, an alarm will sound GO TO -->
# TURBINE SUPPORT SYSTEMS
19. Start steam seal
# REACTOR POWER REGULATION
20. Turn on Auto SCRAM control to prevent runaway reactions
# ABSORBER ROD CONTROL
21. Select CENTER CORE ONLY, and select (f) for fast. this controls how fast a rod is pulled out or inserted.
