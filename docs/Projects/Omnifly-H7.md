---
tags:
  - PCB
  - Altium
  - STM32
  - Flight-controller
  - C/C++
  - CubeIDE
  - 🚀
---

![Logo](../assets/Gallery/Omnifly-H7/omnifly-logo.svg)

<h2>Omnifly H7 is a <strong>multi-platform flight controller</strong> based on the STM32H743, designed for fixed-wing, quadcopter, and rocketry applications. It integrates a full sensor suite, analog video OSD, pyrotechnic outputs, and extensive connectivity into a compact 50×50mm form factor.</h2>

## :simple-electron: Features
- **Microcontroller**: STM32H743VIT6 (480 MHz Cortex-M7, 2MB Flash, 1MB RAM)
- **IMU**: ICM-42688-P (6-axis, SPI)
- **Barometer**: BMP390 (I²C)
- **Analog OSD**: MAX7456 with camera input and VTX video output
- **3× Pyro channels** — fused (10A, C1F), NMOS switched, continuity sensing via ADC
- **6× Servo / PWM outputs** (TIM1 + TIM2, 5V logic)
- **4× Motor outputs** (TIM5, dedicated quad ESC header)
- **8× UARTs** (GPS, Radio, VTX, Camera, ESC telemetry, expansion)
- **I²C** (Compass / external sensors)
- **CAN bus** (ATA6561 transceiver, 120Ω terminated)
- **USB-C** Full Speed device (with ESD protection)
- **MicroSD card** (SDMMC1, 4-bit, ESD protected)
- **256Mbit NOR Flash** (MX25L25645G, SPI)
- **WS2812B ARGB LED**
- **Buzzer** (NMOS driven, 5V)
- **Analog FPV camera input** + **Analog VTX / DJI O4 header**
- **Dedicated solder pads**: VBATT, 5V, 3V3, GND, CAN diff pair, UART7/8
- **SWD debug header**
- **50×50mm board**, 30×30mm M3 mounting pattern
- **8-layer stackup** for clean power and signal integrity

## :fontawesome-solid-tools: Hardware

**Microcontroller: STM32H743VIT6**

- 32-bit Arm® Cortex®-M7 core with FPU and DSP
- Up to 480 MHz CPU frequency
- 2 MB dual-bank Flash, 1 MB RAM (including 192 KB TCM)
- 12-bit ADC (up to 20 channels)
- Advanced timers: TIM1, TIM2, TIM5 used for motor/servo PWM
- Peripherals: 8× USART/UART, 3× SPI, 4× I²C, 2× CAN-FD, SDMMC, USB FS/HS
- Debug: SWD, SWO, ETM trace
- Package: LQFP-100

**IMU: ICM-42688-P**

- 6-axis (3-axis gyro + 3-axis accel)
- Gyro noise density: 2.8 mdps/√Hz
- Accel noise density: 70 μg/√Hz
- SPI interface up to 24 MHz
- Hardware interrupt (INT1) to STM32
- Dedicated +3V3_IMU LDO supply for noise isolation
- Package: LGA-14

**Barometer: BMP390**

- Pressure range: 300–1250 hPa
- Relative accuracy: ±0.06 hPa
- I²C interface (400 kHz)
- Package: LGA-10

**OSD: MAX7456EUI+**

- Single-channel monochrome analog OSD
- 27 MHz crystal for pixel clock
- SPI interface (CS, MOSI, MISO, SCK)
- 75Ω terminated camera input and video output
- 5V powered (PVDD + AVDD decoupled)
- Package: TSSOP-28

**NOR Flash: MX25L25645GM2I-08G**

- 256Mbit (32MB) capacity
- SPI / QPI interface up to 133 MHz
- Used for blackbox logging or parameter storage
- Package: SOP-8

**CAN Transceiver: ATA6561-GBQW-N**

- CAN / CAN-FD compliant
- Standby pin controlled by STM32
- 120Ω bus termination resistor onboard
- 3.3V logic / 5V VCC
- Package: DFN-9

**Power Architecture**

- **Input**: Direct battery (2S–6S, up to 25.2V) via 4×5mm solder pads
- **5V high-current rail**: SIC437AED buck converter (~10A peak), feeds servos, VTX
- **5V logic rail**: MBR230S1F-7 Schottky diodes OR the SIC437AED and USB 5V rails
- **3.3V rail**: AP63200WU-7 buck converter, feeds STM32 and digital logic
- **3.3V IMU rail**: TLV74033PDBVR LDO (low-noise, isolated for IMU)
- **USB-C ESD**: D1213A-02SOL-7 TVS on D+/D−

**Pyro Channels (×3)**

