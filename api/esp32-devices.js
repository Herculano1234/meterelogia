// Global storage
let esp32Devices = [];

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
    // GET /api/esp32/devices
    return res.status(200).json({
      success: true,
      devices: esp32Devices,
      count: esp32Devices.length
    });
  }

  if (req.method === 'POST') {
    // POST /api/esp32/devices - Add device
    const device = req.body;

    if (!device.id || !device.name || !device.zone) {
      return res.status(400).json({
        success: false,
        message: 'id, name, and zone required'
      });
    }

    const newDevice = {
      ...device,
      connected: true,
      lastConnection: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    esp32Devices.push(newDevice);
    console.log('✅ Device adicionado:', newDevice);

    return res.status(200).json({
      success: true,
      device: newDevice,
      message: 'Device adicionado com sucesso'
    });
  }

  if (req.method === 'DELETE') {
    // DELETE /api/esp32/devices?id=0001
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'id required'
      });
    }

    const index = esp32Devices.findIndex(d => d.id === id);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Device not found'
      });
    }

    const deleted = esp32Devices.splice(index, 1);
    console.log('🗑️ Device deletado:', deleted[0]);

    return res.status(200).json({
      success: true,
      message: 'Device deletado com sucesso'
    });
  }

  res.status(405).json({ success: false, message: 'Method not allowed' });
}
