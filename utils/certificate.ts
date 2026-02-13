export const generateCertificateId = (coursePrefix: string = 'VL'): string => {
    const date = new Date();
    const year = date.getFullYear();
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${coursePrefix}-${year}-${randomPart}`;
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
