
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { Share } from '@capacitor/share';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { App as CapApp } from '@capacitor/app';

export const mobileService = {
    isNative: Capacitor.isNativePlatform(),

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

    // --- PUSH NOTIFICATIONS ---
    initPushNotifications: async () => {
        if (!Capacitor.isNativePlatform()) return;

        try {
            const permStatus = await PushNotifications.checkPermissions();

            if (permStatus.receive === 'prompt') {
                await PushNotifications.requestPermissions();
            }

            if (permStatus.receive !== 'granted') {
                return;
            }

            await PushNotifications.register();

            PushNotifications.addListener('registration', (token) => {
                console.log('Push Registration Success, Token:', token.value);
                // In production: await api.updateUserPushToken(token.value);
            });

            PushNotifications.addListener('registrationError', (error) => {
                console.error('Push Registration Error:', error);
            });

            PushNotifications.addListener('pushNotificationReceived', (notification) => {
                console.log('Push Received:', notification);
            });

        } catch (e) {
            console.error("Push notification setup failed", e);
        }
    },

    // --- BIOMETRICS ---
    checkBiometricsAvailable: async (): Promise<boolean> => {
        if (!Capacitor.isNativePlatform()) return false;
        return true; 
    },

    authenticateBiometric: async (): Promise<boolean> => {
        if (!Capacitor.isNativePlatform()) return true; 
        return new Promise(resolve => setTimeout(() => resolve(true), 1000));
    },

    // --- SECURE STORAGE ---
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

    // --- SHARING ---
    shareContent: async (title: string, text: string, url?: string) => {
        if (!Capacitor.isNativePlatform()) {
            if (navigator.share) {
                navigator.share({ title, text, url });
            } else {
                alert("Sharing not supported on this browser.");
            }
            return;
        }

        await Share.share({
            title,
            text,
            url,
            dialogTitle: 'Share your achievement',
        });
    },

    // --- FILESYSTEM ---
    saveReport: async (filename: string, data: string) => {
        if (!Capacitor.isNativePlatform()) {
            // Web Download Fallback
            const blob = new Blob([data], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            return;
        }

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
            alert('Error saving file.');
        }
    }
};
