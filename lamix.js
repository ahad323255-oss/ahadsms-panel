const https = require('https');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // ⚠️ আপনার আসল API Token/Key-টি "YOUR_LAMIX_API_KEY"-এর জায়গায় বসান[cite: 1]
    const TOKEN = "Gew7IKusY1Jor047-hI3f60WrWi0l_sPMKdaD23FYIk"; 
    const { action } = req.query;

    let endpoint = "";
    if (action === 'messages') endpoint = "/api/v1/messages";
    else if (action === 'numbers') endpoint = "/api/v1/numbers";
    else if (action === 'ranges') endpoint = "/api/v1/ranges";
    else {
        return res.status(400).json({ error: "Invalid action parameter" });
    }

    const options = {
        hostname: 'panel.lamix.org',
        path: endpoint,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${TOKEN}`,
            'User-Agent': 'Mozilla/5.0'
        }
    };

    const request = https.request(options, (response) => {
        let body = '';
        response.on('data', chunk => body += chunk);
        response.on('end', () => {
            try {
                const json = JSON.parse(body);
                return res.status(response.statusCode).json(json);
            } catch (e) {
                return res.status(500).json({ error: "Failed to parse API response" });
            }
        });
    });

    request.on('error', (err) => {
        return res.status(500).json({ error: "Network error", message: err.message });
    });

    request.end();
};