let scrollMilliseconds = 30;
let scriptElement      = null;
let actualHeight       = 0;
let containerHeight    = 0;
let timerInstance      = null;
let lineHeight         = 1.5;
let textSize           = 300;
let mode               = 0;

/**
 * Loads the MarkDown file specified in the URL fragment
 *
 * @returns {Promise<void>}
 */
async function loadContent()
{
    const fragment = window.location.hash.substring(1);

    if (!fragment)
    {
        return;
    }

    const response = await fetch(fragment + ".md");

    if (!response.ok)
    {
        return;
    }

    const markdownText = await response.text();

    scriptElement.innerHTML = marked.parse(markdownText);
    onResize()
    toTop()
}

const startStop = () =>
{
    if (timerInstance)
    {
        stop();
        return;
    }

    start();
}

const stop = () =>
{
    if (!timerInstance)
    {
        return;
    }

    window.clearTimeout(timerInstance);
    timerInstance = null;
}

const start = () =>
{
    if (timerInstance)
    {
        return;
    }

    timerInstance = window.setInterval(scrollScript, scrollMilliseconds);
}

const restart = () =>
{
    stop();
    toTop();
    start();
}

const toTop = () =>
{
    const fontSize          = parseInt(getComputedStyle(scriptElement).fontSize);
    scriptElement.style.top = Math.ceil(containerHeight / 2) + "px";
}

const toBottom = () =>
{
    scriptElement.style.top = (8 - actualHeight) + "px";
}

const lineDown = () =>
{
    const fontSize   = parseInt(getComputedStyle(scriptElement).fontSize);
    const currentTop = scriptElement.style.top === "" ? 0 : parseInt(scriptElement.style.top);

    if (currentTop < (8 + fontSize - actualHeight))
    {
        return;
    }

    scriptElement.style.top = (currentTop - fontSize) + "px";
}

const lineUp = () =>
{
    const fontSize   = parseInt(getComputedStyle(scriptElement).fontSize);
    const currentTop = scriptElement.style.top === "" ? 0 : parseInt(scriptElement.style.top);

    if (currentTop > 0)
    {
        return;
    }

    scriptElement.style.top = (currentTop + fontSize) + "px";
}

const pageDown = () =>
{
    const fontSize   = parseInt(getComputedStyle(scriptElement).fontSize);
    const pageHeight = Math.max(containerHeight - fontSize, fontSize);
    const currentTop = scriptElement.style.top === "" ? 0 : parseInt(scriptElement.style.top);

    if (currentTop < (8 + pageHeight - actualHeight))
    {
        return;
    }

    scriptElement.style.top = (currentTop - pageHeight) + "px";
}

const pageUp = () =>
{
    const fontSize   = parseInt(getComputedStyle(scriptElement).fontSize);
    const pageHeight = Math.max(containerHeight - fontSize, fontSize);
    const currentTop = scriptElement.style.top === "" ? 0 : parseInt(scriptElement.style.top);

    if (currentTop > 0)
    {
        return;
    }

    scriptElement.style.top = (currentTop + pageHeight) + "px";
}

const slower = () =>
{
    if (scrollMilliseconds < 50)
    {
        scrollMilliseconds += 10;
    }

    stop();
    start();
}

const faster = () =>
{
    if (scrollMilliseconds > 10)
    {
        scrollMilliseconds -= 10;
    }

    stop();
    start();
}

const smaller = () =>
{
    textSize = Math.max(100, textSize - 50);

    document.getElementById("outerContainer").style.fontSize = textSize + "%";

    onResize()
}

const bigger = () =>
{
    textSize = Math.min(500, textSize + 50);

    document.getElementById("outerContainer").style.fontSize = textSize + "%";

    onResize()
}

const condense = () =>
{
    lineHeight = Math.max(1.0, lineHeight - 0.1);

    scriptElement.style.lineHeight = lineHeight;

    onResize()
}

const expand = () =>
{
    lineHeight = Math.min(2.0, lineHeight + 0.1);

    scriptElement.style.lineHeight = lineHeight;

    onResize()
}

