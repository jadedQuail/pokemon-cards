<template>
    <div v-if="errorCode" class="text-red-500">
        <template v-if="errorCode === RegistrationErrorCodes.DUPLICATE_USER">
            That username is already taken. Please pick a different one.
        </template>

        <template
            v-else-if="errorCode === RegistrationErrorCodes.USERNAME_INVALID"
        >
            <p>Your username must meet the following criteria:</p>
            <ul class="list-disc list-inside mt-1">
                <li>3-20 characters long</li>
                <li>Starts with a letter</li>
                <li>
                    Contains only letters and numbers (no symbols, no spaces)
                </li>
            </ul>
        </template>

        <template
            v-else-if="errorCode === RegistrationErrorCodes.PASSWORD_WEAK"
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

        <template v-else-if="isTurnstileError">
            We weren't able to verify you this time. Please refresh the page and
            try again later.
        </template>

        <template v-else>
            There was an error registering your account. Please try again.
        </template>
    </div>
</template>

<script setup>
import { computed } from "vue";
import {
    RegistrationErrorCodes,
    TurnstileErrorCodes,
} from "../../shared/errorCodes";

const props = defineProps({
    errorCode: String,
});

const isTurnstileError = computed(() =>
    Object.values(TurnstileErrorCodes).includes(props.errorCode)
);
</script>
