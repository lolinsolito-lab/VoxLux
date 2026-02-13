import { useState, useEffect } from 'react';

export function useGodMode() {
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        // Check local storage on mount
        const stored = localStorage.getItem('vox_god_mode') === 'true';
        setEnabled(stored);

        // Listen for storage changes (to sync across tabs/components)
        const handleStorageChange = () => {
            const newVal = localStorage.getItem('vox_god_mode') === 'true';
            setEnabled(newVal);
        };

        window.addEventListener('storage', handleStorageChange);
        // Custom event for same-tab updates
        window.addEventListener('vox_god_mode_change', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('vox_god_mode_change', handleStorageChange);
        };
    }, []);

    const toggle = () => {
        const newState = !enabled;
        setEnabled(newState);
        localStorage.setItem('vox_god_mode', String(newState));
        // Dispatch custom event for immediate UI update
        window.dispatchEvent(new Event('vox_god_mode_change'));
    };

    return { enabled, toggle };
}
