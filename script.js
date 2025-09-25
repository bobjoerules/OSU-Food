const ct = document.getElementById("currenttime")
const dayOfweek = new Date().getDay()
function updateTime() {
    const currentTime = new Date().toLocaleTimeString("en-US");
    ct.textContent = currentTime
}
updateTime()
setInterval(updateTime, 1000);

function isCurrentTimeInRange(startStr, endStr) {
    function padTime(str) {
    return str
        .split(":")
        .map(s => s.padStart(2, "0"))
        .join(":");
    }
    const now = new Date();
    const timeString = [
    now.getHours().toString().padStart(2, "0"),
    now.getMinutes().toString().padStart(2, "0"),
    now.getSeconds().toString().padStart(2, "0")
    ].join(":");
    const start = padTime(startStr);
    const end = padTime(endStr);
    console.log(`${timeString} ${start} ${end}`)
    console.log(timeString >= start && timeString <= end)
    return timeString >= start && timeString <= end;
}
function addPlace(locationName, placeName, open, color, link, map){
    const location = document.getElementById(locationName.toLowerCase().replace(/ /g, "").replace(/'/g, "").replace(/@/g, ""))
    const p = document.createElement("p");
    p.innerHTML = `<p>${placeName}: <span style="color: ${color}">${open}</span></p> <a href="${link}"><img src="/images/info.svg"></a> <a href="${map}"><img src="/images/location.svg"></a> <a href="https://forms.gle/Uhx4LgysA6JcokQF7"><img src="/images/report.svg"></a>`;
    location.appendChild(p);
}
function addOpennow(locationName, placeName, open, color, link, map){
    const location = document.getElementById("opennow" + locationName.toLowerCase().replace(/ /g, "").replace(/'/g, "").replace(/@/g, ""))
    const p = document.createElement("p");
    p.innerHTML = `<p>${placeName}: <span style="color: ${color}">${open}</span></p> <a href="${link}"><img src="/images/info.svg"></a> <a href="${map}"><img src="/images/location.svg"></a> <a href="https://forms.gle/Uhx4LgysA6JcokQF7"><img src="/images/report.svg"></a>`;
    location.appendChild(p);
    location.style.display = "block";
    const status = document.getElementById("status")
    status.style.display = 'none'
}
function scheduleReload() {
    const now = new Date();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const minsToNextHalfHour = (minutes < 30 ? 30 - minutes : 60 - minutes);
    const wait = (minsToNextHalfHour * 60 - seconds) * 1000;
    setTimeout(() => {
        location.reload();
    }, wait);
}

async function loadData() {
    try {
        const response = await fetch("data.json");
        const data = await response.json();
        for (const locationName in data) {
            const companies = data[locationName];
            for (const placeName in companies) {
                const openTimes = companies[placeName];
                if (openTimes[dayOfweek] !== "Closed"){
                    if (openTimes[dayOfweek].length <= 17){
                        const [startTime, endTime] = openTimes[dayOfweek].split(" ");
                        if (isCurrentTimeInRange(startTime, endTime)){
                            addPlace(locationName, placeName, `Open (${startTime.slice(0, -3)} - ${endTime.slice(0, -3)})`, `#53ff5e`, openTimes[7], openTimes[8])
                            addOpennow(locationName, placeName, `Open (${startTime.slice(0, -3)} - ${endTime.slice(0, -3)})`, `#53ff5e`, openTimes[7], openTimes[8])
                        } else {
                            addPlace(locationName, placeName, `Closed (${startTime.slice(0, -3)} - ${endTime.slice(0, -3)})`, `#ff5353`, openTimes[7], openTimes[8])
                        }
                    } else if (openTimes[dayOfweek].length <= 35){
                        const [startTime, endTime, startTime2, endTime2] = openTimes[dayOfweek].split(" ");
                        if (isCurrentTimeInRange(startTime, endTime) || isCurrentTimeInRange(startTime2, endTime2)){
                            addPlace(locationName, placeName, `Open (${startTime.slice(0, -3)} - ${endTime.slice(0, -3)} & ${startTime2.slice(0, -3)} - ${endTime2.slice(0, -3)})`, `#53ff5e`, openTimes[7], openTimes[8])
                            addOpennow(locationName, placeName, `Open (${startTime.slice(0, -3)} - ${endTime.slice(0, -3)})`, `#53ff5e`, openTimes[7], openTimes[8])

                        } else {
                            addPlace(locationName, placeName, `Closed (${startTime.slice(0, -3)} - ${endTime.slice(0, -3)} & ${startTime2.slice(0, -3)} - ${endTime2.slice(0, -3)})`, `#ff5353`, openTimes[7], openTimes[8])
                        }
                    } else {
                        const [startTime, endTime, startTime2, endTime2, startTime3, endTime3] = openTimes[dayOfweek].split(" ");
                        if (isCurrentTimeInRange(startTime, endTime) || isCurrentTimeInRange(startTime2, endTime2) || isCurrentTimeInRange(startTime3, endTime3)){
                            addPlace(locationName, placeName, `Open (${startTime.slice(0, -3)} - ${endTime.slice(0, -3)}, ${startTime2.slice(0, -3)} - ${endTime2.slice(0, -3)} & ${startTime3.slice(0, -3)} - ${endTime3.slice(0, -3)})`, `#53ff5e`, openTimes[7], openTimes[8])
                            addOpennow(locationName, placeName, `Open (${startTime.slice(0, -3)} - ${endTime.slice(0, -3)}, ${startTime2.slice(0, -3)} - ${endTime2.slice(0, -3)} & ${startTime3.slice(0, -3)} - ${endTime3.slice(0, -3)})`, `#53ff5e`, openTimes[7], openTimes[8])
                        } else {
                            addPlace(locationName, placeName, `Closed (${startTime.slice(0, -3)} - ${endTime.slice(0, -3)}, ${startTime2.slice(0, -3)} - ${endTime2.slice(0, -3)} & ${startTime3.slice(0, -3)} - ${endTime3.slice(0, -3)})`, `#ff5353`, openTimes[7], openTimes[8])
                        }
                    }
                } else {
                    addPlace(locationName, placeName, `Closed All Day`, `#ff5353`, openTimes[7], openTimes[8])
                }
            }
        }
    } catch (err) {
        console.error("Error loading JSON:", err);
    }
}
loadData()
scheduleReload();