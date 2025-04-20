export function formatMemberSince(dateString: string) {
    const date = new Date(dateString);
    const mont = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    return `${mont} ${year}`
}

export function formatPublicDate(dateString: string) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`
}