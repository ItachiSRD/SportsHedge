export const formatTimeFromSeconds = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  // Create an array to store the parts of the time
  const timeParts = [];
  
  // Add hours if greater than zero
  if (hours > 0) {
    timeParts.push(`${hours}`);
  }
  
  // Add minutes and seconds
  timeParts.push(`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
  
  // Join the parts with ':' and return
  return { timeStr: timeParts.join(), timeParts };
};

export const timeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const secondsPast = (now.getTime() - date.getTime()) / 1000;

  if (secondsPast < 60) {
    return Math.ceil(secondsPast) + 's ago';
  }
  if (secondsPast < 3600) {
    return Math.ceil(secondsPast / 60) + 'm ago';
  }
  if (secondsPast <= 86400) {
    return Math.ceil(secondsPast / 3600) + 'h ago';
  }
  if (secondsPast <= 2629800) { // Approximate number of seconds in a month
    return Math.ceil(secondsPast / 2629800) + 'd ago';
  }
  if (secondsPast <= 31557600) { // Approximate number of seconds in a year
    return Math.ceil(secondsPast / 31557600) + 'mo ago';
  }
  if (secondsPast > 31557600) {
    return Math.ceil(secondsPast / 31557600) + 'y ago'; // Approximate number of seconds in a year
  }
};
