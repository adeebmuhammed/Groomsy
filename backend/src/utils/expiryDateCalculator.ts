export const calculateExpiryDate = (duration: number, unit: string): Date => {
        const expiry = new Date();
        if (unit === "month") expiry.setMonth(expiry.getMonth() + duration);
        if (unit === "year") expiry.setFullYear(expiry.getFullYear() + duration);
        if (unit === "day") expiry.setDate(expiry.getDate() + duration);
        return expiry;
    }