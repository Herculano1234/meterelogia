// In-memory storage (for testing - use database in production)
let localAlerts = [];

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

  const { zoneId } = req.query;

  if (req.method === 'GET') {
    // GET /api/alerts?zoneId=0001
    if (!zoneId) {
      return res.status(400).json({
        success: false,
        message: 'zoneId required'
      });
    }

    // Filter alerts by zone
    const zoneAlerts = localAlerts.filter(a => a.zone === zoneId || a.esp32Id === zoneId);
    const recentAlerts = zoneAlerts.slice(-10); // Last 10 alerts

    // Calculate alert level based on latest alert
    let level = 0;
    let cape = 0;
    let temperature = 25;
    let precipitation = 0;

    if (recentAlerts.length > 0) {
      const latest = recentAlerts[recentAlerts.length - 1];
      cape = latest.cape || 0;
      temperature = latest.temperature || 25;
      precipitation = latest.precipitation || 0;

      if (latest.hasLightning) {
        level = 2; // Trovoada
      } else if (cape > 1500) {
        level = 2; // Alta
      } else if (cape > 500) {
        level = 1; // Média (Chuva)
      }
    }

    return res.status(200).json({
      success: true,
      zone: zoneId,
      data: {
        level,
        cape,
        temperature,
        precipitation,
        description: level === 2 ? 'Alerta de trovoada' : level === 1 ? 'Alerta de chuva' : 'Sem alerta'
      },
      alerts: recentAlerts,
      timestamp: new Date().toISOString()
    });
  }

  res.status(405).json({ success: false, message: 'Method not allowed' });
}
