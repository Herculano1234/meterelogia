/**
 * CÓDIGO ESP32 v2.0 - SISTEMA AVANÇADO DE ALERTA DE TROVOADAS
 * 
 * NOVAS FUNCIONALIDADES v2.0:
 * - ID único para vincular ESP32 à zona específica
 * - Leitura analógica de antena para detecção de descarga elétrica
 * - Integração HTTP POST para enviar alertas ao backend
 * - Requisições HTTP GET para receber alertas baseados em CAPE
 * - Sistema de buzzer + LED inteligente
 * 
 * Hardware necessário:
 * - ESP32
 * - Buzzer no pino 34
 * - LED no pino 2
 * - Antena no pino 35 (ADC)
 * - Botão reset no pino 0
 * 
 * Fluxo:
 * 1. ESP32 faz requisição GET para /api/alerts/{ID}
 * 2. Backend verifica CAPE + previsão de chuva para a zona
 * 3. Se houver alerta, ativa buzzer + LED
 * 4. ESP32 lê antena, se houver descarga detecta e envia POST
 * 5. Sistema notifica zona em tempo real
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// ============================================
// CONFIGURAÇÃO
// ============================================
const char* SSID = "onzanji";
const char* PASSWORD = "1234567890";
const char* ESP32_ID = "0001";              // ID único - vincula a Huambo
const char* SERVER_URL = "https://meterelogia.vercel.app/api";  // Backend Vercel (Serverless Functions)

// ============================================
// PINOS
// ============================================
const int BUZZER_PIN = 34;                  // Buzzer
const int LED_STATUS_PIN = 2;               // LED status
const int ANTENNA_PIN = 35;                 // Leitura analógica antena (ADC0)
const int BUTTON_RESET_PIN = 0;             // Botão reset

// ============================================
// CONSTANTES
// ============================================
const unsigned long POLL_INTERVAL = 10000;  // Consultar servidor a cada 10 seg
const unsigned long ANTENNA_THRESHOLD = 2000;  // Leitura para detectar descarga
const int MAX_ANTENNA_READINGS = 100;
unsigned long antennaReadings[MAX_ANTENNA_READINGS];
int antennaReadingIndex = 0;

// ============================================
// VARIÁVEIS GLOBAIS
// ============================================
unsigned long lastPollTime = 0;
int currentAlertLevel = 0;
bool buzzerActive = false;
unsigned long buzzerEndTime = 0;
int failedConnections = 0;
const int MAX_FAILED_CONNECTIONS = 5;

// ============================================
// SETUP
// ============================================
void setup() {
  Serial.begin(115200);
  delay(1000);

  Serial.println("\n\n╔════════════════════════════════════════╗");
  Serial.println("║  ESP32 v2.0 - SISTEMA DE ALERTA v2.0  ║");
  Serial.println("║  ID: " + String(ESP32_ID) + "            Antena: GPIO35     ║");
  Serial.println("╚════════════════════════════════════════╝\n");

  // Configuração de pinos
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(LED_STATUS_PIN, OUTPUT);
  pinMode(ANTENNA_PIN, INPUT);
  pinMode(BUTTON_RESET_PIN, INPUT);

  // Inicializa como desligado
  digitalWrite(BUZZER_PIN, LOW);
  digitalWrite(LED_STATUS_PIN, LOW);

  // Conecta WiFi
  setupWiFi();
  connectToWiFi();

  Serial.println("✅ Sistema pronto!");
  printStatus();
}

// ============================================
// LOOP PRINCIPAL
// ============================================
void loop() {
  // Reset via botão
  if (digitalRead(BUTTON_RESET_PIN) == LOW) {
    delay(50);
    if (digitalRead(BUTTON_RESET_PIN) == LOW) {
      handleButtonPress();
      while (digitalRead(BUTTON_RESET_PIN) == LOW) delay(10);
      delay(100);
    }
  }

  // Consulta servidor
  if (millis() - lastPollTime >= POLL_INTERVAL) {
    lastPollTime = millis();
    checkAlerts();
  }

  // Lê antena continuamente
  int antennaValue = analogRead(ANTENNA_PIN);
  
  // Armazena leituras
  antennaReadings[antennaReadingIndex] = antennaValue;
  antennaReadingIndex = (antennaReadingIndex + 1) % MAX_ANTENNA_READINGS;

  // Detecta descarga se leitura for alta
  if (antennaValue > ANTENNA_THRESHOLD && buzzerActive) {
    Serial.println("⚡ DESCARGA DETECTADA na antena! Valor: " + String(antennaValue));
    
    // Envia alerta para servidor
    sendLightningAlert(antennaValue);
    
    // Intensifica buzzer
    digitalWrite(BUZZER_PIN, HIGH);
    delay(100);
    digitalWrite(BUZZER_PIN, LOW);
    delay(50);
  }

  // Controla LED
  if (WiFi.status() == WL_CONNECTED) {
    if (buzzerActive) {
      digitalWrite(LED_STATUS_PIN, HIGH);  // LED sempre ligado durante alerta
    } else {
      digitalWrite(LED_STATUS_PIN, (millis() % 1000) < 500 ? HIGH : LOW);  // Pisca
    }
  } else {
    digitalWrite(LED_STATUS_PIN, (millis() % 200) < 100 ? HIGH : LOW);  // Pisca rápido offline
  }

  delay(100);
}

// ============================================
// FUNÇÕES WiFi
// ============================================

void setupWiFi() {
  Serial.println("📡 Iniciando WiFi...");
  WiFi.mode(WIFI_STA);
  WiFi.begin(SSID, PASSWORD);
}

void connectToWiFi() {
  int attempts = 0;
  const int MAX_ATTEMPTS = 20;

  Serial.print("🔗 Conectando a " + String(SSID));

  while (WiFi.status() != WL_CONNECTED && attempts < MAX_ATTEMPTS) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println();
    Serial.println("✅ WiFi conectado!");
    Serial.println("   IP: " + WiFi.localIP().toString());
    failedConnections = 0;
  } else {
    Serial.println();
    Serial.println("❌ Falha ao conectar WiFi!");
    failedConnections++;
  }
}

// ============================================
// CONSULTA DE ALERTAS
// ============================================

/**
 * Consulta o servidor para alertas da zona
 * GET /api/alerts/{ESP32_ID}
 */
