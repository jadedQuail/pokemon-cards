export default defineEventHandler(async (event) => {
    const { token } = await readBody(event);

    if (!token) {
        throw createError({
            statusCode: 422,
            statusMessage: "Token not provided.",
        });
    }

    try {
        const result = await verifyTurnstileToken(token);
        return result;
    } catch (err) {
        throw createError({
            statusCode: 500,
            statusMessage: "Unable to verify. Please try again",
        });
    }
});
