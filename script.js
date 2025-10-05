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
    const timeString = [now.getHours().toString().padStart(2, "0"), now.getMinutes().toString().padStart(2, "0"), now.getSeconds().toString().padStart(2, "0")].join(":");
    // const timeString = '23:59:59' //Midnight Test
    const start = padTime(startStr);
    const end = padTime(endStr);
    if (end.slice(0, -6) <= 5) return true
    return timeString >= start && timeString <= end;
}
function addPlace(locationName, placeName, open, color, link, map, phone){
    const location = document.getElementById(locationName.toLowerCase().replace(/ /g, "").replace(/'/g, "").replace(/@/g, ""))
    const p = document.createElement("p");
    let number
    let linkbutton
    if (phone != 'None') {
        number = ` <a href="tel:${phone}"><img src="/images/phone.svg"></a>`
    } else {
        number = ``
    }
    if (link != 'None') {
        console.log('link')
        linkbutton = ` <a href="${link}"><img src="/images/info.svg"></a>`
    } else {
        linkbutton = ``
    }
    p.innerHTML = `<p>${placeName}: <span style="color: ${color}">${open}</span></p>${linkbutton} <a href="${map}"><img src="/images/location.svg"></a>${number} <a href="https://forms.gle/Uhx4LgysA6JcokQF7"><img src="/images/report.svg"></a>`;
    location.appendChild(p);
}
function addOpennow(locationName, placeName, open, color, link, map, phone){
    const location = document.getElementById("opennow" + locationName.toLowerCase().replace(/ /g, "").replace(/'/g, "").replace(/@/g, ""))
    const p = document.createElement("p");
    let number
    let linkbutton
    if (phone != 'None') {
        number = ` <a href="tel:${phone}"><img src="/images/phone.svg"></a>`
    } else {
        number = ``
    }
    if (link != 'None') {
        console.log('link')
        linkbutton = ` <a href="${link}"><img src="/images/info.svg"></a>`
    } else {
        linkbutton = ``
    }

    p.innerHTML = `<p>${placeName}: <span style="color: ${color}">${open}</span></p>${linkbutton} <a href="${map}"><img src="/images/location.svg"></a>${number} <a href="https://forms.gle/Uhx4LgysA6JcokQF7"><img src="/images/report.svg"></a>`;
    
    location.appendChild(p);
    location.style.display = "block";
    const status = document.getElementById("status")
    if (locationName != 'Outside Campus Stores' && locationName != 'Outside Campus'){
        status.style.display = 'none'
    }
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
                if ((openTimes[dayOfweek] != "Closed") && (openTimes[dayOfweek] != "Open 24/7")){
                    if (openTimes[dayOfweek].length <= 17){
                        const [startTime, endTime] = openTimes[dayOfweek].split(" ");
                        if (isCurrentTimeInRange(startTime, endTime)){
                            addPlace(locationName, placeName, `Open (${startTime.slice(0, -3)} - ${endTime.slice(0, -3)})`, `#53ff5e`, openTimes[7], openTimes[8], openTimes[9])
                            addOpennow(locationName, placeName, `Open (${startTime.slice(0, -3)} - ${endTime.slice(0, -3)})`, `#53ff5e`, openTimes[7], openTimes[8], openTimes[9])
                        } else {
                            addPlace(locationName, placeName, `Closed (${startTime.slice(0, -3)} - ${endTime.slice(0, -3)})`, `#ff5353`, openTimes[7], openTimes[8], openTimes[9])
                        }
                    } else if (openTimes[dayOfweek].length <= 35){
                        const [startTime, endTime, startTime2, endTime2] = openTimes[dayOfweek].split(" ");
                        if (isCurrentTimeInRange(startTime, endTime) || isCurrentTimeInRange(startTime2, endTime2)){
                            addPlace(locationName, placeName, `Open (${startTime.slice(0, -3)} - ${endTime.slice(0, -3)} & ${startTime2.slice(0, -3)} - ${endTime2.slice(0, -3)})`, `#53ff5e`, openTimes[7], openTimes[8], openTimes[9])
                            addOpennow(locationName, placeName, `Open (${startTime.slice(0, -3)} - ${endTime.slice(0, -3)})`, `#53ff5e`, openTimes[7], openTimes[8], openTimes[9])

                        } else {
                            addPlace(locationName, placeName, `Closed (${startTime.slice(0, -3)} - ${endTime.slice(0, -3)} & ${startTime2.slice(0, -3)} - ${endTime2.slice(0, -3)})`, `#ff5353`, openTimes[7], openTimes[8], openTimes[9])
                        }
                    } else {
                        const [startTime, endTime, startTime2, endTime2, startTime3, endTime3] = openTimes[dayOfweek].split(" ");
                        if (isCurrentTimeInRange(startTime, endTime) || isCurrentTimeInRange(startTime2, endTime2) || isCurrentTimeInRange(startTime3, endTime3)){
                            addPlace(locationName, placeName, `Open (${startTime.slice(0, -3)} - ${endTime.slice(0, -3)}, ${startTime2.slice(0, -3)} - ${endTime2.slice(0, -3)} & ${startTime3.slice(0, -3)} - ${endTime3.slice(0, -3)})`, `#53ff5e`, openTimes[7], openTimes[8], openTimes[9])
                            addOpennow(locationName, placeName, `Open (${startTime.slice(0, -3)} - ${endTime.slice(0, -3)}, ${startTime2.slice(0, -3)} - ${endTime2.slice(0, -3)} & ${startTime3.slice(0, -3)} - ${endTime3.slice(0, -3)})`, `#53ff5e`, openTimes[7], openTimes[8], openTimes[9])
                        } else {
                            addPlace(locationName, placeName, `Closed (${startTime.slice(0, -3)} - ${endTime.slice(0, -3)}, ${startTime2.slice(0, -3)} - ${endTime2.slice(0, -3)} & ${startTime3.slice(0, -3)} - ${endTime3.slice(0, -3)})`, `#ff5353`, openTimes[7], openTimes[8], openTimes[9])
                        }
                    }
                } else if (openTimes[dayOfweek] === "Open 24/7"){
                    addPlace(locationName, placeName, `Open 24/7`, `#53ff5e`, openTimes[7], openTimes[8], openTimes[9])
                    addOpennow(locationName, placeName, `Open 24/7`, `#53ff5e`, openTimes[7], openTimes[8], openTimes[9])
                } else {
                    addPlace(locationName, placeName, `Closed All Day`, `#ff5353`, openTimes[7], openTimes[8], openTimes[9])
                }
            }
        }
    } catch (err) {
        console.error("Error loading JSON:", err);
    }
}
loadData()
scheduleReload();