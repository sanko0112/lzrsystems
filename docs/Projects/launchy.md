---
tags:
  - PCB
  - KiCad
  - ESP32
  - 🚀
  - C/C++
  - Arduino IDE
---


![Logo](../assets/Gallery/Launchy/launchy_logo.png)


ESP32 ESP-NOW Based model rocket launch controller.


## :octicons-rocket-24: Features

- ESP-NOW Long range protocol
- Multi-layer safety: Key switch, iButton, push button
- OLED display for status feedback
- Built in battery charging circuit (TP4056)
- USB-C for programming/charging
- Internal 1S / External 2S battery selection for the e-match
- Continuity test (1S mode)
- Preheat mode(1S mode)
- Configurabe Countdown time, Ignition time
## :fontawesome-solid-tools: Hardware
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The system is based on a custom PCB designed in KiCad, built around the ESP32-C3-MINI-1 module. Both the transmitter and the igniter/receiver use the same board design, but are populated with different component sets depending on their role. The
hardware integrates Li-Ion charging (TP4056), a 3.3 V LDO regulator (AP2112K), a MOSFET-driven relay interface, iButton authentication, and status LEDs. USB-C is provided for charging and programming, while screw terminals allow safe connection of the igniter circuit.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Complete manufacturing files are available as a ZIP inside the GERBER folder as well as the BoM. Symbol and footprint libraries are uploaded so the project should be fully editable in KiCad now.

## :material-notebook-edit: Schematic

<iframe src="/assets/Gallery/Launchy/Launchy.pdf"
        width="100%"
        height="600"
        style="border:none;">
</iframe>

## :octicons-code-square-24: Firmware
### Transmitter.ino
- Handles the remote unit (user interface + iButton authentication).
- Implements menus for:
    - Battery type selection
    - Continuity check
    - Countdown time
    - Preheat start time
    - Preheat duration
    - Ignition delta
- Uses ESP-NOW to send launch and continuity test commands
- Provides OLED display feedback via LaunchDisplayLibrary
- Requires valid iButton for arming and launch

