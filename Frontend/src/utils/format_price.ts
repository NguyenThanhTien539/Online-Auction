// Format price: example: 1000 -> "1.000"
export function formatPrice(price?: number): string {
    if(!price) return "";
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
export function parsePrice(formattedPrice?: string): number | null {
    if (!formattedPrice) return null;
    const numericString = formattedPrice.replace(/\./g, '');
    const price = parseFloat(numericString);
    return isNaN(price) ? null : price;
}


