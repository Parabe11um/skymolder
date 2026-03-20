const factory = document.querySelector(".factory")

if(factory){

    const base = document.createElement("img")
    base.src = "/img/Frame_274.png"
    base.className = "factory-base"

    const p1 = document.createElement("img")
    p1.src = "/img/Frame_275.png"
    p1.className = "factory-part"

    const p2 = document.createElement("img")
    p2.src = "/img/Frame_278.png"
    p2.className = "factory-part part-278"

    const p3 = document.createElement("img")
    p3.src = "/img/Frame_281.png"
    p3.className = "factory-part part-281"

    const p4 = document.createElement("img")
    p4.src = "/img/Frame_280.png"
    p4.className = "factory-part part-280"
    factory.append(base,p1,p2,p3,p4)

    const factoryZones = [

        {x:5,  y:26, w:18, h:55, layer:p1},
        {x:23, y:14, w:33, h:62, layer:p2},
        {x:47, y:0,  w:23, h:71, layer:p3},
        {x:74, y:28, w:17, h:71, layer:p4}

    ]

    factoryZones.forEach(z=>{

        const zone = document.createElement("div")

        zone.style.position="absolute"
        zone.style.left = z.x + "%"
        zone.style.top = z.y + "%"
        zone.style.width = z.w + "%"
        zone.style.height = z.h + "%"

        zone.style.cursor="pointer"
        zone.style.zIndex = 10

        zone.addEventListener("mouseenter", () => {
            z.layer.style.opacity = 1
        })

        zone.addEventListener("mouseleave", () => {
            z.layer.style.opacity = 0
        })

        zone.addEventListener("pointerleave", () => {
            z.layer.style.opacity = 0
        })

        factory.appendChild(zone)

    })

}


const bubbles = document.querySelector(".bubbles")
const text = document.querySelector(".cloud-text")

window.addEventListener("load", () => {

    if(bubbles){

        const images = [
            "/img/Frame_285.png",
            "/img/Frame_279.png",
            "/img/Frame_277.png"
        ]

        let total = 12
        let popped = 0

        for(let i=0;i<total;i++){

            let bubble = document.createElement("div")
            bubble.className = "bubble"

            let img = document.createElement("img")
            img.src = images[Math.floor(Math.random()*images.length)]

            bubble.appendChild(img)

            const size = Math.random() * 120 + 120
            bubble.style.width = size + "px"
            bubble.style.height = size + "px"

            const rect = bubbles.getBoundingClientRect()
            const centerY = rect.height * 0.5

            bubble.style.left = Math.random() * (rect.width - size) + "px"

            let top = centerY + (Math.random() - 0.5) * rect.height * 0.4
            top = Math.max(0, Math.min(rect.height - size, top))
            bubble.style.top = top + "px"

            bubble.style.position = "absolute"
            bubble.style.zIndex = 5

            bubble.onclick = ()=>{
                bubble.classList.add("pop")
                setTimeout(()=>bubble.remove(),250)

                popped++

                if(popped === total){
                    text.classList.remove("hidden")
                }
            }

            bubbles.appendChild(bubble)
        }
    }

})

const slider = document.querySelector(".slider");

if (slider) {
    const drops = document.querySelectorAll(".drop");
    const snow = document.querySelectorAll(".snow");
    const field = document.querySelector(".freeze-field");
    const thermoInner = document.querySelector(".thermo-inner");
    const thermoLine = document.querySelector(".thermo-line");

    let dragging = false;

    slider.addEventListener("pointerdown", () => {
        dragging = true;
        slider.style.cursor = "grabbing";
    });

    document.addEventListener("pointerup", (e) => {
        dragging = false;
        slider.style.cursor = "grab";
    });

    document.addEventListener("pointermove", (e) => {
        if (!dragging) return;

        const lineRect = thermoLine.getBoundingClientRect();
        const innerRect = thermoInner.getBoundingClientRect();
        const sliderHalf = slider.offsetHeight / 2;

        let y = e.clientY - lineRect.top;
        if (y < 0) y = 0;
        if (y > lineRect.height) y = lineRect.height;

        const sliderTop = (lineRect.top - innerRect.top) + y - sliderHalf;
        slider.style.top = `${sliderTop}px`;
        slider.style.bottom = "auto";

        const percent = 1 - (y / lineRect.height);

        drops.forEach((d) => {
            d.style.opacity = 1 - percent;
            d.style.transform = `scale(${1 - percent * 0.25})`;
        });

        snow.forEach((s) => {
            s.style.opacity = percent;
            s.style.transform = `scale(${0.75 + percent * 0.25})`;
        });

        if (percent > 0.6) {
            field.classList.add("frozen");
        } else {
            field.classList.remove("frozen");
        }
    });
}

