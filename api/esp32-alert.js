// Global storage
let localAlerts = [];
let esp32Devices = [];
let emailAlerts = [];

function calculateSeverity(cape, hasLightning) {
  if (hasLightning) return 'extreme';
  if (cape > 3000) return 'extreme';
  if (cape > 1500) return 'high';
  if (cape > 500) return 'medium';
  return 'low';
}

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    // POST /api/esp32/alert
    const alert = req.body;

    if (!alert.esp32Id || !alert.zone) {
      return res.status(400).json({
        success: false,
        message: 'esp32Id and zone required'
      });
    }

    const newAlert = {
      id: `alert_${Date.now()}`,
      ...alert,
      timestamp: new Date().toISOString(),
      severity: calculateSeverity(alert.cape || 0, alert.hasLightning || false)
    };

    localAlerts.push(newAlert);

    // Keep only last 100 alerts
    if (localAlerts.length > 100) {
      localAlerts = localAlerts.slice(-100);
    }

    // Log to console for debugging
    console.log('📤 Alerta recebido:', newAlert);

    // Notify emails
    if (emailAlerts.length > 0) {
      const zoneEmails = emailAlerts.filter(e => e.zone === alert.zone);
      if (zoneEmails.length > 0) {
        console.log(`📧 Enviando notificação para ${zoneEmails[0].emails?.length || 0} emails em ${alert.zone}`);
      }
    }

    return res.status(200).json({
      success: true,
      alert: newAlert,
      message: `Alerta recebido e processado para ${alert.zone}`
    });
  }

  res.status(405).json({ success: false, message: 'Method not allowed' });
}
