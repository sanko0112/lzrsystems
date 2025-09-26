---
tags:
  - PCB
  - Altium
  - STM32
  - PSU
  - C/C++
  - CubeIDE
---
![Logo](../assets/Gallery/BreadboardPSU/BreadboardPSU-logo.png)

<h2>BreadboardPSU is a solderless breadboard compatible programmable power supply based on the USB PD PPS protocol.</h2>

## :simple-electron: Features
- **5 Selectable voltage outputs: 3.3V, 5V, 9V, 12V, 16V**
- **Single button UI** (no jumpers)
- **USB-C input**
- **RGB LED feedback**
- **Reverse current protection**
- **Fully customizable Voltage table and debug via SWIO & UART headers**

## :fontawesome-solid-tools: Hardware
 **Microcontroller: CH32V006F8P6**

 - 32-bit RISC-V core
 - 24MHz internal RC oscillator
 - 8kB SRAM
 - 62kB PROGMEM
 - 8 channel 12-bit ADC
 - 14 I/O port
 - I2C, SPI, UART
 - Debug: 1-wire SWIO
 - Package: TSSOP-20

**USB PD Sink Controller: CH224Q**

- USB PD 3.0/3.2, EPR, PPS, SPR
- 100W(PD 3.0), 140W(PD 3.2)
- Config: 
    - 400kHz I2C
    - Single resistor on CFG1 pin
    - CFG1/2/3 logic-level selection
-  Over-voltage protection

**Dual PMV20XNER NMOS for reverse current protection & Vout EN**

**DCP3601NMR Buck converter for MCU power/logic rail**

**CLMUD-FKC RGB LED**

**2x 2x05 2.54 pitch header for breadboard connection**

### :material-notebook-edit: Schematics
***Keybinds***

- Select `LMB`
- Zoom In/Out `Scroll`
- Pan `RMB Drag`
- Reset View `R`

<iframe src="https://personal-viewer.365.altium.com/client/index.html?feature=embed&source=F271E043-F70E-4AA9-82B4-1017709F8B51&activeView=SCH" width="1280" height="600" style="overflow:hidden;border:none;width:100%;height:720px;" scrolling="no" allowfullscreen="true" onload="window.top.scrollTo(0,0);"></iframe>

### :material-rotate-3d: PCB
***Keybinds***

- Select `LMB`
- Zoom In/Out `Scroll`
- Pan `RMB Drag`
- Rotate in 3D `LMB Drag`
- Reset View `R`
- Switch to 2D `2`
- Switch to 3D `3`
- Next / Previous Layer `+/-`
- Fold / Unfold in 3D (rigid-flex) `5`
- Flip Board Top / Bottom `F`

<iframe src="https://personal-viewer.365.altium.com/client/index.html?feature=embed&source=5EE881B9-2D7F-494D-904B-C3584A32FAFA&activeView=PCB" width="1280" height="600" style="overflow:hidden;border:none;width:100%;height:600px;" scrolling="no" allowfullscreen="true" onload="window.top.scrollTo(0,0);"></iframe>

## :material-fast-forward: Quick start
**❗Disclaimer: Breadboards have limited current capacity. Keep continuous current conservative (e.g., ≤ 1 A per rail unless you know your setup)**
1. Plug a USB-C PPS capable charger/power bank into the board
2. Short-press the button to enable/disable the output
3. Long-press the button to cycle outputs: 3.3V → 5V → 9V → 12V → 16V
4. RGB LED indicates state/voltage (see table below):

| Voltage | LED color                          |
|---------|------------------------------------|
| 3.3 V   | <span style="color:red">RED</span> |
| 5 V     | <span style="color:green">GREEN</span> |
| 9 V     | <span style="color:blue">BLUE</span> |
| 12 V    | <span style="color:cyan">CYAN</span> |
| 16 V    | <span style="color:pink">PINK</span> |


## :fontawesome-solid-biohazard: Safety
- **Max theoretical output current: 3A(limited by Tj<sub>FET</sub> )**
- **Bench-test with current-limited supply first**
- **Breadboard contacts can overheat; watch temperature at > 1 A**
- **Device defaults to 3.3V upon loss of power/restart**

## 🔜Code
 **Still waiting for board, stay tuned**

## :octicons-image-24: Photos
<div id="breadboardpsu-gallery"></div>


## :fontawesome-solid-download: Downloads
[BreadboardPSU.zip](https://github.com/sanko0112/BreadboardPSU/archive/refs/heads/main.zip)

```shell
git clone https://github.com/sanko0112/BreadboardPSU.git
cd BreadboardPSU
```