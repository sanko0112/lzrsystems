---
tags:
  - PCB
  - Altium
  - STM32
  - PSU
  - C/C++
  - CubeIDE
---
![Logo](../assets/Gallery/NANOPSU/NANOPSU-logo.png)

<h2>NANOPSU is a USB PPS based small form factor Voltage source for powering electronics projects. It's using an STM32 WB-series controller for BLE connectivity as main UI. Predefined voltages can be set using the onboard toggle switch.</h2>

## :simple-electron: Features
- **USB-C PPS**
- **BLE Connectivity using the STM32WBA55 μC**
- **Current, Voltage sensing**
- **Onboard toggle switch for setting predefined voltages <br>(1.8V, 3.3V, 5V, 9V, 12V, 16V)**
- **Small form factor**
- **Onboard RGB LED for feedback**
- **Reverse current protection**
- **OCP, OVP**
- **Fully customizable Voltage table and debug via SWD**

## :fontawesome-solid-tools: Hardware
**Microcontroller: STM32WBA55KGU6**

- 32-bit Arm® Cortex®-M33 core with TrustZone®
- Up to 100 MHz CPU frequency
- 512 kB Flash memory
- 128 kB SRAM
- Integrated Bluetooth® Low Energy 5.3 radio (2 Mbps, LE Audio, long-range, AoX)
- Security: Arm TrustZone®, AES, PKA, RNG, SHA, secure boot
- 12-bit ADC up to 16-channels
- Low-power modes with <1 µA standby
- Rich peripherals: I²C, SPI, USART, LPUART, LPTIM, timers, RTC
- Debug: SWD, SWO, ETM trace
- Package: QFN-32

**USB PD Sink Controller: AP33772S**

- USB Power Delivery (PD) 3.0 / 3.1 sink controller
- Supports Fixed, PPS (Programmable Power Supply), and AVS (Adjustable Voltage Supply) contracts
- Input voltage range: 3.3V - 24V
- I²C interface for voltage/current request and monitoring
- Integrated protections: OVP, UVP, OCP, OTP
- Drives back-to-back N-channel MOSFETs for VBUS control (reverse current blocking)
- Configurable power levels via NVM registers or I²C commands
- Package: QW-QFN4040-24

**DCP3601NMR Buck converter for μC power/logic rail**

**CLMUD-FKC RGB LED**

### :material-notebook-edit: Schematics

- Select `LMB`
- Zoom In/Out `Scroll`
- Pan `RMB Drag`
- Reset View `R`

<iframe src="https://personal-viewer.365.altium.com/client/index.html?feature=embed&source=2C5CC69E-4CA7-4F9B-A1E0-FAC06562D8F6&activeView=SCH" width="1280" height="600" style="overflow:hidden;border:none;width:100%;height:600px;" scrolling="no" allowfullscreen="true" onload="window.top.scrollTo(0,0);"></iframe>

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

<iframe src="https://personal-viewer.365.altium.com/client/index.html?feature=embed&source=99006CC7-EDF6-40C7-848E-D823B7B6611F&activeView=PCB" width="1280" height="720" style="overflow:hidden;border:none;width:100%;height:720px;" scrolling="no" allowfullscreen="true" onload="window.top.scrollTo(0,0);"></iframe>

## :material-fast-forward: Quick start
- Plug into a USB-C PPS capable charger
- Set output voltage via BLE app or toggle switch
- RGB LED indicates active voltage preset

4. RGB LED indicates state/voltage (see table below):

| Voltage | LED color                          |
|---------|------------------------------------|
| 1.8 V   | <span style="color:white">WHITE</span> |
| 3.3 V   | <span style="color:red">RED</span> |
| 5 V     | <span style="color:green">GREEN</span> |
| 9 V     | <span style="color:blue">BLUE</span> |
| 12 V    | <span style="color:cyan">CYAN</span> |
| 16 V    | <span style="color:pink">PINK</span> |


**Still waiting for board, stay tuned**

## :fontawesome-solid-biohazard: Safety
- **Max theoretical output current: 5A (Limited by PD spec)**
- **Device defaults to 1.8V upon loss of power/restart**

## 🔜Code
**Still waiting for board, stay tuned**

## :octicons-image-24: Photos
<div id="nanopsu-gallery"></div>

## :fontawesome-solid-download: Downloads
[NANOPSU.zip](https://github.com/sanko0112/NANOPSU/archive/refs/heads/main.zip)
```shell
git clone https://github.com/sanko0112/NANOPSU.git
cd NANOPSU
```

