---
tags:
  - PCB
  - Altium
  - STM32
  - LoRa
  - RF
  - C/C++
  - CubeIDE
---

![Logo](../assets/Gallery/Telemetrium/telemetrium-logo.png)

<h2>Telemetrium is a <strong>dual-band, full-duplex LoRa telemetry board</strong> built around two independent Semtech LR1121 transceivers. With dedicated external PAs, calculated RX matching networks, dedicated baluns, and harmonic LPFs on both bands, it delivers +27 dBm on Sub-GHz and +22 dBm on 2.4 GHz simultaneously — enabling true full-duplex operation over long range.</h2>

## :simple-electron: Features
- **2× Semtech LR1121** — dual-band transceivers (Sub-GHz + 2.4 GHz), one per channel
- **True full-duplex** — LR1121_1 TX while LR1121_2 RX, and vice versa
- **Sub-GHz band**: SKY66423-11 FEM, +27 dBm output, DEA100915LT-6319A1 LPF
- **2.4 GHz band**: RFX2401C FEM, +22 dBm output, DLF162500LT-5028A1 LPF
- **SKY13453-385LF** SP2T RF switch per transceiver for antenna routing
- **HHM1932A2** differential Sub-GHz RX balun (per transceiver)
- **Calculated RX and RFO port matching networks** (Smith chart optimized, VSWR 1.06 @ 868 MHz)
- **3rd harmonic notch filter** on Sub-GHz RFO path
- **32 MHz TCXO** (±2 ppm, X1G004131004212) per transceiver
- **Microcontroller**: STM32G474CCT6
- **USB-C** with ESD protection (TPD4E001) and TPS2116 power mux (USB / JST-GH)
- **JST-GH 4-pin** UART header (TX, RX, 5V, GND)
- **SWD debug header** (6-pin, 1.27mm)
- **WS2812B ARGB LED**
- **BOOT0 / NRST** tactile buttons
- **3.3V buck** (AP63200WU-7) from 5V input
- **2× SMA edge connectors** (one per transceiver)

## :fontawesome-solid-tools: Hardware

**Microcontroller: STM32G474CCT6**

- 32-bit Arm® Cortex®-M4 with FPU
- Up to 170 MHz CPU frequency
- 512 kB Flash, 128 kB SRAM
- SPI1 → LR1121_1 (NSS, SCK, MISO, MOSI, BUSY, IRQ, RST)
- SPI2 → LR1121_2 (NSS, SCK, MISO, MOSI, BUSY, IRQ, RST)
- USART1 → JST-GH UART header
- Debug: SWD, SWO
- Package: LQFP-48

**Transceiver: Semtech LR1121 (×2)**

- Dual-band: Sub-GHz (150–960 MHz) + 2.4 GHz (2.4–2.5 GHz) simultaneously
- LoRa, (G)FSK, BPSK modulation
- Integrated PA, LNA, and frequency synthesizer
- RFO_HP_LF port used for Sub-GHz TX (external PA chain)
- RFI_N/P_LF0 differential port used for Sub-GHz RX (balun + matching network)
- RFIO_HF port used for 2.4 GHz (external FEM)
- 32 MHz VTCXO reference (±2 ppm)
- SPI interface, up to 16 MHz
- Package: QFN-33

**Sub-GHz Front End (per transceiver): SKY66423-11**

- +27 dBm TX output power
- Integrated PA + LNA
- CPS / CTX logic control from STM32
- Harmonic filter: DEA100915LT-6319A1 Sub-GHz LPF
- Differential RX input via HHM1932A2 balun

**2.4 GHz Front End (per transceiver): RFX2401C**

- +22 dBm TX output power
- Integrated PA + LNA
- TXEN / RXEN logic control from STM32
- Harmonic filter: DLF162500LT-5028A1 2.4 GHz LPF
- DC blocking on RFIO_HF path

**RF Switch (per transceiver): SKY13453-385LF**

- SP2T — routes Sub-GHz or 2.4 GHz path to shared SMA antenna
- VCTL logic control from STM32 (SW4 signal)
- +3V3 biased

**RX Matching Network (Sub-GHz, per transceiver)**

- Input impedance from LR1121 RFI port: Z = 9.40 Ω − 141j Ω
- Matching to 50 Ω via L-network: 22 nH series + 5 nH shunt (Smith chart optimized)
- Final impedance: 46.98 − 0.31j Ω (VSWR 1.06 @ 868 MHz)
- Insertion loss: < 0.005 dB (S21 max −0.003 dB)
- Tolerance: 3% on both inductors

**Power Architecture**

- **Input**: 5V via USB-C or JST-GH connector
- **Power mux**: TPS2116DRLR — prioritizes JST-GH 5V, falls back to USB VBUS automatically
- **3.3V rail**: AP63200WU-7 buck converter, powers MCU and all RF circuitry
- **USB-C ESD**: TPD4E001RDBVR TVS on D+/D−
- **USB-C CC**: 5.1 kΩ pull-downs (UFP/sink)

**Headers & Connectors**

| Connector | Type | Signals |
|---|---|---|
| UART / Power | SM04B-GHS-TB | +5V, GND, RX1, TX1 |
| USB-C | USB4105-GF-A | USB FS D+/D−, VBUS, CC1/CC2 |
| SMA 1 | CON-SMA-EDGE-S | Antenna — Transceiver 1 |
| SMA 2 | CON-SMA-EDGE-S | Antenna — Transceiver 2 |
| SWD | 6-pin pad (1.27mm) | VCC, NRST, GND, SWO, SWCLK, SWDIO |

### :material-notebook-edit: Schematics / PCB / 3D
***Keybinds***

- Select `LMB`
- Zoom In/Out `Scroll`
- Pan `RMB Drag`
- Reset View `R`

<!-- TODO: Replace with Altium 365 embed link -->
<iframe src="https://personal-viewer.365.altium.com/client/index.html?feature=embed&source=A44A44E5-602F-4404-94B1-1D2404E5897F&activeView=SCH" width="1280" height="600" style="overflow:hidden;border:none;width:100%;height:600px;" scrolling="no" allowfullscreen="true" onload="window.top.scrollTo(0,0);"></iframe>

## :material-fast-forward: Quick start
1. Connect 5V via USB-C or JST-GH header
2. Connect antennas to both SMA connectors before applying power — **never TX without antenna**
3. Flash firmware via USB DFU or SWD header (STM32CubeIDE / OpenOCD)
4. Connect UART header to your flight controller or telemetry host (TX→RX, RX→TX)
5. Configure LR1121 band, spreading factor, and channel assignment in firmware

## :fontawesome-solid-biohazard: Safety

- **Never transmit without antennas connected** — the external PAs can be damaged by open-load TX
- **+27 dBm / +22 dBm output is significant RF power** — maintain safe distance from antennas during testing
- **Do not connect both SMA ports to the same antenna** — the two transceivers operate independently and simultaneously
- **Sub-GHz and 2.4 GHz share a single SMA per transceiver via RF switch** — the firmware must correctly assert RFSW_ANT before any TX/RX operation
- **USB and JST-GH 5V can be connected simultaneously** — TPS2116 power mux handles priority automatically

## 🔜 Firmware
**Board is being manufactured — firmware examples and configuration guides coming soon.**

## :octicons-image-24: Photos
<div id="Telemetrium-gallery"></div>

## :fontawesome-solid-download: Downloads
[Telemetrium.zip](https://github.com/sanko0112/Telemetrium/archive/refs/heads/main.zip)
```shell
git clone https://github.com/sanko0112/Telemetrium.git
cd Telemetrium
```