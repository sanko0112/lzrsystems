---
tags:
  - PCB
  - Altium
  - Formula-Student
  - Analog
  - Safety
---

![Logo](../assets/Gallery/YABSPD/YABSPD-logo.svg)

<h2>YABSPD is a <strong>double-redundant Brake System Plausibility Device</strong> for Formula Student applications. Two fully independent analog circuits — built from different component manufacturers — monitor throttle position and brake pressure simultaneously, tripping a 35A automotive relay with a user-selectable AND logic between both circuits.</h2>

## :simple-electron: Features
- **Double redundancy** — Circuit 1 and Circuit 2 operate fully independently with different component manufacturers for enhanced safety
- **Circuit 1**: LM2903M8 comparators + 74LVC2G08 NAND logic
- **Circuit 2**: LM393B comparators + NL27WZ08 dedicated AND/OR logic
- **Selectable operation**: Circuit 1 only, Circuit 2 only, or both (AND of both outputs) via solder bridges SB1/SB2
- **Omron G8G-17R 35A automotive relay** with N-FET (PMV20XNER) gate drive
- **XT60 IP67** input connector for high-current traction path
- **100–300 ms input jitter filter** (RC delay, 27kΩ + 10µF) on all four sensor inputs
- **10-second timeout** — RC timer (510kΩ + 100µF) latches the fault; requires manual reset
- **Manual reset** — tactile button (×2, one per circuit) + JST-XH external reset connector
- **+100 mV comparator hysteresis** to prevent false triggering at threshold
- **Adjustable reference voltages** via 100kΩ trimpots (VR1–VR6) or fixed resistor networks (pre-calculated, DNP swappable)
- **Optional input attenuation** — DNP resistor dividers on all four inputs for signals > 5V
- **Weak pull-up failsafe** on all comparator inputs — open sensor defaults to fault condition
- **Status LEDs**: OUT1 (red), OUT2 (red), OUT1|OUT2 (green), fault indicators per comparator output
- **5V regulated supply** — L78M05 linear regulator from VBATT
- **4× JST-GH 4-pin sensor inputs** (Throttle 1, Throttle 2, Brake 1, Brake 2)

## :fontawesome-solid-tools: Hardware

**Comparators**

| Circuit | Throttle comparator | Brake comparator | 10s timer comparator |
|---|---|---|---|
| Circuit 1 | LM2903M8-13 (IC1A) | LM2903M8-13 (IC1B) | LM2903M8-13 (IC3A) |
| Circuit 2 | LM393BIDR (IC4A) | LM393BIDR (IC4B) | LM393BIDR (IC6A) |

- Open-collector outputs with 27kΩ pull-ups (+5V)
- ~100mV hysteresis added via positive feedback resistor network (360kΩ feedback, 4.7kΩ / 15kΩ divider)
- Each comparator monitors its input against an independently adjustable reference voltage

**Input Conditioning (per channel)**

- **Jitter filter**: 27kΩ series resistor + 10µF capacitor → 270ms RC time constant
- **Failsafe pull-up**: 27kΩ to +5V — if sensor wire is disconnected, input floats high → fault
- **Optional attenuation**: DNP resistor divider on RAW input (for sensors with >5V output)
- **Input connectors**: SM02B-GHS-TB JST-GH (signal + S_REF tie point)

**Reference Voltage Networks**

Each reference (Throttle_REF_1, Brake_REF_1, Throttle_REF_2, Brake_REF_2, 10s_REF1, 10s_REF2) is adjustable via a **67YR100KLF 100kΩ trimpot** between +5V and GND, or can be set to fixed values using the pre-populated resistor divider networks:

| Reference | Default fixed value | Divider ratio |
|---|---|---|
| Throttle_REF_1 | 0.7 V | 6.144 (27kΩ / 3.3kΩ + 390Ω) |
| Brake_REF_1 | 0.5 V | 8.947 (27kΩ / 2.2kΩ + 2.2kΩ) |
| Throttle_REF_2 | Adjustable | Same topology, different values |
| Brake_REF_2 | Adjustable | Same topology, different values |

**10-Second Timeout Circuit (per circuit)**

- RC time constant: 510kΩ × 100µF = **51 seconds** (time to charge beyond 10s_REF threshold ≈ 10s depending on trimpot setting)
- Once the timer comparator (COMP 3 / COMP 6) trips, it latches the output LOW
- **Manual reset** discharges the capacitor via reset tactile (S1 / S2) or external JST-XH connector (P2)
- 10s_REF trimpot allows fine-tuning of the exact timeout duration

**Logic and Output Stage**

- **Circuit 1 AND**: 74LVC2G08GS (IC2) — 2-input AND gate, Throttle_1_OUT AND Brake_1_OUT → AND1_OUT
- **Circuit 2 AND**: NL27WZ08USG (IC5) — 2-input AND gate, Throttle_2_OUT AND Brake_2_OUT → AND2_OUT
- **Final AND**: 74LVC2G08GS (IC7) — AND1_OUT AND AND2_OUT → OUT1|OUT2
- **Solder bridges**: SB1/SB2 allow bypassing either circuit's AND output for single-circuit or dual-circuit operation
- **Relay driver**: PMV20XNER N-channel MOSFET (Q1), 100Ω gate resistor, 4.7kΩ pull-down
- **Relay**: Omron G8G-17R_DC12, 35A, COM/NO contacts, coil driven from VBATT via MOSFET
- **Flyback diode**: B140Q-13-F Schottky across relay coil

