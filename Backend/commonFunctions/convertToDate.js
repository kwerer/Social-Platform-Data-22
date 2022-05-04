function convertToDate(postDate) {
  // for creator comments
  let creatorSplitTime = postDate.split("-");
  let splitTime = postDate.split(" ");
  let splatTime = splitTime[0].split("");
  // time units
  let timeUnit = splatTime[splatTime.length - 1];
  // get the number for time
  let timeNumber = splitTime[0].substring(0, splitTime.length - 1);
  // calculate the time stamp in seconds
  let timeAfterUploadInSeconds;
  const d = new Date();
  let currentSeconds = d.getTime();

  if (timeUnit == "h") {
    timeAfterUploadInSeconds = timeNumber * 3600;
  } else if (timeUnit == "d") {
    timeAfterUploadInSeconds = timeNumber * 86400;
  } else if (timeUnit == "m") {
    timeAfterUploadInSeconds = timeNumber * 60;
  } else if (creatorSplitTime.length == 2) {
    return new Date(
      `${creatorSplitTime[0]}-${creatorSplitTime[1]}-${d.getFullYear}`
    );
  } else {
    // return the original format
    return new Date(postDate).toLocaleString();
  }

  let uploadTime = currentSeconds - timeAfterUploadInSeconds;
  let uploadTimeFormatted = new Date(uploadTime);

  return uploadTimeFormatted.toLocaleString(); // return date
}

export default convertToDate;
