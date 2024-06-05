import { format, isFuture, isValid, toDate } from "date-fns";

export function isValidBirthday(dateString: string): boolean {
    const regex = /^\d{4}-\d{1,2}-\d{1,2}$/;
    if (!regex.test(dateString)) {
        return false;
    }
    const date = toDate(dateString);
    return !isFuture(date) && isValid(date);
}
