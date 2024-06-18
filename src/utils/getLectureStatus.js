const moment = require('moment-timezone');

const getLectureStatus = (lectureTimes) => {
  if (!lectureTimes) {
    return { inSession: false, nearestLecture: null };
  }

  const scheduleMap = {
    1: "09:00-10:00",
    2: "10:00-11:00",
    3: "11:00-12:00",
    4: "12:00-13:00",
    5: "13:00-14:00",
    6: "14:00-15:00",
    7: "15:00-16:00",
    8: "16:00-17:00",
    9: "17:00-18:00",
    10: "18:00-19:00",
    11: "19:00-20:00",
    12: "20:00-21:00",
    13: "21:00-22:00",
  };

  const dayOfWeek = {
    월: "Monday",
    화: "Tuesday",
    수: "Wednesday",
    목: "Thursday",
    금: "Friday",
  };

  const currentKoreaTime = moment().tz("Asia/Seoul");
  const todayInKorea = currentKoreaTime.format("dddd");

  let nearestLecture = null;
  let nearestStartTime = moment.tz("Asia/Seoul").add(1, "weeks"); // Start with a time far in the future
  let inSession = false;
  lectureTimes.split(",").forEach((time) => {
    const match = time.match(/(\D+)(\d+)/);
    if (!match) {
      console.log("No match found for time:", time);
      return;
    }

    const [day, period] = match.slice(1);
    const lectureDay = dayOfWeek[day];

    const [start, end] = scheduleMap[period].split("-");
    let startTime = moment
      .tz(`${currentKoreaTime.format("YYYY-MM-DD")} ${start}`, "Asia/Seoul")
      .day(lectureDay);
    let endTime = moment
      .tz(`${currentKoreaTime.format("YYYY-MM-DD")} ${end}`, "Asia/Seoul")
      .day(lectureDay);

    // Adjust start and end times to ensure they are correct for the current week
    if (startTime.isBefore(currentKoreaTime)) {
      startTime.add(1, "week");
      endTime.add(1, "week");
    }

    // Check if the lecture is in session
    if (
      todayInKorea === lectureDay &&
      currentKoreaTime.isBetween(
        startTime.clone().subtract(1, "week"),
        endTime.clone().subtract(1, "week")
      )
    ) {
      nearestLecture = { day, period, startTime, endTime };
      inSession = true;
    }

    // Always update nearest lecture if it's closer
    if (nearestStartTime.isAfter(startTime)) {
      nearestStartTime = startTime;
      nearestLecture = { day, period, startTime, endTime };
    }
  });

  return { inSession, nearestLecture };
};

module.exports = getLectureStatus;