void checkAlerts() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("❌ WiFi desconectado. Reconectando...");
    connectToWiFi();
    failedConnections++;
    return;
  }

  HTTPClient http;
  http.setTimeout(5000);

  String url = String(SERVER_URL) + "/alerts/" + String(ESP32_ID);
  Serial.print("[" + String(millis() / 1000) + "s] 📡 GET " + url + "... ");

  http.begin(url);
  int httpCode = http.GET();

  if (httpCode == HTTP_CODE_OK) {
    String response = http.getString();
    Serial.println("✅");

    // Parse JSON
    StaticJsonDocument<512> doc;
    DeserializationError error = deserializeJson(doc, response);

    if (!error && doc["success"] == true) {
      JsonObject data = doc["data"];
      int level = data["level"] | 0;
      int cape = data["cape"] | 0;
      float temperature = data["temperature"] | 25;
      float precipitation = data["precipitation"] | 0;
      String description = data["description"] | "";

      if (level > 0) {
        Serial.println("   ⚠️  ALERTA DETECTADO!");
        Serial.println("   Nível: " + String(level) + " | CAPE: " + String(cape) + " J/kg");
        Serial.println("   Temp: " + String(temperature) + "°C | Precip: " + String(precipitation) + "mm");

        if (level != currentAlertLevel) {
          currentAlertLevel = level;
          activateBuzzer(level);
        }
      } else {
        if (buzzerActive) {
          deactivateBuzzer();
          Serial.println("   ☀️  Alerta cancelado");
        }
      }
    }

    failedConnections = 0;
  } else {
    Serial.println("❌ HTTP " + String(httpCode));
    failedConnections++;

    if (failedConnections >= MAX_FAILED_CONNECTIONS) {
      Serial.println("🔄 Muitas falhas. Reconectando...");
      connectToWiFi();
    }
  }

  http.end();
}

/**
 * Envia alerta de descarga detectada
 * POST /api/esp32/alert
 */
