
export function sanitizeText(text) {
    return text.replace(/\s+/g, ' ').trim().toLowerCase();
}
