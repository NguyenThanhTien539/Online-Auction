const formatToUTC = (date: Date, options: "datetime" | "date" | "time" = "datetime") => {
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
export default formatToUTC;