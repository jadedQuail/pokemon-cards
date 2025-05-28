<template>
    <div v-if="registrationErrorCode" class="text-red-500">
        <template
            v-if="
                registrationErrorCode === RegistrationErrorCodes.DUPLICATE_USER
            "
        >
            That username is already taken. Please pick a different one.
        </template>

        <template
            v-else-if="
                registrationErrorCode === RegistrationErrorCodes.PASSWORD_WEAK
            "
        >
            <p>Your password must meet the following criteria:</p>
            <ul class="list-disc list-inside mt-1">
                <li>8-20 characters long</li>
                <li>At least one uppercase letter</li>
                <li>At least one lowercase letter</li>
                <li>At least one number</li>
                <li>At least one special character</li>
            </ul>
        </template>

        <template v-else>
            There was an error registering your account. Please try again.
        </template>
    </div>
</template>

<script setup>
import { RegistrationErrorCodes } from "../../shared/errorCodes";

defineProps({
    registrationErrorCode: String,
});
</script>