const updateModeIcon = () =>
{
    const elIndicator = document.getElementById("modeIndicator");
    elIndicator.classList.remove("fa-gauge", "fa-text-height")

    if (mode === 0)
    {
        elIndicator.classList.add("fa-gauge");
        elIndicator.style.color = "lime";
        return;
    }

    elIndicator.classList.add("fa-text-height");
    elIndicator.style.color = "red";
}

const toggleAlignText = () =>
{
    switch (scriptElement.style.textAlign)
    {
        default:
        case "justify":
            scriptElement.style.textAlign = "left";
            break;

        case "left":
            scriptElement.style.textAlign = "right";
            break;

        case "right":
            scriptElement.style.textAlign = "justify";
            break;
    }
}

const mirror = () =>
{
    const container     = document.getElementById("scriptContainer");
    const computedStyle = getComputedStyle(container)

    if (computedStyle.transform === "matrix(1, 0, 0, -1, 0, 0)")
    {
        container.style.transform = "scale(1,1)";
    }
    else
    {
        container.style.transform = "scale(1, -1)";
    }
}

const toggleHelp = () => {
    const elHelp = document.getElementById('helpContainer');

    elHelp.style.display = elHelp.style.display === 'none' ? '' : 'none';
}

const onResize = () =>
{
    actualHeight    = scriptElement.offsetHeight;
    containerHeight = document.getElementById("scriptContainer").offsetHeight;
}

const scrollScript = () =>
{
    const currentTop = scriptElement.style.top === "" ? 0 : parseInt(scriptElement.style.top);

    if (currentTop < (8 - actualHeight))
    {
        return;
    }

    scriptElement.style.top = (currentTop - 1) + "px";
}

const init = () =>
{
    scriptElement = document.getElementById("script");

    loadContent();

    actualHeight    = scriptElement.offsetHeight;
    containerHeight = document.getElementById("scriptContainer").offsetHeight;

    toTop();
}

const onKeyUp = (event) =>
{
    const key = event.key;

    switch (key)
    {
        /**
         * SPACE:
         *   Mode 0 = start/stop
         *   Mode 1 = toggle text align
         */
        case " ":
            if (mode === 0)
            {
                startStop();
            }
            else
            {
                toggleAlignText();
            }
            break;

        // ENTER: Toggle mode
        case "Enter":
            mode = 1 - mode;

            updateModeIcon()
            break;

        /**
         * Arrow Down:
         *   Mode 0 = line down
         *   Mode 1 = font size decrease
         */
        case "ArrowDown":
            if (mode === 0)
            {
                lineDown()
            }
            else
            {
                smaller()
            }
            break;

        case "ArrowUp":
            if (mode === 0)
            {
                lineUp()
            }
            else
            {
                bigger()
            }
            break;

        case "ArrowLeft":
            if (mode === 0)
            {
                slower()
            }
            else
            {
                condense()
            }
            break;

        case "ArrowRight":
            if (mode === 0)
            {
                faster()
            }
            else
            {
                expand()
            }
            break;

        case "Home":
            toTop();
            break;

        case "End":
            toBottom();
            break;

        case "PageDown":
            pageDown();
            break;

        case "PageUp":
            pageUp();
            break;

        case "-":
            smaller();
            break;

        case "+":
        case "=":
            bigger();
            break;

        case "<":
        case ",":
            condense();
            break;

        case ">":
        case ".":
            expand();
            break;

        case "h":
        case "H":
            slower();
            break;

        case "l":
        case "L":
            faster();
            break;

        case "j":
        case "J":
            lineUp();
            break;

        case "k":
        case "K":
            lineDown();
            break;

        case "/":
            mirror();
            break;

        case "F1":
            toggleHelp();
            break;
    }

    event.preventDefault();
}

document.addEventListener("DOMContentLoaded", init)
document.addEventListener("resize", onResize)
window.addEventListener("keyup", onKeyUp)
window.addEventListener("keydown", (event) => {
    event.preventDefault()
})