``` C title="Transmitter.ino" linenums="1"
#include <Arduino.h>
#include <esp_now.h>
#include <WiFi.h>
#include <OneWire.h>
#include <LaunchDisplayLibrary.h>
#include <esp_wifi.h>

//defines
#define iButton 3
#define togglesw 0
#define GREEN_LED 5
#define RED_LED 6

uint8_t launch_code;
int session_id;

uint8_t broadcastAddress[] = {0xAA, 0xBB, 0xCC, 0xDD, 0xEE, 0xFF}; // Igniter MAC-Address here

//iButton read declarations
OneWire ds(iButton);
byte storedID[8];
byte allowedID[8] = {0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77}; // iButton fob ID here

uint8_t EN; // EN flag

esp_now_peer_info_t peerInfo;

uint8_t countdownTime = 5;
const int T_minValue = 3;
const int T_maxValue = 20;
bool countdown_confirmed = false;

uint8_t preheatStartTime = 3;
const int P_SminValue = 1;
int P_SmaxValue = 5;
bool preheat_start_confirmed = false;

float preheatDuration = 0.25;
const float durationResolution = 0.25;
const float P_DminValue = 0.25;
float P_DmaxValue = 5.0;
bool preheat_confirmed = false;

uint8_t ignitionDelta = 5;
const int I_DminValue = 1;
const int I_DmaxValue = 10;
bool ignitionDelta_confirmed = false;

uint8_t batt_type = 1;
bool batt_confirmed = false;

typedef struct struct_message {
uint8_t packet_type;
uint8_t batt_type;
uint8_t launch_code;
uint8_t countdownTime;
uint8_t preheatStartTime;
float preheatDuration;
float durationResolution;
uint8_t ignitionDelta;
int session_id;
} struct_message;

struct_message LaunchConfig;

typedef struct {
  uint8_t packet_type;
  bool continuity_result;
} continuity_response_t;

#define PACKET_TYPE_LAUNCH     0
#define PACKET_TYPE_CONTINUITY 1

uint8_t continuityTest_init = 5;
bool continuity_result = false;
bool recvFlag = false;
//function prototypes
void OnDataSent(const uint8_t *mac_addr, esp_now_send_status_t status);
void HandleSingleButton(void (*onShortPress)(), void (*onLongPress)());
void WaitForLaunchConfirm();
void iButtonAuth();
void blink(uint8_t pin, uint16_t times, uint16_t ms);
void reverseblink(uint8_t pin, uint16_t times, uint16_t ms);
void auth();

void setup() {

  Serial.begin(115200);
  Wire.begin(7, 8);
  u8g2.begin();
  delay(20);
  u8g2.clearBuffer();
  u8g2.sendBuffer();
  pinMode(GREEN_LED, OUTPUT); // Green_LED indicator
  pinMode(RED_LED, OUTPUT); // RED_LED indicator
  pinMode(togglesw, INPUT_PULLDOWN); // Toggle switch as input

  WiFi.mode(WIFI_STA);
  esp_wifi_set_protocol(WIFI_IF_STA, WIFI_PROTOCOL_LR);  // Long Range mode

  // Initilize ESP-NOW
  if (esp_now_init() != ESP_OK) {
    Serial.println("Error initializing ESP-NOW");
    return;
  }

  // Register the send callback
  // In setup() or once before any send
  esp_now_register_recv_cb(OnDataRecv);

  // Register peer
  memcpy(peerInfo.peer_addr, broadcastAddress, 6);
  peerInfo.channel = 0;  
  peerInfo.encrypt = false;
  draw_welcome();
  delay(500);
  loading();
}
 
void loop() {
  //checking for valid ibutton
  auth();
  delay(10);
  //valid ibutton found
  if(EN){

    digitalWrite (RED_LED, LOW);
    digitalWrite (GREEN_LED, HIGH);
    draw_auth_success();
    delay(500);
    
    //adding ESP-NOW peer
    if (!esp_now_is_peer_exist(broadcastAddress)) {
      if (esp_now_add_peer(&peerInfo) != ESP_OK) {
        Serial.println("Failed to add peer");
        return;
      }
      else{
        Serial.println(" added peer");
    }
    }
    delay(100);
    openBatteryTypeMenu();
    delay(300);
    if (batt_type == 1)
    { 
    continuity();
    s_settings();
    }
    else
    {
      ss_settings();
    }
    draw_armed();
    LaunchConfig.packet_type = PACKET_TYPE_LAUNCH;
    launch_code = 33;
    session_id = rand();
    LaunchConfig.launch_code = launch_code;
    LaunchConfig.batt_type = batt_type;
    LaunchConfig.countdownTime = countdownTime;
    LaunchConfig.preheatStartTime = preheatStartTime;
    LaunchConfig.preheatDuration = preheatDuration;
    LaunchConfig.durationResolution = durationResolution;
    LaunchConfig.ignitionDelta = ignitionDelta;
    LaunchConfig.session_id = session_id;
    delay(2000);
    //Waiting for button press
    WaitForLaunchConfirm();
    //sending launch command

    for(int j = 0; j<3; j++){
      LaunchConfig.packet_type = PACKET_TYPE_LAUNCH;
      esp_now_send(broadcastAddress, (uint8_t *)&LaunchConfig, sizeof(LaunchConfig));
    }
    //starting countdown
    countdown(countdownTime,preheatStartTime,preheatDuration);
    draw_ignition();
    delay(10);
    delay(ignitionDelta*1000);
    esp_now_del_peer(broadcastAddress); // Optional: prevent re-use until re-auth
    digitalWrite (GREEN_LED, LOW);
    delay(20);
    digitalWrite (RED_LED, HIGH);
    EN = 0;
  }
  //ibutton auth failed retrying...
  else{
    auth();
  }
}


void iButtonAuth()
{
  //initializing
  byte addr[8];
  if (!ds.search(addr)) {
    ds.reset_search();
    return;
  }
  //checking iButton type
  if (OneWire::crc8(addr, 7) != addr[7]) {
    Serial.println("CRC is not valid!");
    return;
  }
  //storing recieved ID
  for (int i = 0; i < 8; i++) {
    storedID[i] = addr[i];
  }
  //checking if recieved ID is matching the stored ID
  bool isAuth = true;
  for (int i = 0; i < 8; i++) {
    if (storedID[i] != allowedID[i]) {
      isAuth = false;
    }
  }
  //matching ID EN flag TRUE
  if (isAuth) {
    Serial.println(" -> AUTHORIZED");
    EN = 1;
  }
  //mismatch on ID's EN flag stays FALSE
  else {
    Serial.println("FAILED");
    reverseblink(RED_LED, 2, 200);
    EN = 0;
  }
  delay(200);
}

void HandleSingleButton(void (*onShortPress)(), void (*onLongPress)()) {
  const unsigned long longPressTime = 1000; // 1 second hold
  unsigned long pressStart = 0;
  bool isPressed = false;
  bool longPressTriggered = false;

  while (true) {
    int state = digitalRead(togglesw);

    if (state == HIGH) {
      if (!isPressed) {
        pressStart = millis();
        isPressed = true;
      } else if (!longPressTriggered && (millis() - pressStart >= longPressTime)) {
        longPressTriggered = true;
        onLongPress();  // Immediately trigger long press
        break;
      }
    } else if (state == LOW && isPressed) {
      // Button released before long press time
      if (!longPressTriggered) {
        onShortPress();  // Short press handler
      }
      break;
    }

    delay(10);
  }
}

void WaitForLaunchConfirm() {
  Serial.println("Hold to launch...");
  HandleSingleButton([]() {}, []() {
    Serial.println("Launch confirmed.");
    // Proceed with countdown + ignition
  });
}

void blink(uint8_t pin, uint16_t times, uint16_t ms)
{
  for (uint16_t i = 0; i< times; i++){
    digitalWrite(pin, HIGH);
    delay(ms);
    digitalWrite(pin, LOW);
    delay(ms);
  }
}

void reverseblink(uint8_t pin, uint16_t times, uint16_t ms)
{
  for (uint16_t i = 0; i< times; i++){
    digitalWrite(pin, LOW);
    delay(ms);
    digitalWrite(pin, HIGH);
    delay(ms);
  }
}


void auth()
{ 
  while(1){
    draw_auth_a();
    iButtonAuth();
    delay(100);
    draw_auth_b();
    iButtonAuth();
    delay(100);
    draw_auth_c();
    iButtonAuth();
    delay(100);
    if(EN)
      break;
    draw_auth_d();
    iButtonAuth();
    delay(100);
    if(EN)
      break;    
    draw_auth_e();
    iButtonAuth();
    delay(100);
    if(EN)
      break;    
    draw_auth_f();
    iButtonAuth();
    delay(100);
    if(EN)
      break;    
    draw_auth_g();
    
    iButtonAuth();
    delay(100);
    if(EN)
      break;
  }   
}

void updateCountdownText() {
  itoa(countdownTime, countdown_menu_var, 10);
}

void onShortPress_CountdownMenu() {
  countdownTime++;
  if (countdownTime > T_maxValue) countdownTime = T_minValue;
  updateCountdownText();
  draw_countdown_menu();
}

void onLongPress_CountdownMenu() {
  countdown_confirmed = true;
  Serial.print("Countdown set to: ");
  Serial.println(countdownTime);
}

void openCountdownMenu() {
  countdown_confirmed = false;
  updateCountdownText();
  draw_countdown_menu();

  while (!countdown_confirmed) {
    HandleSingleButton(onShortPress_CountdownMenu, onLongPress_CountdownMenu);
  }
}


void updatePreheatStartText() {
  itoa(preheatStartTime, preheat_start_menu_var, 10);
}

void onShortPress_PreheatStartMenu() {
  preheatStartTime++;
  if (preheatStartTime > P_SmaxValue) preheatStartTime = P_SminValue;
  updatePreheatStartText();
  draw_preheat_start_menu();
}

void onLongPress_PreheatStartMenu() {
  preheat_start_confirmed = true;
  Serial.print("Preheat start time set to: T-");
  Serial.println(preheatStartTime);
}

void openPreheatStartMenu() {
  preheat_start_confirmed = false;
  updatePreheatStartText();
  draw_preheat_start_menu();
  delay(400);

  while (!preheat_start_confirmed) {
    HandleSingleButton(onShortPress_PreheatStartMenu, onLongPress_PreheatStartMenu);
  }
}


void updatePreheatText() {
  dtostrf(preheatDuration, 3, 2, preheat_duration_menu_var);
}

void onShortPress_PreheatMenu() {
  preheatDuration += durationResolution;
  if (preheatDuration > P_DmaxValue) preheatDuration = P_DminValue;
  updatePreheatText();
  draw_preheat_duration_menu();
}

void onLongPress_PreheatMenu() {
  preheat_confirmed = true;
  Serial.print("Preheat set to: ");
  Serial.println(preheatDuration);
}

void openPreheatDurationMenu() {
  preheat_confirmed = false;
  updatePreheatText();
  draw_preheat_duration_menu();
  delay(400);
  while (!preheat_confirmed) {
    HandleSingleButton(onShortPress_PreheatMenu, onLongPress_PreheatMenu);
  }
}

void updateIgnitionDeltaText() {
  itoa(ignitionDelta, ignition_delta_menu_var, 10);
}

void onShortPress_IgnitionMenu() {
  ignitionDelta++;
  if (ignitionDelta > I_DmaxValue) ignitionDelta = I_DminValue;
  updateIgnitionDeltaText();
  draw_ignition_delta_menu();
}

void onLongPress_IgnitionMenu() {
  ignitionDelta_confirmed = true;
  Serial.print("Ignition Delta is set to: ");
  Serial.println(ignitionDelta);
}

void openIgnitionDeltaMenu() {
  ignitionDelta_confirmed = false;
  updateIgnitionDeltaText();
  draw_ignition_delta_menu();
  delay(400);
  while (!ignitionDelta_confirmed) {
    HandleSingleButton(onShortPress_IgnitionMenu, onLongPress_IgnitionMenu);
  }
}

void s_settings(void)
{
draw_countdown_menu();
delay(300);
openCountdownMenu();
P_SmaxValue = countdownTime;
openPreheatStartMenu();
P_DmaxValue = preheatStartTime-0.75;
openPreheatDurationMenu();
openIgnitionDeltaMenu();

itoa(countdownTime, armed_t_, 10);
itoa(preheatStartTime, armed_ps, 10);
itoa(preheatDuration, armed_pd, 10);
itoa(ignitionDelta, armed_id, 10);
/*
int launch_code;
int countdownTime;
int preheatStartTime;
float preheatDuration;
int ignitionDelta;
*/
}
void ss_settings(void)
{
openCountdownMenu();
P_SmaxValue = countdownTime;
openIgnitionDeltaMenu();
itoa(countdownTime, armed_t_, 10);
itoa(preheatStartTime, armed_ps, 10);
itoa(preheatDuration, armed_pd, 10);
itoa(ignitionDelta, armed_id, 10);
/*
int launch_code;
int countdownTime;
int preheatStartTime;
float preheatDuration;
int ignitionDelta;
*/
}
void OnDataRecv(const esp_now_recv_info_t *recv_info, const uint8_t *incomingData, int len) {
    if (len == sizeof(continuity_response_t)) {
        continuity_response_t response;
        memcpy(&response, incomingData, len);
        if (response.packet_type == PACKET_TYPE_CONTINUITY) {
            continuity_result = response.continuity_result;
            Serial.print("Received continuity result: ");
            Serial.println(continuity_result);
        }
    }
  recvFlag = true;  
}


void continuity() {

  Serial.println("Press and hold to begin continuity test...");
  draw_continuity_check_start();
  delay(1000);
  HandleSingleButton([]() {}, []() {
    Serial.println("Continuity test started");

    struct_message continuity_packet = {};
    continuity_packet.packet_type = PACKET_TYPE_CONTINUITY;
    esp_now_send(broadcastAddress, (uint8_t *)&continuity_packet, sizeof(continuity_packet));
    unsigned long startTime = millis();
    while ( millis() - startTime < 1500) {
      delay(10); // yield time for callback
    }
        if (continuity_result) {
          Serial.println("Continuity success. Hold to continue...");
          draw_continuity_check_success();
          HandleSingleButton([]() {}, []() {
          Serial.println("Continuing...");
          delay(400);
          });
        } else {
          Serial.println("Continuity failed. Check connection and retry.");
          draw_continuity_check_failed();
          while(1){}
         // wait forever or implement retry
        }
     
  });
}

// ===== Battery type menu =====
// 1S = 1, 2S = 2


// Show the right screen for current selection
void draw_batt_current() {
  if (batt_type == 1) {
    draw_batt_s();   // your "1S selected" screen
  } else {
    draw_batt_ss();  // your "2S selected" screen
  }
}

// Short press: toggle 1S <-> 2S
void onShortPress_BattMenu() {
  batt_type = (batt_type == 1) ? 2 : 1;
  draw_batt_current();
}

// Long press: confirm selection
void onLongPress_BattMenu() {
  batt_confirmed = true;
  Serial.print("Battery type set to: ");
  Serial.println(batt_type == 1 ? "1S" : "2S");
  Serial.println(batt_type);
}

// Open the menu and wait for confirmation
void openBatteryTypeMenu() {
  batt_confirmed = false;
  draw_batt_current();
  delay(300);

  while (!batt_confirmed) {
    HandleSingleButton(onShortPress_BattMenu, onLongPress_BattMenu);
  }
}
```
### Igniter.ino
- Handles the receiver unit (relay + buzzer)
- Waits for commands over ESP-NOW
- Performs continuity test by measuring V<sub>drop<sub>
- Executes countdown, preheat, and ignition relay control
- Includes buzzer startup sounds and launch feedback

