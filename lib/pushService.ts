/**
 * TruthPulse City/Cluster Targeted Web Push & Notification Service
 * Supports targeted notifications by Metropolitan Cluster (Delhi NCR, Mumbai MMR, Raigarh, etc.)
 */

export interface PushSubscriptionData {
  endpoint?: string;
  metroHub: string;
  categories: string[];
  subscribedAt: string;
}

/**
 * Request notification permission from browser
 */
export async function requestBrowserPushPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (e) {
    console.warn('Notification permission request note:', e);
    return false;
  }
}

/**
 * Register subscription for a specific Metropolitan Cluster
 */
export async function subscribeToMetroAlerts(
  metroHub: string = 'all',
  categories: string[] = ['BREAKING', 'POLITICS', 'WEATHER']
): Promise<{ success: boolean; message: string; permissionGranted: boolean }> {
  const granted = await requestBrowserPushPermission();

  try {
    const res = await fetch('/api/notifications/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        metroHub,
        categories,
        endpoint: typeof window !== 'undefined' ? window.location.origin : undefined
      })
    });

    const data = await res.json();
    if (data.success) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('truthpulse_subscribed_metro', metroHub);
        localStorage.setItem('truthpulse_push_enabled', 'true');
      }
      return { success: true, message: data.message, permissionGranted: granted };
    }

    return { success: false, message: data.error || 'Failed to subscribe', permissionGranted: granted };
  } catch (err: any) {
    return { success: false, message: err.message || 'Network error subscribing', permissionGranted: granted };
  }
}

/**
 * Send a local browser notification and broadcast event to Navbar
 */
export function sendLocalPushNotification(
  title: string,
  body: string,
  url: string = '/',
  metroHub?: string
) {
  if (typeof window === 'undefined') return;

  // 1. Fire browser notification if permission is granted
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      const notif = new Notification(`TruthPulse • ${title}`, {
        body,
        icon: '/icon.svg',
        badge: '/icon.svg',
        tag: `tp-${Date.now()}`,
        data: { url }
      });

      notif.onclick = () => {
        window.focus();
        if (url) window.location.href = url;
      };
    } catch (e) {
      console.warn('Local Notification display note:', e);
    }
  }

  // 2. Broadcast internal window event for Navbar live drawer
  try {
    const detail = {
      id: `notif-${Date.now()}`,
      title,
      body,
      metroHub: metroHub || 'National',
      url,
      timestamp: new Date().toISOString()
    };
    window.dispatchEvent(new CustomEvent('truthpulse_new_notification', { detail }));
    
    // Store in localStorage history
    const existing = JSON.parse(localStorage.getItem('truthpulse_local_notifications') || '[]');
    existing.unshift(detail);
    localStorage.setItem('truthpulse_local_notifications', JSON.stringify(existing.slice(0, 20)));
  } catch (e) {}
}
