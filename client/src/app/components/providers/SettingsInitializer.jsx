"use client"

import { useEffect } from 'react';
import { settings } from '../../../lib/settings';

export function SettingsInitializer() {
  useEffect(() => {
    // Initialize settings when the app loads
    console.log('Initializing settings...');
    settings.initialize();
    
    // Apply current settings immediately
    const currentSettings = settings.getAll();
    console.log('Current settings:', currentSettings);
    
    // Force application of appearance settings
    if (currentSettings.appearance) {
      settings.applyAppearanceSettings(currentSettings.appearance);
    }
  }, []);

  return null; // This component doesn't render anything
}