``` C title="Igniter.ino" linenums="1"
  #include <esp_now.h>
  #include <WiFi.h>
  #include <esp_wifi.h>

  // Pin definitions
  #define RELAY_PIN 2
  #define BUZZ 3
  #define ADC_PIN 0

  // Launch code value to match
  typedef struct struct_message {
  uint8_t packet_type;
  uint8_t batt_type;
  uint8_t launch_code;
  uint8_t countdownTime;
  uint8_t preheatStartTime;
  float preheatDuration;
  float durationResolution;
  uint8_t ignitionDelta;
  int session_id;
  } struct_message;
  
  struct_message LaunchConfig;
  
  int lastSession_id = 4;

  typedef struct {
  uint8_t packet_type;
  uint8_t continuity_result;
  } continuity_response_t;

  uint8_t continuity_result = 0;

  #define PACKET_TYPE_LAUNCH     0
  #define PACKET_TYPE_CONTINUITY 1

  uint8_t broadcastAddress[] = {0xAA, 0xBB, 0xCC, 0xDD, 0xEE, 0xFF}; // Transmitter MAC-Address here


  // Setup function
  void setup() {
    Serial.begin(115200);

    // Initialize pins
    pinMode(RELAY_PIN, OUTPUT);
    pinMode(BUZZ, OUTPUT);
    digitalWrite(RELAY_PIN, LOW);   // Relay OFF
    digitalWrite(BUZZ, LOW);  // Buzzer OFF

    // Set WiFi to station mode
    WiFi.mode(WIFI_STA);
    esp_wifi_set_protocol(WIFI_IF_STA, WIFI_PROTOCOL_LR);  // Long Range mode


    // Initialize ESP-NOW
    if (esp_now_init() != ESP_OK) {
      Serial.println("Error initializing ESP-NOW");
      return;
    }
    esp_now_peer_info_t peer;
    memset(&peer, 0, sizeof(peer));
    memcpy(peer.peer_addr, broadcastAddress, 6);
    peer.channel = 0;
    peer.encrypt = false;

    if (!esp_now_is_peer_exist(peer.peer_addr)) {
      esp_err_t addStatus = esp_now_add_peer(&peer);
    if (addStatus != ESP_OK) {
      Serial.println("Failed to add transmitter as peer!");
  }
}
    // Register receive callback
    esp_now_register_recv_cb(OnDataRecv);
    Serial.println("Receiver ready. Waiting for peer auth and launch command...");
    startup_sound();
  }

  // Loop does nothing, waiting for data via callback
  void loop() {
    delay(10);
  }

  // Callback function when data is received
void OnDataRecv(const esp_now_recv_info_t *recv_info, const uint8_t *incomingData, int len) {
  struct_message msg;
  memcpy(&msg, incomingData, sizeof(msg));
  if (msg.packet_type == PACKET_TYPE_CONTINUITY) {
    int adcVal = 0;
    int freeValue = 5000;
    int loadValue = 5000;
    for (int q = 0; q<5; q++)
    {
      adcVal = analogRead(ADC_PIN);
      if (adcVal < freeValue){
        freeValue = adcVal;
      }
      delay(20);
    }
    digitalWrite(RELAY_PIN, HIGH);
    for(int p = 0; p<10;p++)
    {
      adcVal = analogRead(ADC_PIN);
      if (adcVal < loadValue){
        loadValue = adcVal;
      }
      delay(50);
    }
    digitalWrite(RELAY_PIN, LOW);
    Serial.println("freeValue");
    Serial.println(freeValue);
    Serial.println("loadValue");
    Serial.println(loadValue);
    if(loadValue<=freeValue-20)
    {
      continuity_result = true;
    }
    else
    {
      continuity_result = false;
    }
    continuity_response_t response;
    response.packet_type = PACKET_TYPE_CONTINUITY;
    response.continuity_result = continuity_result;

    for (int k = 0; k < 5; k++) {
      esp_now_send(broadcastAddress, (uint8_t *)&response, sizeof(response));
    }
    Serial.println(continuity_result);
    if (continuity_result)
    {
       onReceive_sound(2);
    }
    else{fail_sound();}
    delay(100);
  }
  if (msg.packet_type == PACKET_TYPE_LAUNCH && msg.session_id != lastSession_id) {
    lastSession_id = msg.session_id;
    LaunchConfig = msg;
    uint8_t batteryType;
    batteryType = LaunchConfig.batt_type;
    Serial.println(batteryType);
    if (batteryType == 1) {
      TickType_t lastWakeTime = xTaskGetTickCount();
      int durationResolution_ms = LaunchConfig.durationResolution * 1000;
      int preheatDuration_ms = LaunchConfig.preheatDuration * 1000;
      int preheatStart_ms = LaunchConfig.preheatStartTime * 1000;
      int countdown_ms = LaunchConfig.countdownTime * 1000-250;     //countdown-onReceive_sound
      onReceive_sound(5);
      if (LaunchConfig.launch_code == 33) {
        for (int t = countdown_ms; t >= 0; t -= durationResolution_ms) {
        // Start preheat when time left <= preheatStart and there's preheat duration remaining
          if (t <= preheatStart_ms && preheatDuration_ms > 0) {
          digitalWrite(RELAY_PIN, HIGH);  // Relay ON (preheat)
          digitalWrite(BUZZ, HIGH);
          preheatDuration_ms -= durationResolution_ms;
          } else {
          digitalWrite(RELAY_PIN, LOW); // Relay OFF
          digitalWrite(BUZZ, LOW);
         }

          vTaskDelayUntil(&lastWakeTime, pdMS_TO_TICKS(durationResolution_ms));
        }

        // IGNITION PHASE
        digitalWrite(RELAY_PIN, HIGH);  // Relay ON (ignite)
        digitalWrite(BUZZ, HIGH);
        delay(LaunchConfig.ignitionDelta * 1000);
        digitalWrite(RELAY_PIN, LOW); // Relay OFF
        digitalWrite(BUZZ, LOW); // Relay OFF
      }
    }
    else
    {
      TickType_t lastWakeTime = xTaskGetTickCount();
      int countdown_ms = LaunchConfig.countdownTime * 1000-250;
      int durationResolution_ms = LaunchConfig.durationResolution * 1000;     //countdown-onReceive_sound
      onReceive_sound(5);
      if (LaunchConfig.launch_code == 33) {
        for (int t = countdown_ms; t >= 0; t -= durationResolution_ms) {
          vTaskDelayUntil(&lastWakeTime, pdMS_TO_TICKS(durationResolution_ms));
        }
      }
      // IGNITION PHASE
      digitalWrite(RELAY_PIN, HIGH);  // Relay ON (ignite)
      digitalWrite(BUZZ, HIGH);
      delay(LaunchConfig.ignitionDelta * 1000);
      digitalWrite(RELAY_PIN, LOW); // Relay OFF
      digitalWrite(BUZZ, LOW); // Relay OFF
    }
  }
}
 void startup_sound()
{
    digitalWrite(BUZZ, HIGH);
    delay(300);
    digitalWrite(BUZZ, LOW);
    delay(300);
    digitalWrite(BUZZ, HIGH);
    delay(75);
    digitalWrite(BUZZ, LOW);
    delay(75);
    digitalWrite(BUZZ, HIGH);
    delay(75);
    digitalWrite(BUZZ, LOW);
    delay(75);
}
  void onReceive_sound(int times)
  {
    for(int i = 0; i < times; i++)
    {
    digitalWrite(BUZZ, HIGH);
    delay(50);
    digitalWrite(BUZZ, LOW);
    delay(50);
    }
  }
void fail_sound()
{
    digitalWrite(BUZZ, HIGH);
    delay(300);
    digitalWrite(BUZZ, LOW);
    delay(300);
    digitalWrite(BUZZ, HIGH);
    delay(300);
    digitalWrite(BUZZ, LOW);
    delay(300);
    digitalWrite(BUZZ, HIGH);
    delay(300);
    digitalWrite(BUZZ, LOW);
    delay(300);
}
```
### LaunchDisplayLibrary
- Custom display driver using U8g2 for SH1106 OLED.
- Provides functions for:
    - Splash/welcome screen
    - Authentication animations
    - Armed state screen (with T-, P_s, P_d, I_d values)
    - Countdown + preheat visual feedback
    - Ignition screen
    - Menus for parameter selection
