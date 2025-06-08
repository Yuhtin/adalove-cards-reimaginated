// Settings utility for managing user preferences
const SETTINGS_KEY = 'adalove_settings';

const defaultSettings = {
  appearance: {
    theme: 'dark',
    accentColor: 'ada-red',
    animations: true,
    compactMode: false
  },
  notifications: {
    emailNotifications: true,
    pushNotifications: true,
    activityReminders: true,
    weeklyDigest: false
  },
  privacy: {
    profileVisibility: 'private',
    activityVisibility: 'private',
    dataSharing: false
  }
};

export const settings = {
  // Get all settings
  getAll() {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
    } catch (error) {
      console.error('Error loading settings:', error);
      return defaultSettings;
    }
  },

  // Get specific setting section
  get(section) {
    const allSettings = this.getAll();
    return allSettings[section] || defaultSettings[section];
  },

  // Update specific setting section
  update(section, newSettings) {
    try {
      const currentSettings = this.getAll();
      const updatedSettings = {
        ...currentSettings,
        [section]: {
          ...currentSettings[section],
          ...newSettings
        }
      };
      
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(updatedSettings));
      
      // Apply appearance changes immediately
      if (section === 'appearance') {
        this.applyAppearanceSettings(updatedSettings.appearance);
      }
      
      return updatedSettings;
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  },

  // Apply appearance settings to the DOM
  applyAppearanceSettings(appearanceSettings) {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;
    const body = document.body;

    console.log('Applying appearance settings:', appearanceSettings);

    // Apply theme
    if (appearanceSettings.theme === 'light') {
      body.classList.add('light-theme');
      body.classList.remove('dark-theme');
      console.log('Applied light theme');
    } else {
      body.classList.add('dark-theme');
      body.classList.remove('light-theme');
      console.log('Applied dark theme');
    }

    // Apply accent color
    const colorMap = {
      'ada-red': {
        primary: '#E30614',
        secondary: '#F24444',
        rgb: '227, 6, 20'
      },
      'ada-accent': {
        primary: '#F24444',
        secondary: '#E30614',
        rgb: '242, 68, 68'
      },
      'blue': {
        primary: '#3B82F6',
        secondary: '#60A5FA',
        rgb: '59, 130, 246'
      }
    };

    const colors = colorMap[appearanceSettings.accentColor] || colorMap['ada-red'];
    root.style.setProperty('--ada-red', colors.primary);
    root.style.setProperty('--ada-accent', colors.secondary);
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-secondary', colors.secondary);
    root.style.setProperty('--color-primary-rgb', colors.rgb);

    // Update CSS custom properties for gradients
    root.style.setProperty('--gradient-primary', `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`);

    console.log('Applied accent color:', appearanceSettings.accentColor, colors);

    // Apply animations
    if (appearanceSettings.animations) {
      body.classList.remove('no-animations');
      root.style.setProperty('--animation-duration', '300ms');
      console.log('Enabled animations');
    } else {
      body.classList.add('no-animations');
      root.style.setProperty('--animation-duration', '0ms');
      console.log('Disabled animations');
    }

    // Apply compact mode
    if (appearanceSettings.compactMode) {
      body.classList.add('compact-mode');
      root.style.setProperty('--spacing-unit', '0.75rem');
      root.style.setProperty('--text-size-base', '0.875rem');
      console.log('Enabled compact mode');
    } else {
      body.classList.remove('compact-mode');
      root.style.setProperty('--spacing-unit', '1rem');
      root.style.setProperty('--text-size-base', '1rem');
      console.log('Disabled compact mode');
    }

    console.log('Applied appearance settings:', appearanceSettings);
  },

  // Initialize settings on app load
  initialize() {
    const currentSettings = this.getAll();
    this.applyAppearanceSettings(currentSettings.appearance);
  },

  // Reset to defaults
  reset() {
    localStorage.removeItem(SETTINGS_KEY);
    this.applyAppearanceSettings(defaultSettings.appearance);
    return defaultSettings;
  }
};

// Auto-initialize when module loads
if (typeof window !== 'undefined') {
  // Delay initialization to ensure DOM is ready
  setTimeout(() => {
    settings.initialize();
  }, 0);
}
