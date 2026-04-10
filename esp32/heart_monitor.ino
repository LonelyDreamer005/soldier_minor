/*
 * ESP32 Soldier Health Monitor — Hardware Pipeline
 * Sends BPM, Temperature, and Location via HTTP POST to Node.js backend
 */

#include <WiFi.h>
#include <HTTPClient.h>

// ── CONFIG ─────────────────────────────────────────────────────
const char* SSID       = "YOUR_WIFI_SSID";
const char* PASSWORD   = "YOUR_WIFI_PASSWORD";
// Use your computer's local IP address (find with ipconfig)
const char* SERVER_URL = "http://192.168.1.XXX:5000/api/telemetry"; 
const char* SOLDIER_ID = "ALPHA-01";

const int HEART_PIN = 34; // Analog input for heart rate sensor
const int TEMP_PIN  = 35; // Analog input for temperature sensor (e.g., LM35)

// ── SETUP ──────────────────────────────────────────────────────
void setup() {
  Serial.begin(115200);
  delay(1000);

  connectToWiFi();
}

void connectToWiFi() {
  Serial.print("\nConnecting to WiFi: ");
  Serial.println(SSID);
  
  WiFi.begin(SSID, PASSWORD);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n[WIFI] Connected!");
    Serial.print("[WIFI] IP: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\n[WIFI] Connection Failed. Re-trying...");
  }
}

// ── LOOP ───────────────────────────────────────────────────────
void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    connectToWiFi();
    return;
  }

  int bpm         = readBPM();
  float temp      = readTemp();
  double lat      = 17.3850 + (random(-100, 100) / 10000.0); // Simulated GPS jitter
  double lng      = 78.4867 + (random(-100, 100) / 10000.0);

  sendTelemetry(bpm, temp, lat, lng);

  delay(2000); // Send every 2 seconds to avoid flooding
}

// ── SENSOR READS ───────────────────────────────────────────────
int readBPM() {
  // Replace with actual SEN0203 logic if calibrated
  int raw = analogRead(HEART_PIN);
  return map(raw, 0, 4095, 60, 120); 
}

float readTemp() {
  int raw = analogRead(TEMP_PIN);
  // Example for LM35: (raw * 3.3 / 4095) * 100
  return (raw * 3.3 / 4095.0) * 100.0;
}

// ── DATA DISPATCH ─────────────────────────────────────────────
void sendTelemetry(int bpm, float temp, double lat, double lng) {
  HTTPClient http;
  http.begin(SERVER_URL);
  http.addHeader("Content-Type", "application/json");

  // Construct JSON payload
  String payload = "{";
  payload += "\"soldierId\":\"" + String(SOLDIER_ID) + "\",";
  payload += "\"bpm\":" + String(bpm) + ",";
  payload += "\"temperature\":" + String(temp, 1) + ",";
  payload += "\"location\":{\"lat\":" + String(lat, 6) + ",\"lng\":" + String(lng, 6) + "}";
  payload += "}";

  Serial.println("[HTTP] Sending: " + payload);
  
  int httpCode = http.POST(payload);

  if (httpCode > 0) {
    Serial.printf("[HTTP] POST Response: %d\n", httpCode);
  } else {
    Serial.printf("[HTTP] POST Error: %s\n", http.errorToString(httpCode).c_str());
  }

  http.end();
}