void sendLightningAlert(int antennaValue) {
  if (WiFi.status() != WL_CONNECTED) return;

  HTTPClient http;
  http.setTimeout(5000);

  String url = String(SERVER_URL) + "/esp32/alert";
  
  // Prepara JSON
  StaticJsonDocument<256> doc;
  doc["esp32Id"] = String(ESP32_ID);
  doc["zone"] = "Huambo";
  doc["antennaReading"] = antennaValue;
  doc["hasLightning"] = true;
  doc["timestamp"] = millis();

  String json;
  serializeJson(doc, json);

  Serial.print("📤 POST " + url + "... ");

  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  int httpCode = http.POST(json);

  if (httpCode == HTTP_CODE_OK) {
    Serial.println("✅ Alerta enviado!");
  } else {
    Serial.println("❌ HTTP " + String(httpCode));
  }

  http.end();
}

// ============================================
// CONTROLE DO BUZZER
// ============================================

void activateBuzzer(int level) {
  buzzerActive = true;
  currentAlertLevel = level;

  switch (level) {
    case 1:  // Chuva
      Serial.println("🔔 Ativando buzzer - CHUVA");
      buzzerEndTime = millis() + 5000;  // 5 segundos
      break;

    case 2:  // Trovoada
      Serial.println("🔔 Ativando buzzer - TROVOADA");
      buzzerEndTime = millis() + 60000;  // 60 segundos
      break;

    default:
      buzzerActive = false;
      return;
  }

  // Toca buzzer padrão
  for (int i = 0; i < 3; i++) {
    digitalWrite(BUZZER_PIN, HIGH);
    delay(100);
    digitalWrite(BUZZER_PIN, LOW);
    delay(100);
  }
}

void deactivateBuzzer() {
  buzzerActive = false;
  currentAlertLevel = 0;
  digitalWrite(BUZZER_PIN, LOW);
}

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

void handleButtonPress() {
  Serial.println("\n🔄 Resetando sistema...");
  deactivateBuzzer();
  failedConnections = 0;
  Serial.println("✅ Sistema resetado!\n");
  printStatus();
}

void printStatus() {
  Serial.println("╔════════════════════════════════════════╗");
  Serial.println("║            STATUS DO SISTEMA           ║");
  Serial.println("╚════════════════════════════════════════╝");
  Serial.println("WiFi: " + String(WiFi.status() == WL_CONNECTED ? "✅ Conectado" : "❌ Desconectado"));
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("IP:   " + WiFi.localIP().toString());
  }
  Serial.println("ESP32 ID: " + String(ESP32_ID) + " (Zona: Huambo)");
  Serial.println("Buzzer: " + String(buzzerActive ? "🔔 ATIVO" : "⏹️  Inativo"));
  Serial.println("Nível Alerta: " + String(currentAlertLevel) + (currentAlertLevel == 0 ? " (Sol)" : currentAlertLevel == 1 ? " (Chuva)" : " (Trovoada)"));
  Serial.println("Poll Interval: " + String(POLL_INTERVAL) + "ms\n");
}

/**
 * NOTAS DE CONFIGURAÇÃO:
 * 
 * 1. MUDANÇAS v2.0:
 *    - ID único identifica a zona (0001 = Huambo)
 *    - Leitura analógica de antena (GPIO 35)
 *    - Sistema HTTP integrado com backend
 *    - Detecção de descarga automática
 * 
 * 2. ENDPOINTS API:
 *    GET  /api/alerts/{ID}           → Recebe alertas por CAPE
 *    POST /api/esp32/alert           → Envia detecção de descarga
 *    POST /api/esp32/settings        → Salva configurações
 * 
 * 3. ESTRUTURA JSON RESPOSTA:
 *    {
 *      "success": true,
 *      "data": {
 *        "level": 0|1|2,
 *        "cape": numero,
 *        "temperature": numero,
 *        "precipitation": numero,
 *        "description": "string"
 *      }
 *    }
 * 
 * 4. ANTENA:
 *    - GPIO 35 (ADC0) é entrada analógica
 *    - Lê valores 0-4095
 *    - Threshold: 2000 para descarga
 *    - Armazena últimas 100 leituras
 * 
 * 5. INSTALAÇÃO:
 *    Arduino IDE > Sketch > Include Library > Manage Libraries
 *    - WiFi (pré-instalado)
 *    - HTTPClient (pré-instalado)
 *    - ArduinoJson 6.x
 */