### GetMacAddress.ino
- Utility to print the ESP32’s MAC address (used for setting ESP-NOW peers).
### ReadFob.ino
- Utility to read and print iButton IDs (used to whitelist authorized keys).
### Dependencies
#### [Arduino Core for ESP32](https://github.com/espressif/arduino-esp32)
### Libraries:
- esp_now.h (built-in)
- WiFi.h (built-in)
- esp_wifi.h (for long-range protocol mode)
- OneWire (for iButton reader)
- U8g2lib (for OLED display)
## :material-fast-forward: Setup & Upload
1. Clone repo/Download as .zip and open in Arduino IDE.
2. Select ESP32 Dev Module (or your ESP32 board).
3. Upload separately:
    - Transmitter.ino → Remote unit
    - 2.Receiver.ino → Receiver unit
4. Use GetMacAddress.ino on each ESP32 to note their MAC addresses.
    - Update broadcastAddress[] in transmitter/receiver code accordingly.
5. Use Read_fob.ino to read your iButton ID.
    - Replace in allowedID[] array in the transmitter code.

## Display demo

<img src="/assets/Gallery/Launchy/LaunchDisplayLibrary-demo.gif"
     alt="Display Demo"
     width="640">

## Board
<iframe width="640" height="480" style="border:1px solid #eeeeee;" src="https://3dviewer.net/embed.html#model=https://raw.githubusercontent.com/sanko0112/Launchy/main/3D%20Models/Launchy.glb$camera=0.09637,0.06346,0.14647,0.13868,0.00704,0.06185,0.00000,1.00000,0.00000,45.00000$projectionmode=perspective$envsettings=fishermans_bastion,off$backgroundcolor=95,95,95,255$defaultcolor=200,200,200$defaultlinecolor=100,100,100$edgesettings=off,0,0,0,1"></iframe>

