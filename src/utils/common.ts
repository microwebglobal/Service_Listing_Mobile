function convertTo12HourFormat(timeString: string) {
  const [hour, minute] = timeString.split(':');
  let formattedHour = parseInt(hour, 10);
  if (formattedHour > 12) {
    formattedHour -= 12;
    return `${formattedHour}:${minute} PM`;
  }
  return `${formattedHour}:${minute} AM`;
}

export {convertTo12HourFormat};
