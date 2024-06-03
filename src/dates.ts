import { format } from "date-fns";

export function formatter(d: Date): string {
    const date = format(d, "yyyy-MM-dd")
    return date;
}
