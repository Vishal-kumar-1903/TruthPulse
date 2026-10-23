const localtunnel = require('localtunnel');

async function main() {
  try {
    const tunnel = await localtunnel({ 
      port: 3000,
      subdomain: 'truthpulse-news-' + Math.floor(Math.random() * 1000)
    });
    console.log('🚀 PUBLIC_TUNNEL_URL: ' + tunnel.url);
    console.log('Anyone on phone or PC can open this URL now!');

    tunnel.on('close', () => {
      console.log('Tunnel closed');
    });

    tunnel.on('error', (err) => {
      console.error('Tunnel error:', err);
    });
  } catch (err) {
    console.error('Failed to start tunnel:', err);
  }
}

main();
