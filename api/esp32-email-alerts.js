// Global storage
let emailAlerts = [];

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

  const { id } = req.query;

  if (req.method === 'GET') {
    // GET /api/esp32/email-alerts
    return res.status(200).json({
      success: true,
      emailAlerts: emailAlerts,
      count: emailAlerts.length
    });
  }

  if (req.method === 'POST') {
    // POST /api/esp32/email-alerts - Add email alert
    const alert = req.body;

    if (!alert.zone || !alert.emails) {
      return res.status(400).json({
        success: false,
        message: 'zone and emails required'
      });
    }

    const newAlert = {
      id: `email_${Date.now()}`,
      ...alert,
      createdAt: new Date().toISOString()
    };

    emailAlerts.push(newAlert);
    console.log('✅ Email alert adicionado:', newAlert);

    return res.status(200).json({
      success: true,
      alert: newAlert,
      message: 'Email alert adicionado com sucesso'
    });
  }

  if (req.method === 'DELETE') {
    // DELETE /api/esp32/email-alerts?id=email_xxx
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'id required'
      });
    }

    const index = emailAlerts.findIndex(a => a.id === id);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Email alert not found'
      });
    }

    const deleted = emailAlerts.splice(index, 1);
    console.log('🗑️ Email alert deletado:', deleted[0]);

    return res.status(200).json({
      success: true,
      message: 'Email alert deletado com sucesso'
    });
  }

  res.status(405).json({ success: false, message: 'Method not allowed' });
}
