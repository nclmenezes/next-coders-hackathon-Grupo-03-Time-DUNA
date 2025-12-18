import moment from "moment";

export const formatDate = (data: string): string => {
  const [ano, mes, dia] = data.split("T")[0].split("-");
  return `${dia}/${mes}/${ano}`;
};

export const formatMinutesIntoHours = (minutes: number) => {
  const duration = moment.duration(minutes, "minutes");
  const formattedTime = moment
    .utc(duration.asMilliseconds())
    .format(duration.as("hours") >= 1 ? "H[h] m[min]" : "m[min]");

  return formattedTime;
};