- Switch: SSM6K513NU dual N-channel MOSFET
- Fuse: C1F 10A (per channel)
- Continuity sensing: voltage divider + bleeder resistors → STM32 ADC (ADC2_IN8/9/10)
- LED indicator (red) per channel
- Output via WAGO 2065 terminals
- Max continuous current: 10A per channel (fuse limited)

**Headers & Connectors**

| Connector | Type | Signals |
|---|---|---|
| Quad ESC | SM10B-SRSS-TB | VBATT, GND, M1–M4, I_Sense, Telem |
| Single ESC | SM05B-GHS | VBATT, GND, I_Sense, Telem, M1 |
| S1–S6 Servo | SM03B-GHS-TB (×6) | SIG, GND, +5V |
| GPS + Compass | SM06B-GHS-TB | +5V/+3V3, GND, GPS TX/RX, CMPS SDA/SCL |
| Analog Camera | SM05B-GHS-TB | +5V, GND, CAM_IN, CAM_RX, CAM_TX |
| VTX / DJI O4 | S6B-PH-SM4-TB | VTX_VIN, GND, VTX_TX, VTX_RX, VIDEO_OUT |
| Radio / Receiver | SM04B-GHS-TB | +5V, GND, RADIO_TX, RADIO_RX |
| UART6 | SM04B-GHS-TB | +5V, GND, UART6_TX, UART6_RX |
| USB-C | UJ20-C-H-G-SMT-5-P16-TR | USB FS D+/D−, VBUS, CC1/CC2 |
| SWD | 6-pin pad (1.27mm) | VCC, NRST, GND, SWO, SWCLK, SWDIO |
| Pyro ×3 | 2065-101_998-403 ×6 | PYRO+, PYRO− per channel |
| Solder pads | — | UART7/8, CAN_P/N, VBATT, 5V, 3V3, GND |

**PCB Stackup — 8 layers, 50×50mm**

| Layer | Function |
|---|---|
| L1 | Signal + Components (Top) |
| L2 | GND plane |
| L3 | Signal |
| L4 | GND plane |
| L5 | Power — 5V and 3V3 |
| L6 | Power — VBATT and high-current 5V (pyro/servo/VTX) |
| L7 | GND plane |
| L8 | Signal + Components (Bottom) |

- **Mounting**: 30×30mm M3 pattern (standard flight controller stack)

### :material-notebook-edit: Schematics / PCB / 3D
***Keybinds***

- Select `LMB`
- Zoom In/Out `Scroll`
- Pan `RMB Drag`
- Reset View `R`

<!-- TODO: Replace with Altium 365 embed link -->
<iframe src="https://personal-viewer.365.altium.com/client/index.html?feature=embed&source=07D64F6E-0D1B-4CB9-A7EF-726BF584E03A&activeView=PCB" width="1280" height="600" style="overflow:hidden;border:none;width:100%;height:600px;" scrolling="no" allowfullscreen="true" onload="window.top.scrollTo(0,0);"></iframe>

## :material-fast-forward: Quick start
1. Connect a 2S–6S LiPo battery to the VBATT solder pads (observe polarity)
2. Connect USB-C for configuration or firmware upload
3. Flash firmware via SWD (STM32CubeIDE / OpenOCD) or USB DFU
4. Connect peripherals to their respective headers (see connector table above)
5. Configure outputs and UART assignments in your flight stack (Betaflight / ArduPilot / custom)
6. For pyro use: connect e-matches to PYRO+/PYRO− terminals, verify continuity LED before arming

## :fontawesome-solid-biohazard: Safety

- **Pyro channels are fused at 10A per channel** — verify fuse integrity before every flight/launch
- **Always disarm pyro outputs before connecting/disconnecting e-matches**
- **Battery voltage is present on pyro output pads at all times when battery is connected** — treat as live
- **VTX_VIN solder bridge (SB1)** selects VBATT or +5VBUCK — verify selection before powering VTX
- **GPS_VIN solder bridge (SB2)** selects +5V or +3V3 — verify selection for your GPS module's Vcc
- **USB and battery can be connected simultaneously** — 5V rails are OR'd via Schottky diodes
- **Maximum battery voltage: 25.2V (6S)** — do not exceed

## 🔜 Firmware
**Board is being manufactured — firmware examples and configuration guides coming soon.**

## :octicons-image-24: Photos
<div id="Omnifly-gallery"></div>

## :fontawesome-solid-download: Downloads
[OmniflyH7.zip](https://github.com/sanko0112/OmniflyH7/archive/refs/heads/main.zip)
```shell
git clone https://github.com/sanko0112/Omnifly-H7.git
cd Omnifly-H7
```