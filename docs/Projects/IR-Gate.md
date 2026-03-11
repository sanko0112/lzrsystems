---
tags:
  - PCB
  - Altium
  - STM32
  - LoRa
  - RF
  - Formula-Student
  - C/C++
  - CubeIDE
---

![Logo](../assets/Gallery/FS-IR-Gate/IR-Gate-logo.svg)

<h2>IR-Gate is a <strong>LoRa-enabled 38 kHz infrared timing gate</strong> for lap timing and speed trap applications. It uses a TSOP34838 IR receiver and a bank of BIR-BM5381G IR LEDs with a Semtech LR1121-based LoRa module for wireless synchronization, powered by an onboard Li-Ion cell with USB-C charging.</h2>

## :simple-electron: Features
- **38 kHz IR receiver**: TSOP34838 — demodulated digital output directly to STM32
- **6× BIR-BM5381G IR LEDs** — N-MOSFET (PMV20XNER) switched, driven via `LED_GATE` signal from MCU
- **LoRa module**: E80-900M (Semtech LR1121) — dual-band Sub-GHz + 2.4 GHz
- **3-way RF switch**: BGSA14GN10E6327XTSA1 (100 kHz – 5 GHz) — routes 868 MHz or 2.4 GHz to shared SMA antenna
- **Matching network**: TBD inductors/capacitors for RF_MATCH between switch and antenna
- **MCU**: STM32F103C8T6
- **USB-C** with ESD protection (TPD4E001) and Li-Ion battery charging
- **Battery**: 1S Li-Ion cell via onboard BAT1 terminal, TP4054-42 charger (500 mA)
- **3.3V LDO**: onsemi NCP114ASN330T1G
- **SWD debug header** (6-pin, 1.27mm)
- **SMA edge connector** for external antenna

## :fontawesome-solid-tools: Hardware

**Microcontroller: STM32F103C8T6**

- 32-bit Arm® Cortex®-M3, up to 72 MHz
- 64 kB Flash, 20 kB SRAM
- SPI → E80-900M (MISO, MOSI, SCK, NSS, BUSY, LR_RST, IRQ) with 22Ω series damping resistors
- GPIO: IR_RX (from TSOP34838), LED_GATE (IR LED drive), CTRL1/CTRL2 (RF switch)
- Debug: SWD, SWO
- 8 MHz crystal
- Package: LQFP-48

**LoRa Module: E80-900M (LR1121-based)**

- Dual-band: Sub-GHz 868 MHz + 2.4 GHz
- LoRa / (G)FSK modulation
- Dedicated 868M ANT and 2.4G ANT pins routed to BGSA14GN10E6327XTSA1 RF switch
- SPI interface with BUSY/IRQ handshake
- LR_RST controlled by STM32
- +3V3 powered

**3-Way RF Switch: BGSA14GN10E6327XTSA1**

- Operating range: 100 kHz – 5 GHz
- CTRL1 / CTRL2 logic from STM32 selects RF_868MHz, RF_2.4GHz, or RF_MATCH path
- RFC → antenna matching network → SMA connector

**IR Receiver: TSOP34838**

- 38 kHz carrier frequency demodulation
- Active-low digital output → STM32 IR_RX pin
- 1µF decoupling on VS pin
- +3V3 powered

**IR LED Bank**

- 6× BIR-BM5381G infrared LEDs (850 nm)
- Each LED has a dedicated 62Ω series current-limiting resistor
- All anodes tied to +VBATT (unregulated battery voltage for maximum drive current)
- Common cathode switched via PMV20XNER N-MOSFET (Q2), gate driven by STM32 `LED_GATE` with 62Ω gate resistor (R17)

**Power Architecture**

- **Battery**: 1S Li-Ion via BAT1 onboard terminal + 22µF bulk cap
- **Charger**: TP4054-42-SOT25-R, 500 mA (set by 2.2kΩ PROG resistor), charged via USB-C VBUS
- **Power switch**: DMG2305UX-7 P-MOSFET (Q1), gate driven by USB-C FET_Gate / FET_Drain logic
- **3.3V rail**: NCP114ASN330T1G LDO — feeds STM32, E80-900M, RF switch, and TSOP
- **USB-C**: USB4105-GF-A, ESD: TPD4E001RDBVR, CC: 5.1kΩ pull-downs (UFP)
- **Charge indicator**: red LED (D1) with 1kΩ

**Headers & Connectors**

| Connector | Type | Signals |
|---|---|---|
| Antenna | CON-SMA-EDGE-S | RF_ANT (50Ω) |
| USB-C | USB4105-GF-A | VBUS, D+/D−, CC1/CC2 |
| SWD | 6-pin pad (1.27mm) | VCC, NRST, GND, SWO, SWCLK, SWDIO |
| Battery | BAT1 terminal | +VBATT, GND |

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
<iframe src="https://personal-viewer.365.altium.com/client/index.html?feature=embed&source=2F1DBBCF-06CD-4721-9201-202C3310873E&activeView=3D" width="1280" height="600" style="overflow:hidden;border:none;width:100%;height:600px;" scrolling="no" allowfullscreen="true" onload="window.top.scrollTo(0,0);"></iframe>

## :material-fast-forward: Quick start
1. Charge the Li-Ion cell via USB-C before first use
2. Connect a UHF/2.4 GHz antenna to the SMA connector
3. Flash firmware via SWD (STM32CubeIDE / OpenOCD)
4. Align the IR LED bank and TSOP34838 receiver across the timing gate gap
5. The MCU modulates the IR LED bank at 38 kHz — the TSOP demodulates and outputs a clean digital break-beam signal
6. Timing events are transmitted wirelessly via LoRa to the paired timing system

## :fontawesome-solid-biohazard: Safety

- **IR LEDs are driven directly from VBATT** — do not stare directly into the LED array during operation
- **Ensure antenna is connected before enabling LoRa TX** — transmitting without antenna load may damage the LR1121 PA
- **Li-Ion cell must be a protected cell or have external protection** — the TP4054 provides charge protection but not cell-level overdischarge protection
- **38 kHz IR output is eye-safe at normal operating distances** but avoid close-range direct exposure

## 🔜 Firmware
**Firmware for IR break-beam detection, timing event handling, and LoRa synchronization coming soon.**

## :octicons-image-24: Photos
<div id="IR-Gate-gallery"></div>

## :fontawesome-solid-download: Downloads
[IR-Gate.zip](https://github.com/sanko0112/IR-Gate/archive/refs/heads/main.zip)
```shell
git clone https://github.com/sanko0112/IR-Gate.git
cd IR-Gate
```