## Transmitter enclosure
<iframe width="640" height="480" style="border:1px solid #eeeeee;" src="https://3dviewer.net/embed.html#model=https://raw.githubusercontent.com/sanko0112/Launchy/main/3D%20Models/Transmitter%20enclosure.step$camera=19.85658,-363.96253,193.09329,-42.09999,-91.07032,17.50000,0.00000,1.00000,0.00000,45.00000$projectionmode=perspective$envsettings=fishermans_bastion,off$backgroundcolor=95,95,95,255$defaultcolor=255,255,255$defaultlinecolor=100,100,100$edgesettings=off,0,0,0,1"></iframe>

## Igniter enclosure

<iframe width="640" height="480" style="border:1px solid #eeeeee;" src="https://3dviewer.net/embed.html#model=https://raw.githubusercontent.com/sanko0112/Launchy/main/3D%20Models/Igniter%20enclosure.step$camera=62.30919,-469.98480,38.03262,49.22316,-101.59643,21.24401,0.00000,1.00000,0.00000,45.00000$projectionmode=perspective$envsettings=fishermans_bastion,off$backgroundcolor=95,95,95,255$defaultcolor=255,255,255$defaultlinecolor=100,100,100$edgesettings=off,0,0,0,1"></iframe>

## :octicons-image-24: Photos 
<div id="Launchy-gallery"></div>

## :simple-youtube: Videos

<iframe width="560" height="315" src="https://www.youtube.com/embed/6urxjE-0fT8?si=PYN42SH8dV0idNbq" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

<iframe width="560" height="315" src="https://www.youtube.com/embed/g8prIVViN2I?si=xmCCB0V4Axc-67hd" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## :fontawesome-solid-download: Downloads
[Launchy.zip](https://github.com/sanko0112/Launchy/archive/refs/heads/main.zip)
```shell
git clone https://github.com/sanko0112/Launchy.git
cd Launchy
```