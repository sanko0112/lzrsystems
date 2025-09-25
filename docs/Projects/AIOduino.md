---
tags:
  - PCB
  - Altium
  - AVR
  - Dev-board
  - C/C++
  - AVR Assembly
  - Arduino IDE
  - MPLABX
---

![Logo](../assets/Gallery/AIOduino/AIOduino-logo.png)

<h2>AIODuino is an <strong>ATmega1284P-based development board</strong> with built-in peripherals for embedded projects. It combines common hardware modules into a single board, making it easy to prototype and test firmware without external shields.</h2>

## :simple-electron: Features
- **Microcontroller**: ATmega1284P-AU (40 GPIO, 16 KB SRAM, 128 KB Flash)
- **Peripherals onboard**:
  - 4-digit 7-segment LED display
  - 0.96" OLED display (SSD1306-I²C)
  - Potentiometer
  - Piezo buzzer
  - 4 push buttons + reset button
  - 4 Color LEDs + UART indicator LEDs
  - WS2812B addressable RGB LED
- **Interfaces**:
  - Dual 2×10 pin headers for expansion
  - USB connector (power + UART bridge)
- **Clock**: 16 MHz crystal
- **Power**: 5 V via USB or external supply
- **Onboard 3.3V LDO**

## :fontawesome-solid-tools: Hardware

### :material-notebook-edit: Schematics

- Select `LMB`
- Zoom In/Out `Scroll`
- Pan `RMB Drag`
- Reset View `R`

<iframe src="https://personal-viewer.365.altium.com/client/index.html?feature=embed&source=A95F3D29-A1F1-48D4-84F4-54A12B3DD298&activeView=SCH" width="1280" height="600" style="overflow:hidden;border:none;width:100%;height:600px;" scrolling="no" allowfullscreen="true" onload="window.top.scrollTo(0,0);"></iframe>

### :material-rotate-3d: PCB

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

<iframe src="https://personal-viewer.365.altium.com/client/index.html?feature=embed&source=0B127BE8-7FB8-4CD5-A1D4-C4C4D4DE1D04&activeView=PCB" width="1280" height="600" style="overflow:hidden;border:none;width:100%;height:600rpx;" scrolling="no" allowfullscreen="true" onload="window.top.scrollTo(0,0);"></iframe>

## :fontawesome-regular-handshake-simple: Credits
This project uses the [MightyCore](https://github.com/MCUdude/MightyCore) Arduino core by [MCUdude](https://github.com/MCUdude) for uploading code on the board

## :octicons-code-square-24: Examples
**Currently waiting for the board to arrive, I'll try to make examples in AVR-C as soon as it arrives.**


## :octicons-image-24: Photos
<div id="AIOduino-gallery"></div>

## :fontawesome-solid-download: Downloads
[AIOduino.zip](https://github.com/sanko0112/AIOduino/archive/refs/heads/main.zip)
```shell
git clone https://github.com/sanko0112/AIOduino.git
cd AIOduino
```