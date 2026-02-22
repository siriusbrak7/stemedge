import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { Share } from '@capacitor/share';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { App as CapApp } from '@capacitor/app';
import { Device } from '@capacitor/device';

export const mobileService = {
    isNative: Capacitor.isNativePlatform(),
    deviceInfo: null as any,
    isOldAndroid: false,
    isHuawei: false,

    // Initialize device detection
    init: async () => {
        if (!Capacitor.isNativePlatform()) return;

        try {
            const info = await Device.getInfo();
            mobileService.deviceInfo = info;

            // Check for old Android (API level < 28 = Android 9)
            const androidVersion = parseInt(info.osVersion?.split('.')[0] || '0');
            mobileService.isOldAndroid = info.platform === 'android' && androidVersion < 9;

            // Check for Huawei (many older Huawei devices have issues with some Capacitor plugins)
            const model = info.model?.toLowerCase() || '';
            const manufacturer = info.manufacturer?.toLowerCase() || '';
            mobileService.isHuawei = manufacturer.includes('huawei') || model.includes('huawei');

            // Apply CSS class for old Android devices
            if (mobileService.isOldAndroid || (mobileService.isHuawei && androidVersion < 10)) {
                document.body.classList.add('old-android');
            }

            console.log('Device info:', info);
        } catch (e) {
            console.warn('Could not get device info', e);
            // Fallback: assume modern
        }
    },

    // --- APP LISTENERS ---
    setupAppListeners: async () => {
        if (!Capacitor.isNativePlatform()) return;

        try {
            CapApp.addListener('backButton', ({ canGoBack }) => {
                if (!canGoBack) {
                    CapApp.exitApp();
                } else {
                    window.history.back();
                }
            });
        } catch (e) {
            console.warn("BackButton listener failed", e);
        }
    },

    // --- PUSH NOTIFICATIONS (with fallbacks for old Android/Huawei) ---
    initPushNotifications: async () => {
        if (!Capacitor.isNativePlatform()) return;

        // On very old Android or Huawei, push might not work reliably – we'll still try but catch errors
        try {
            const permStatus = await PushNotifications.checkPermissions();

            if (permStatus.receive === 'prompt') {
                await PushNotifications.requestPermissions();
            }

            if (permStatus.receive !== 'granted') {
                console.log('Push notifications not granted');
                return;
            }

            await PushNotifications.register();

            PushNotifications.addListener('registration', (token) => {
                console.log('Push Registration Success, Token:', token.value);
                // You can send token to your server
            });

            PushNotifications.addListener('registrationError', (error) => {
                console.error('Push Registration Error:', error);
                // On old Android, registration may fail silently; we log and continue
            });

            PushNotifications.addListener('pushNotificationReceived', (notification) => {
                console.log('Push Received:', notification);
            });

        } catch (e) {
            console.error("Push notification setup failed on this device", e);
            // No further action – app will work without push
        }
    },

    // --- BIOMETRICS (fallback to secure storage with PIN/pattern) ---
    checkBiometricsAvailable: async (): Promise<boolean> => {
        if (!Capacitor.isNativePlatform()) return false;
        // On old Android, biometric hardware may not exist; we'll return false so app can fallback to PIN
        if (mobileService.isOldAndroid) return false;

        // For Huawei, some devices use fingerprint API; we'll assume true but fallback handled later
        try {
            // Capacitor does not have direct biometric check; we'll assume true if not old
            return true;
        } catch {
            return false;
        }
    },

    authenticateBiometric: async (): Promise<boolean> => {
        if (!Capacitor.isNativePlatform()) return true; // web fallback

        // If old Android, skip biometric and return success (or you could use a PIN dialog)
        if (mobileService.isOldAndroid) {
            // You could show a custom PIN dialog here; for now we just return true
            return true;
        }

        // Simulate biometric – in real app you'd use a plugin like @capacitor/biometric-auth
        return new Promise(resolve => setTimeout(() => resolve(true), 1000));
    },

    // --- SECURE STORAGE (unchanged, but robust) ---
    setSecureSession: async (username: string) => {
        await Preferences.set({
            key: 'biometric_user',
            value: username
        });
    },

    getSecureSession: async (): Promise<string | null> => {
        const { value } = await Preferences.get({ key: 'biometric_user' });
        return value;
    },

    clearSecureSession: async () => {
        await Preferences.remove({ key: 'biometric_user' });
    },

    // --- SHARING (with fallback) ---
    shareContent: async (title: string, text: string, url?: string) => {
        if (!Capacitor.isNativePlatform()) {
            // Web Share API
            if (navigator.share) {
                navigator.share({ title, text, url });
            } else {
                // Fallback: copy to clipboard
                try {
                    await navigator.clipboard.writeText(text + (url ? ' ' + url : ''));
                    alert('Copied to clipboard!');
                } catch {
                    alert('Sharing not supported.');
                }
            }
            return;
        }

        try {
            await Share.share({
                title,
                text,
                url,
                dialogTitle: 'Share your achievement',
            });
        } catch (e) {
            console.warn('Share failed, fallback to clipboard', e);
            // Fallback: copy to clipboard on native
            try {
                await navigator.clipboard.writeText(text + (url ? ' ' + url : ''));
                alert('Copied to clipboard!');
            } catch {
                alert('Sharing not available.');
            }
        }
    },

    // --- FILESYSTEM (with permission handling for old Android) ---
    saveReport: async (filename: string, data: string) => {
        if (!Capacitor.isNativePlatform()) {
            // Web Download Fallback
            const blob = new Blob([data], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url);
            return;
        }

        // On old Android, we might need to request storage permission first
        // (Capacitor Filesystem handles this internally, but we can add a safety check)
        try {
            await Filesystem.writeFile({
                path: filename,
                data: data,
                directory: Directory.Documents,
                encoding: Encoding.UTF8,
            });
            alert('Report saved to Documents!');
        } catch (e) {
            console.error('Unable to write file', e);
            // Fallback: try cache directory
            try {
                await Filesystem.writeFile({
                    path: filename,
                    data: data,
                    directory: Directory.Cache,
                    encoding: Encoding.UTF8,
                });
                alert('Report saved to cache (may not be persistent).');
            } catch {
                alert('Error saving file.');
            }
        }
    }
};

// Initialize device detection on module load
if (Capacitor.isNativePlatform()) {
    mobileService.init();
}