const scene = document.querySelector(".cloud-scene")
const items = document.querySelectorAll(".drag-item")
const zones = document.querySelectorAll(".drop-zone")

let active = null
let shiftX = 0
let shiftY = 0

items.forEach(item => {
    item.addEventListener("pointerdown", (e) => {
        if (item.classList.contains("placed")) return

        active = item

        const rect = item.getBoundingClientRect()
        const sceneRect = scene.getBoundingClientRect()

        shiftX = e.clientX - rect.left
        shiftY = e.clientY - rect.top

        item.style.left = (rect.left - sceneRect.left) + "px"
        item.style.top = (rect.top - sceneRect.top) + "px"
        item.style.right = "auto"
        item.style.bottom = "auto"

        item.style.zIndex = 10
        item.style.animation = "none"

        e.preventDefault()
    })
})


document.addEventListener("pointerup", (e) => {

    if (!active) return

    zones.forEach(zone => {

        const z = zone.getBoundingClientRect()
        const i = active.getBoundingClientRect()

        const centerX = i.left + i.width / 2
        const centerY = i.top + i.height / 2

        const overlap =
            centerX > z.left &&
            centerX < z.right &&
            centerY > z.top &&
            centerY < z.bottom

        if (overlap && active.dataset.target === zone.dataset.zone) {

            active.style.left = (zone.offsetLeft) + "px"
            active.style.top  = (zone.offsetTop) + "px"

            active.style.pointerEvents = "none"
            active.classList.add("placed")
        }

    })

    const placedNow = document.querySelectorAll(".drag-item.placed").length

    if (placedNow === 3) {
        document.querySelector(".info1").classList.add("visible")
        document.querySelector(".info2").classList.add("visible")
    }

    active.style.zIndex = 1
    active = null

})

document.addEventListener("pointermove", (e) => {

    if (!active) return

    const sceneRect = scene.getBoundingClientRect()

    active.style.left = (e.clientX - sceneRect.left - shiftX) + "px"
    active.style.top  = (e.clientY - sceneRect.top  - shiftY) + "px"

})


    const rainCloud = document.querySelector(".rain-top-cloud");
    const rainContainer = document.querySelector(".rain-container");

    if(!rainCloud || !rainContainer){
        console.log("RAIN ELEMENTS NOT FOUND");
    }

if(rainCloud && rainContainer) {

    let raining = false;
    let rainInterval = null;

    function createDrop() {

        const images = [
            "/img/Frame_291.png",
            "/img/Frame_292.png",
            "/img/Frame_293.png"
        ];

        const drop = document.createElement("img");
        drop.src = images[Math.floor(Math.random() * images.length)];
        drop.className = "raindrop";

        const cloudRect = rainCloud.getBoundingClientRect();
        const containerRect = rainContainer.getBoundingClientRect();

        const rainWidth = cloudRect.width * 0.7;
        const offsetX = (cloudRect.width - rainWidth) / 2;

        drop.style.left =
            (Math.random() * rainWidth
                + cloudRect.left - containerRect.left + offsetX) + "px";

        const startY = Math.random() * (cloudRect.height * 0.6);

        drop.style.top =
            (cloudRect.top - containerRect.top + startY) + "px";

        drop.style.animationDuration = (Math.random() * 0.8 + 1.2) + "s";

        rainContainer.appendChild(drop);

        setTimeout(() => {

            if (raining) return;

            drop.style.animation = "none";

            const rect = drop.getBoundingClientRect();
            const containerRect = rainContainer.getBoundingClientRect();

            drop.style.top = (rect.top - containerRect.top) + "px";

            drop.classList.add("float");

        }, 1200);

        setTimeout(() => {
            drop.remove();
        }, 7000);

    }

    function startRain() {
        if (raining) return;

        raining = true;
        rainInterval = setInterval(createDrop, 45);
    }

    function stopRain() {
        raining = false;
        clearInterval(rainInterval);
    }

    rainCloud.addEventListener("pointerdown", (e) => {
        e.preventDefault()
        startRain()
    });

    window.addEventListener("pointerup", stopRain);

}