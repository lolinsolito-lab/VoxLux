export const generateCertificateId = (coursePrefix: string = 'VL'): string => {
    const date = new Date();
    const year = date.getFullYear();
    // Generate a more unique, NFT-style hash segment
    // Format: VL-SS-2024-X7A9-B2C1 (Looks like a license key / crypto hash)
    const segment1 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const segment2 = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${coursePrefix}-${year}-${segment1}-${segment2}`;
};

export const getVerificationUrl = (certificateId: string): string => {
    // Provisional domain as per user request
    const baseUrl = 'https://vox-lux.vercel.app';
    return `${baseUrl}/verify/${certificateId}`;
};

export const formatCertificateDate = (date: Date = new Date()): string => {
    return new Intl.DateTimeFormat('it-IT', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(date);
};
