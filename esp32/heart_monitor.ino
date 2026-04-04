/*
 * ESP32 + DFRobot SEN0203 Heart Rate Sensor
 * Sends BPM via HTTP POST to Node.js server every 1 second
 *
 * Board: ESP32 Dev Module
 * Libraries: WiFi.h (built-in), HTTPClient.h (built-in)
 */

#include <WiFi.h>
#include <HTTPClient.h>

// ── CONFIG ─────────────────────────────────────────────────────
const char* SSID       = "YOUR_WIFI_SSID";
const char* PASSWORD   = "YOUR_WIFI_PASSWORD";
const char* SERVER_URL = "http://192.168.1.XXX:5000/bpm"; // ← your PC's local IP
const char* SOLDIER_ID = "ALPHA-01";

// SEN0203 wiring: signal pin → GPIO 34 (analog input)
const int SENSOR_PIN = 34;

// ── SETUP ──────────────────────────────────────────────────────
void setup() {
  Serial.begin(115200);
  delay(500);

  Serial.print("Connecting to WiFi");
  WiFi.begin(SSID, PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println();
  Serial.print("Connected! IP: ");
  Serial.println(WiFi.localIP());
}

// ── LOOP ───────────────────────────────────────────────────────
void loop() {
  int bpm = readHeartRate();

  if (bpm >= 30 && bpm <= 200) {
    sendBPM(bpm);
  } else {
    Serial.println("[WARN] Invalid BPM reading, skipping.");
  }

  delay(1000);
}

// ── Read BPM from SEN0203 ──────────────────────────────────────
// SEN0203 outputs an analog voltage proportional to BPM.
// Calibrate MIN_VAL / MAX_VAL to your sensor's actual output range.
int readHeartRate() {
  const int SAMPLES   = 10;
  const int MIN_VAL   = 500;   // ADC value at ~30 BPM — calibrate this
  const int MAX_VAL   = 3500;  // ADC value at ~200 BPM — calibrate this

  long total = 0;
  for (int i = 0; i < SAMPLES; i++) {
    total += analogRead(SENSOR_PIN);
    delay(10);
  }
  int avg = total / SAMPLES;
  int bpm = map(avg, MIN_VAL, MAX_VAL, 30, 200);
  bpm = constrain(bpm, 30, 200);

  Serial.print("[SENSOR] ADC avg="); Serial.print(avg);
  Serial.print("  BPM="); Serial.println(bpm);
  return bpm;
}

// ── HTTP POST ──────────────────────────────────────────────────
void sendBPM(int bpm) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[HTTP] WiFi disconnected, skipping.");
    return;
  }

  HTTPClient http;
  http.begin(SERVER_URL);
  http.addHeader("Content-Type", "application/json");

  String payload = "{\"bpm\":" + String(bpm) + ",\"soldierId\":\"" + SOLDIER_ID + "\"}";
  int code = http.POST(payload);

  if (code > 0) {
    Serial.print("[HTTP] POST → "); Serial.println(code);
  } else {
    Serial.print("[HTTP] Error: "); Serial.println(http.errorToString(code));
  }

  http.end();
}
