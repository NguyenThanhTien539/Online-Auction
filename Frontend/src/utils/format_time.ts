const formatToUTC = (
  date: Date | string,
  options: "datetime" | "date" | "time" = "datetime"
) => {
  if (!date) return "";

  if (typeof date === "string") {
    // Parse dd/MM/yyyy HH:mm format
    const [datePart, timePart] = date.split(" ");
    if (!datePart || !timePart) return "";
    const [day, month, year] = datePart.split("/");
    const [hours, minutes] = timePart.split(":");
    date = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hours),
      parseInt(minutes)
    );
  }

  if (!(date instanceof Date) || isNaN(date.getTime())) return "";

  const pad = (n: number) => n.toString().padStart(2, "0");

  const year = date.getUTCFullYear();
  const month = pad(date.getUTCMonth() + 1);
  const day = pad(date.getUTCDate());
  const hours = pad(date.getUTCHours());
  const minutes = pad(date.getUTCMinutes());
  const seconds = pad(date.getUTCSeconds());

  switch (options) {
    case "datetime":
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    case "date":
      return `${year}-${month}-${day}`;
    case "time":
      return `${hours}:${minutes}`;
    default:
      return `${year}-${month}-${day} ${hours}:${minutes}`;
  }
};

export function formatToVN(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes} - ${day}/${month}/${year}`;
}

export function formatDateOfBirth(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export default formatToUTC;
