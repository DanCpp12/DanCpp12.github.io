let ProjectButtons = []

document.addEventListener("DOMContentLoaded", async () => {
    await loadGames();
    GenerateGames();
})

let missingImg = "Images/Coming soon.png"
let missingText = "Error 402: Text not found"
let missingText_short = "Error402"
let redacted = "█████"

async function loadGames() {
    try {
        const response = await fetch("../Games.json");
        if (!response.ok) {
            throw new Error("Failed to load JSON");
        }
        ProjectButtons = await response.json();
    } catch (error) {
        console.error("Error loading project buttons:", error);
    }
}

function GenerateGames() {
    const root = document.querySelector("article");
    if (!root) {
        console.error("401: root container not found")
        return
    }
    ProjectButtons.forEach(Company => {
        var n = 0
        n = ChapterNum(Company.company);

        const Chapter = document.createElement("div");
        Chapter.id = "Chapter" + (n+1)
        if (n == 0) {
            Chapter.className = "FirstChapter"
        } else if (n == ProjectButtons.length - 1) {
            Chapter.className = "EndChapter"
        } else {
            Chapter.className = "MidleChapter"
        }

        if (ProjectButtons.length == 1 || n == ProjectButtons.length - 1) {
            Chapter.innerHTML = `
                <div class="GameGrid"></div>
            `;
        } else {
            Chapter.innerHTML = `
                <div class="GameGrid"></div>
                <hr>
            `;
        }

        Company.buttons.forEach(Data => {
            Data = normalizeData(Data);

            const Button = CreateButtonRoot(Data);
            Button.append(
                CreatePoster(Data),
                CreateDescription(Data),
                CreteProjectData(Data)
            );

            var child = Chapter.firstElementChild;
            child.append(Button);
            root.append(Chapter);
            /*var GameGrid = child.firstElementChild;
            GameGrid.appendChild(Button);*/
        });
    })
}

function ChapterNum(company) {
    var i = 0
    switch (company) {
        case "future_games":
            i = 0;
            break;
        case "edutechsmart":
            i = 1;
            break
        default:
            break;
    };
    return i
}

function normalizeData(Data) {
    if (Data.active && Data.page == "") Data.active = false;
    if (!Data.active && Data.page != "") Data.page = ""

    Data.poster ||= missingImg;
    Data.title ||= missingText;
    Data.description ||= missingText;
    Data.teamSize ||= missingText_short;
    Data.duration ||= missingText_short;
    Data.engine ||= missingText_short;

    if (Data.teamSize == "_") Data.teamSize = redacted;
    if (Data.duration == "_") Data.duration = redacted;
    if (Data.engine == "_") Data.engine = redacted;
    
    return Data;
}

function CreateButtonRoot(Data) {
    const Root = document.createElement("div");
    Root.className = "Game";

    if (!Data.active) {
        Root.className += " Disabled"
    } else {
        Root.onclick = () => {
            window.location.href = Data.page;
        };
    }

    return Root
}

function CreatePoster(Data) {
    const Poster = document.createElement("div");
    Poster.className = "Poster";

    var PosterImg = document.createElement("img");
    PosterImg.className = "Poster";
    if (!Data.active) PosterImg.classList.add("Disabled");

    PosterImg.src = Data.poster;
    PosterImg.alt = Data.alt

    Poster.append(PosterImg);

    if ('courtesy' in Data) {
        var Courtesy = document.createElement("div");

        Courtesy.className = "Courtesy"
        Courtesy.innerHTML = `
            <p>Picture courtesy of ${Data.courtesy}
        `;

        Poster.append(Courtesy)
    }
    return Poster;
}

function CreateDescription(Data) {
    const Description = document.createElement("div");
    Description.className = "Description";

    Description.innerHTML = `
        <h1 class="ubuntu-bold">${Data.title}</h1>
        <p>${Data.description}</p>
    `;

    const Container = document.createElement("div");
    Container.className = "Floor";
    const MadeAt = document.createElement("p");
    MadeAt.textContent = Data.madeAt ? ("Made at " + Data.madeAt): "";
    const Status = document.createElement("p");
    Status.textContent = Data.active
        ? "Read more"
        : "COMING SOON";
    
    Container.append(MadeAt, Status);
    Description.append(Container);

    if ('try_this_one' in Data) {
        const TryMe = document.createElement("div");
        TryMe.className = "TryMe";
        TryMe.innerHTML = `
            <p>
                Try Me<br>
                First!
            </p>
        `;
        Description.append(TryMe);
    }
        
    return Description
}

function CreteProjectData(Data) {
    const ProjectData = document.createElement("div");
    ProjectData.className = "Data";

    ProjectData.innerHTML = `
        <div>
            <span><img src="Images/Icons/Team_icon_light.png" loading="lazy"></span>
            <p>${Data.teamSize}</p>
        </div>
        <div>
            <span><img src="Images/Icons/Time_icon_light.png" loading="lazy"></span>
            <p>${Data.duration}</p>
        </div>
        <div>
            <span><img src="Images/Icons/Engine_icon_light.png" loading="lazy"></span>
            <p>${Data.engine}</p>
        </div>
    `;

    return ProjectData;
}