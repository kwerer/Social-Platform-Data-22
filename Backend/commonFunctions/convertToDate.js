function convertToDate(postDate) {
  // for creator comments
  let creatorSplitTime = postDate.split("-");
  let splitTime = postDate.split(" ");
  let splatTime = splitTime[0].split("");
  // time units
  let timeUnit = splatTime[splatTime.length - 1];
  // get number of time units
  let numUnits = splatTime.slice(0, splatTime.length - 1);
  numUnits = numUnits.join("");
  const d = new Date();

  if (timeUnit == "h") {
    d.setHours(d.getHours() - numUnits);
    return d;
  } else if (timeUnit == "d") {
    d.setDate(d.getDate() - numUnits);
    return d;
  } else if (timeUnit == "m") {
    d.setMinutes(d.getMinutes() - numUnits);
    return d;
  }
  // if the date is "3-8"
  else if (creatorSplitTime.length == 2) {
    let currentYear = d.getFullYear();
    let newDate = `${creatorSplitTime[0]}-${creatorSplitTime[1]}-${currentYear}`;
    return new Date(newDate);
  }

  // date is "3-8-2020"
  else {
    // return the original format
    return new Date(postDate).toLocaleString();
  }
}

export default convertToDate;
