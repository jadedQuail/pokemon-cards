import { useToast } from "primevue/usetoast";
import type { SeverityLevel } from '~/static/constants'

export const useToastNotifications = () => {
    const toast = useToast();

    const showToast = (
        severity: SeverityLevel,
        summary: string,
        detail: string,
        life: number = 3000
    ): void => {
        toast.add({
            severity,
            summary,
            detail,
            life,
        });
    };

    return {
        showToast,
    };
};
