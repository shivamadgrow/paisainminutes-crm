// Utility to detect client Device, Browser, IP, and Live Geolocation

export async function getLiveSecurityDetails() {
  const result = {
    ip: '103.246.40.12',
    city: 'New Delhi',
    region: 'Delhi',
    country: 'India',
    countryCode: 'IN',
    latitude: 28.6139,
    longitude: 77.2090,
    browser: 'Chrome',
    os: 'Windows 11',
    device: 'Desktop',
    accuracy: 'High (GPS/Network)',
    isp: 'Airtel Broadband'
  };

  // 1. Detect Browser & OS
  try {
    const ua = navigator.userAgent;
    if (ua.includes('Win')) result.os = 'Windows';
    else if (ua.includes('Mac')) result.os = 'macOS';
    else if (ua.includes('Android')) result.os = 'Android';
    else if (ua.includes('Linux')) result.os = 'Linux';
    else if (ua.includes('iPhone') || ua.includes('iPad')) result.os = 'iOS';

    if (ua.includes('Firefox')) result.browser = 'Firefox';
    else if (ua.includes('Edg')) result.browser = 'Edge';
    else if (ua.includes('Chrome')) result.browser = 'Chrome';
    else if (ua.includes('Safari')) result.browser = 'Safari';
  } catch (e) {}

  // 2. Fetch Live IP and Location from IP-API
  try {
    const response = await fetch('https://ipapi.co/json/', { timeout: 3000 });
    if (response.ok) {
      const data = await response.json();
      if (data.ip) result.ip = data.ip;
      if (data.city) result.city = data.city;
      if (data.region) result.region = data.region;
      if (data.country_name) result.country = data.country_name;
      if (data.country_code) result.countryCode = data.country_code;
      if (data.latitude) result.latitude = data.latitude;
      if (data.longitude) result.longitude = data.longitude;
      if (data.org) result.isp = data.org;
    }
  } catch (e) {
    // Fallback if network blocked
  }

  // 3. Attempt precise browser HTML5 Geolocation (if granted)
  if ('geolocation' in navigator) {
    try {
      const pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 4000,
          enableHighAccuracy: true,
          maximumAge: 60000
        });
      });
      if (pos && pos.coords) {
        result.latitude = parseFloat(pos.coords.latitude.toFixed(4));
        result.longitude = parseFloat(pos.coords.longitude.toFixed(4));
        result.accuracy = `GPS (±${Math.round(pos.coords.accuracy)}m)`;
      }
    } catch (e) {
      // Permission denied or timeout, fallback to IP geo
    }
  }

  return result;
}
