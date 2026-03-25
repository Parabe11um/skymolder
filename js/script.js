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

        {x:5,  y:76, w:18, h:55, layer:p1},
        {x:23, y:76, w:33, h:62, layer:p2},
        {x:47, y:76,  w:23, h:71, layer:p3},
        {x:74, y:76, w:17, h:171, layer:p4}

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

        zone.addEventListener("pointerdown", () => {

            if (z.layer.style.opacity == 1) {
                z.layer.style.opacity = 0
            } else {
                z.layer.style.opacity = 1
            }

        })

        factory.appendChild(zone)

    })

}

// Пузыри

const bubbles = document.querySelector(".bubbles")
const text = document.querySelector(".cloud-text")

window.addEventListener("load", () => {

    if(!bubbles) return;

    const images = [
        "/img/Frame_285.png",
        "/img/Frame_279.png",
        "/img/Frame_277.png"
    ]

    let total = 12
    let popped = 0

    const placed = []

    function intersects(x,y,size){

        for(let p of placed){

            const dx = x - p.x
            const dy = y - p.y
            const dist = Math.sqrt(dx*dx + dy*dy)

            if(dist < (size + p.size) * 0.45){
                return true
            }

        }

        return false
    }

    function getBubbleRect(){
        return bubbles.getBoundingClientRect()
    }

    let rect = getBubbleRect()
    const puddleHeight = rect.height * 0.45

    for(let i=0;i<total;i++){

        let bubble = document.createElement("div")
        bubble.className = "bubble"

        let img = document.createElement("img")
        img.src = images[Math.floor(Math.random()*images.length)]

        bubble.appendChild(img)

        let size = Math.random()*70 + 90

        if(window.innerWidth < 768){
            size = Math.random()*40 + 60
        }

        bubble.style.width = size+"px"
        bubble.style.height = size+"px"
        bubble.style.position = "absolute"

        rect = getBubbleRect()

        const isMobile = window.innerWidth < 768

        const cols = isMobile ? 3 : 6
        const rows = isMobile ? 4 : 2

        const colWidth = rect.width / cols
        const rowHeight = (rect.height * (isMobile ? 0.85 : 0.55)) / rows

        let x, y
        let safe = false
        let attempts = 0

        const topOffset = rect.height * 0.25
        const bottomLimit = rect.height * 0.70

        while(!safe && attempts < 200){

            x = Math.random() * (rect.width - size)
            y = Math.random() * (bottomLimit - topOffset - size) + topOffset

            safe = !intersects(x,y,size)

            attempts++
        }

        placed.push({x,y,size})

        bubble.style.left = x+"px"
        bubble.style.top = y+"px"

        bubble.addEventListener("pointerdown", ()=>{

            bubble.classList.add("pop")

            setTimeout(()=>bubble.remove(),250)

            popped++

            if(popped === total){
                text.classList.remove("hidden")
            }

        })

        bubbles.appendChild(bubble)

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


    function setTemperature(clientY){

        const lineRect = thermoLine.getBoundingClientRect();
        const innerRect = thermoInner.getBoundingClientRect();
        const sliderHalf = slider.offsetHeight / 2;

        let y = clientY - lineRect.top;

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

    }

    document.addEventListener("pointermove", (e) => {
        if (!dragging) return;
        setTemperature(e.clientY);
    });

    thermoLine.addEventListener("pointerdown", (e)=>{
        e.preventDefault()
        setTemperature(e.clientY);
    });
}






const fragmentsScene = document.querySelector(".fragments-scene");

if (fragmentsScene) {
    const cards = fragmentsScene.querySelectorAll(".drag-card");
    const zones = fragmentsScene.querySelectorAll(".drop-zone");

    let activeCard = null;
    let shiftX = 0;
    let shiftY = 0;

    cards.forEach((card) => {
        card.addEventListener("pointerdown", (e) => {
            if (card.classList.contains("is-placed")) return;

            activeCard = card;
            card.classList.add("is-dragging");

            const cardRect = card.getBoundingClientRect();
            shiftX = e.clientX - cardRect.left;
            shiftY = e.clientY - cardRect.top;

            card.setPointerCapture?.(e.pointerId);
            e.preventDefault();
        });
    });

    document.addEventListener("pointermove", (e) => {
        if (!activeCard) return;

        const sceneRect = fragmentsScene.getBoundingClientRect();

        let left = e.clientX - sceneRect.left - shiftX;
        let top = e.clientY - sceneRect.top - shiftY;

        const maxLeft = sceneRect.width - activeCard.offsetWidth;
        const maxTop = sceneRect.height - activeCard.offsetHeight;

        left = Math.max(0, Math.min(left, maxLeft));
        top = Math.max(0, Math.min(top, maxTop));

        activeCard.style.left = `${left}px`;
        activeCard.style.top = `${top}px`;
        activeCard.style.right = "auto";
        activeCard.style.bottom = "auto";
    }, { passive: false });

    document.addEventListener("pointerup", () => {
        if (!activeCard) return;

        let placedCorrectly = false;

        zones.forEach((zone) => {
            zone.classList.remove("is-hover");

            const zoneRect = zone.getBoundingClientRect();
            const cardRect = activeCard.getBoundingClientRect();

            const centerX = cardRect.left + cardRect.width / 2;
            const centerY = cardRect.top + cardRect.height / 2;

            const inside =
                centerX > zoneRect.left &&
                centerX < zoneRect.right &&
                centerY > zoneRect.top &&
                centerY < zoneRect.bottom;

            if (inside && activeCard.dataset.target === zone.dataset.zone) {
                const sceneRect = fragmentsScene.getBoundingClientRect();

                const snapWidth = zoneRect.width;
                const snapHeight = zoneRect.height;

                activeCard.style.width = `${snapWidth}px`;
                activeCard.style.height = `${snapHeight}px`;

                activeCard.style.left = `${zoneRect.left - sceneRect.left}px`;
                activeCard.style.top = `${zoneRect.top - sceneRect.top}px`;

                activeCard.classList.remove("is-dragging");
                activeCard.classList.add("is-placed");
                zone.classList.add("is-filled");

                activeCard.style.pointerEvents = "none";
                placedCorrectly = true;
            }
        });

        if (!placedCorrectly) {
            activeCard.classList.remove("is-dragging");
        }

        const placedCount = fragmentsScene.querySelectorAll(".drag-card.is-placed").length;
        if (placedCount === 3) {
            fragmentsScene.querySelector(".info1")?.classList.add("visible");
            fragmentsScene.querySelector(".info2")?.classList.add("visible");
        }

        activeCard = null;
    });

    document.addEventListener("pointermove", () => {
        if (!activeCard) return;

        zones.forEach((zone) => {
            const zoneRect = zone.getBoundingClientRect();
            const cardRect = activeCard.getBoundingClientRect();

            const centerX = cardRect.left + cardRect.width / 2;
            const centerY = cardRect.top + cardRect.height / 2;

            const inside =
                centerX > zoneRect.left &&
                centerX < zoneRect.right &&
                centerY > zoneRect.top &&
                centerY < zoneRect.bottom;

            zone.classList.toggle(
                "is-hover",
                inside && activeCard.dataset.target === zone.dataset.zone
            );
        });
    }, { passive: true });
}






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
        rainInterval = setInterval(createDrop, 70);
    }

    function stopRain() {
        raining = false;
        clearInterval(rainInterval);
    }

    rainCloud.addEventListener("pointerdown", (e) => {
        e.preventDefault()
        startRain()
    });

    rainCloud.addEventListener("touchstart", (e)=>{
        e.preventDefault()
        startRain()
    });

    rainCloud.addEventListener("click", (e)=>{
        e.preventDefault()
        startRain()
    });

    window.addEventListener("pointerup", stopRain);

}





function isPortrait(){
    return window.innerHeight > window.innerWidth;
}

function isMobile(){
    return window.innerWidth <= 900;
}

let waitingForRotateReload = false;
let lastMode = isPortrait() ? "portrait" : "landscape";

function updateRotateWatcher(){
    if(isMobile() && isPortrait()){
        waitingForRotateReload = true;
    }
}

window.addEventListener("load", () => {
    updateRotateWatcher();
});

window.addEventListener("resize", () => {
    const currentMode = isPortrait() ? "portrait" : "landscape";

    if(waitingForRotateReload && lastMode === "portrait" && currentMode === "landscape"){
        location.reload();
        return;
    }

    lastMode = currentMode;
    updateRotateWatcher();
});

window.addEventListener("orientationchange", () => {
    const currentMode = isPortrait() ? "portrait" : "landscape";

    if(waitingForRotateReload && lastMode === "portrait" && currentMode === "landscape"){
        location.reload();
        return;
    }

    lastMode = currentMode;
    updateRotateWatcher();
});