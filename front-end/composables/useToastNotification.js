import { useToast } from "primevue/usetoast";

export const useToastNotifications = () => {
    const toast = useToast();

    const showToast = (severity, summary, detail, life = 3000) => {
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
