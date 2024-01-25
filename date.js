module.exports = getDate;  //It is possibile to shorten this part of code: 272 last 6 minutes.

function getDate() {

  const today = new Date();
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };

  let day = today.toLocaleDateString("en-US", options);

  return day;
}