**Truth Table (OUT̄ = relay coil drive, active-low fault)**

| BR_TH1 | TR_TH1 | BR_TH2 | TR_TH2 | OUT̄ | Condition |
|:---:|:---:|:---:|:---:|:---:|---|
| 0 | 0 | 0 | 0 | 1 | Normal operation |
| 0 | 0 | 0 | 1 | 1 | Only Throttle 2 high |
| 0 | 0 | 1 | 0 | 1 | Only Brake 2 high |
| 0 | 0 | 1 | 1 | **0** | **FAULT — Circuit 2** |
| 0 | 1 | 0 | 0 | 1 | Only Throttle 1 high |
| 0 | 1 | 0 | 1 | 1 | Both Throttles high |
| 0 | 1 | 1 | 0 | 1 | Brake 2 + Throttle 1 |
| 0 | 1 | 1 | 1 | **0** | **FAULT — Circuit 2** |
| 1 | 0 | 0 | 0 | 1 | Only Brake 1 high |
| 1 | 0 | 0 | 1 | 1 | Brake 1 + Throttle 2 |
| 1 | 0 | 1 | 0 | 1 | Both Brakes high |
| 1 | 0 | 1 | 1 | **0** | **FAULT — Circuit 2** |
| 1 | 1 | 0 | 0 | **0** | **FAULT — Circuit 1** |
| 1 | 1 | 0 | 1 | **0** | **FAULT — Circuit 1** |
| 1 | 1 | 1 | 0 | **0** | **FAULT — Circuit 1** |
| 1 | 1 | 1 | 1 | **0** | **FAULT — Both Circuits** |

**Power Architecture**

- **Input**: VBATT (car accumulator / 12V supply) via XT60 IP67 connector (J5)
- **5V rail**: L78M05CDT-TR linear regulator → powers all comparators, logic, and references
- **Bulk decoupling**: 10µF × 2 on VBATT; 100µF × 3 on signal paths
- **JST-XH 2-pin** (P1): external +VBATT input solder alternative

**Headers & Connectors**

| Connector | Type | Signals |
|---|---|---|
| T1 IN | SM02B-GHS-TB (×4-pin) | RAW_Throttle_1, S_REF_1 |
| B1 IN | SM02B-GHS-TB (×4-pin) | RAW_Brake_1, S_REF_2 |
| T2 IN | SM02B-GHS-TB (×4-pin) | RAW_Throttle_2, S_REF_3 |
| B2 IN | SM02B-GHS-TB (×4-pin) | RAW_Brake_2, S_REF_4 |
| OUT (relay NO) | 220AMA04R 4-pin | COM_1, COM_2, N.O._1, N.O._2 |
| OUT1 / OUT2 | Solder pads | Individual circuit outputs |
| XT60 | XT60PW-M (IP67) | +VBATT, NEG |
| Reset | S2B-XH-A (P2) | RST_Button, GND |
| VBATT in | S2B-XH-A (P1) | +VBATT, GND |

### :material-notebook-edit: Schematics / PCB / 3D
***Keybinds***

- Select `LMB`
- Zoom In/Out `Scroll`
- Pan `RMB Drag`
- Rotate in 3D `LMB Drag`
- Reset View `R`
- Switch to 2D `2`
- Switch to 3D `3`
- Next / Previous Layer `+/-`
- Flip Board Top / Bottom `F`

<!-- TODO: Replace with Altium 365 embed link -->
<iframe src="https://personal-viewer.365.altium.com/client/index.html?feature=embed&source=A57CC68B-2B87-4048-9AC9-1E645D6F00DC&activeView=SCH" width="1280" height="600" style="overflow:hidden;border:none;width:100%;height:600px;" scrolling="no" allowfullscreen="true" onload="window.top.scrollTo(0,0);"></iframe>

## :material-fast-forward: Quick start
1. Connect VBATT (12V) to the XT60 IP67 connector
2. Connect throttle position sensors to **T1 IN** and **T2 IN**
3. Connect brake pressure sensors to **B1 IN** and **B2 IN**
4. Adjust the trimpots (VR2, VR3, VR5, VR6) to match your sensor output voltages at the trip threshold, or populate the pre-calculated fixed resistor networks
5. Set VR1 / VR4 to configure the 10-second timeout reference
6. Select circuit operation using solder bridges SB1 / SB2
7. Wire the relay NO contacts (OUT connector) in series with your AIR (Accumulator Isolation Relay) interlock chain

## :fontawesome-solid-biohazard: Safety

- **This board is a safety-critical device** — verify correct operation with known-good sensor signals before installing in the car
- **Double-check reference voltages** with a multimeter before connecting live sensors — an incorrectly set REF will cause either permanent fault or missed fault conditions
- **The 10s timer latches** — a sustained simultaneous brake + throttle event requires a manual reset press before the relay will re-engage
- **Open-sensor failsafe is active** — any disconnected sensor input will pull high via the 27kΩ pull-up, tripping that comparator; do not leave inputs floating during testing
- **Verify solder bridge configuration** (SB1/SB2) before power-on — incorrect bridge state may disable one or both redundant circuits
- **XT60 is rated for the traction circuit current** — ensure the relay contacts and wiring are rated for your maximum motor current

## :octicons-image-24: Photos
<div id="YABSPD-gallery"></div>

## :fontawesome-solid-download: Downloads
[YABSPD.zip](https://github.com/sanko0112/YABSPD/archive/refs/heads/main.zip)
```shell
git clone https://github.com/sanko0112/YABSPD.git
cd YABSPD
```