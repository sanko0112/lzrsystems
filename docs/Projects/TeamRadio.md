---
tags:
  - PCB
  - Altium
  - STM32
  - RF
  - Audio
  - Formula-Student
  - C/C++
  - CubeIDE
---

![Logo](../assets/Gallery/TeamRadio/TeamRadio-logo.svg)

<h2>FS-TeamRadio is a <strong>compact UHF handheld radio board</strong> built around the SA818S module, designed for Formula Student driver-to-pit communication. It integrates a 1W PA, TPA6139A2 headphone amplifier, internal/external microphone switching, attenuated speaker output, and a 16340 Li-Ion battery with onboard charging.</h2>

## :simple-electron: Features
- **Radio module**: SA818S (UHF, 400–480 MHz, 1W / 0.5W selectable)
- **Headphone amplifier**: TPA6139A2 with volume potentiometer
- **Internal / External MIC select** via onboard SPDT switch
- **Attenuated audio output** (voltage divider) for Bluetooth speaker input
- **Speaker jack** (3.5mm) and **headset jack** (3.5mm, TRRS)
- **High-pass filter** on microphone input (C24 + R20)
- **PTT** — dedicated tactile button + external JST-XH 2-pin connector
- **2× WS2812B ARGB LEDs** — RSSI indicator + battery voltage indicator
- **MCU**: STM32F103C8T6 (controls SA818S, audio mux, PTT, LEDs)
- **Power**: 16340 Li-Ion (3.0–4.2V), onboard TP4054 charging via USB-C
- **5V boost converter**: TI TPS61023 (feeds SA818S and headphone PA)
- **3.3V LDO**: onsemi NCP114 (feeds MCU and logic)
- **USB-C** with ESD protection (TPD4E001) and battery charging
- **TX power select**: 1W / 0.5W solder bridge (SA818S H/L pin)
- **SWD debug header** (6-pin, 1.27mm)
- **SMA edge connector** (50Ω, UHF antenna)
- **M2 mounting holes** (×4)

## :fontawesome-solid-tools: Hardware

**Radio Module: SA818S**

- UHF band: 400–480 MHz
- Output power: 1W (H/L = HI) or 0.5W (H/L = LO) — selectable via solder bridge
- UART configuration interface (RX/TX to STM32 USART)
- PTT pin: active-low push-to-talk
- AF_OUT: audio output → attenuation network → volume pot → TPA6139A2
- MIC_IN: microphone input from onboard MIC or external headset (SPDT switch)
- AUDIO_ON / AF_EN: controlled by STM32 IO
- ANT: single-ended 50Ω → SMA edge connector
- SA818_EN / SA818_PWR: enable and power controlled by STM32

**Microcontroller: STM32F103C8T6**

- 32-bit Arm® Cortex®-M3
- Up to 72 MHz
- 64 kB Flash, 20 kB SRAM
- USART1 → SA818S (RX/TX)
- GPIO: PTT, SA818_EN, SA818_PWR, H/L power select, AMP_EN, MIC switch
- ADC1_IN1: battery voltage sense (VBATT divider, 10k/24.9k)
- PWM: ARGB LED data (WS2812B chain)
- Debug: SWD, SWO
- 8 MHz crystal
- Package: LQFP-48

**Headphone Amplifier: TPA6139A2PWR**

- Stereo capless headphone amplifier
- Input: SA818S AF_OUT → attenuation network (10k/2.2k) → volume pot (RK09K113, 10kΩ lin)
- MUTE pin controlled by STM32 (AMP_EN)
- GAIN pin configurable
- Output: 3.5mm headset jack (J4, PJ-320D TRRS) and speaker jack (J5, PJ-320D)
- Powered from +VDDA (3.3V)
- High-pass filter on MIC input: 1µF series cap + 27kΩ

**Microphone Path**

- **Internal MIC**: CMEJ-0627-42-P onboard electret microphone
- **External MIC**: headset jack ring contact (J4)
- **Selection**: SS-12D10G4 SPDT slide switch — routes either source into SA818S MIC_IN
- 1µF DC-blocking cap on both MIC inputs

**Power Architecture**

- **Battery**: 16340 Li-Ion (VAPCELL T8 or compatible), 3.0–4.2V
- **Charging IC**: TP4054-42 (500mA), charged via USB-C VBUS
- **Charge LED**: red LED (D1) with 10kΩ
- **Power switch**: SS12D10G6 SPDT slide switch → DMG2305UX P-MOSFET for load switching
- **5V boost**: TI TPS61023DRLR — 1µH, 4.5×4.1mm inductor, 6A peak, 27mΩ — feeds SA818S (+VDD) and headphone PA
- **3.3V LDO**: onsemi NCP114ASN330T1G — feeds STM32 and logic (+VDDA)
- **USB-C**: USB4105-GF-A, ESD: TPD4E001RDBVR, CC: 5.1kΩ pull-downs
- **Solder bridge SB1**: selects USB power path (3-way)
- **VBATT sense**: 10k / 24.9k divider → STM32 ADC1_IN1

**Indicators**

| LED | Type | Function |
|---|---|---|
| RSSI | WS2812B ARGB | Signal strength indication (controlled by MCU) |
| VBATT | WS2812B ARGB | Battery voltage level indication (from ADC reading) |

**Audio Signal Path**

```
SA818S AF_OUT → 0.1µF DC-block → 10k/2.2k attenuator → 10kΩ volume pot → TPA6139A2 IN → headphone jack / speaker jack
```

**MIC Signal Path**

```
Internal MIC ──┐
               SPDT switch → 1µF DC-block → high-pass filter → SA818S MIC_IN
External MIC ──┘
```

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
<iframe src="https://personal-viewer.365.altium.com/client/index.html?feature=embed&source=F483D111-CA62-49DB-A755-539BFBB03FA7&activeView=SCH" width="1280" height="600" style="overflow:hidden;border:none;width:100%;height:600px;" scrolling="no" allowfullscreen="true" onload="window.top.scrollTo(0,0);"></iframe>

## :material-fast-forward: Quick start
1. Insert a charged 16340 cell into the battery holder
2. Slide the power switch to **ON**
3. Connect a UHF antenna to the SMA connector
4. Select internal or external MIC using the **Mic Switch**
5. Connect headphones or a speaker to the appropriate 3.5mm jack
6. Press **PTT** (tactile or external connector) to transmit
7. Configure SA818S frequency, CTCSS, and squelch via UART using STM32 firmware

## :fontawesome-solid-biohazard: Safety

- **Always connect an antenna before transmitting** — transmitting into an open SMA will damage the SA818S PA
- **Maximum TX power is 1W** — keep the antenna away from the body during extended TX
- **USB-C charges the 16340 at 500mA** — use a quality cell rated for continuous charge current
- **Do not short the battery terminals** — no cell-level short-circuit protection on this board
- **VBATT LED turns red when battery is low** — recharge before the cell drops below 3.0V

## 🔜 Firmware
**Firmware for SA818S configuration, PTT handling, RSSI readout, and LED indication coming soon.**

## :octicons-image-24: Photos
<div id="TeamRadio-gallery"></div>

## :fontawesome-solid-download: Downloads
[TeamRadio.zip](https://github.com/sanko0112/TeamRadio/archive/refs/heads/main.zip)
```shell
git clone https://github.com/sanko0112/TeamRadio.git
cd TeamRadio
```