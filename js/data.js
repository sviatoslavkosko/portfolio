/* ============================================================
   PORTFOLIO DATA
   category: "gamedev" | "motion"   → which section it lands in
   size:     "big" | "wide" | "tall" | (omit = normal 1x1)
             big = 2x2, wide = 2 cols, tall = 2 rows  (the mosaic)
   status:   "locked"               → lock overlay (WIP / private)
   To add a project: copy a block, fill it, set category + size.
   ============================================================ */
const portfolioData = [
    /* ---------------- GAMEDEV ---------------- */
    {
        id: 1, title: "Nullum",
        role: "Main Project, Art Director, Block-out, Mechanics, Environment Art, Lighting",
        category: "gamedev", size: "big",
        tags: ["UE5", "Lumen", "Optimization"],
        image: "assets/images/Nullum.webp",
        video: "assets/images/nullum-Loop.mp4",
        link: "https://www.artstation.com/metasviatoslav"
    },
    {
        id: 3, title: "Carpathian Gloom",
        role: "Art Director, Level Design & Environment Art",
        category: "gamedev", size: "wide",
        tags: ["UE5", "Lumen", "Optimization"],
        image: "assets/images/fallentree.png",
        video: "assets/images/CG_vid.mp4", 
        link: "https://www.artstation.com/artwork/XJqnL0"
    },
    {
        id: 2, title: "Marazmus",
        role: "Level Design, Level Artist (In Development)",
        category: "gamedev", status: "locked",
        tags: ["UE5", "Lumen", "Optimization"],
        image: "assets/images/marazmus.webp",
        video: "assets/videos/nullum-loop.mp4", link: "#"
    },
    {
        id: 4, title: "Corporate Maze",
        role: "Art Director, World Building & Lighting in UE5",
        category: "gamedev", status: "locked",
        tags: ["UE5", "Lumen", "Optimization"],
        image: "assets/images/Corporate Maze.webp",
        video: "assets/videos/nullum-loop.mp4", link: "#"
    },
    {
        id: 10, title: "Spacers",
        role: "Level Art & Lighting (coming soon)",
        category: "gamedev",
        tags: ["UE5", "Lumen"],
        image: "assets/images/spacers.png", video: "assets/images/spacers.mp4", link: "#"
    },

    /* ---------------- MOTION ---------------- */
    {
        id: 6, title: "Commodoro 64",
        role: "3D Motion Designer, Art Director",
        category: "motion", size: "wide",
        tags: ["UE5", "Lumen", "3D Motion Design"],
        image: "assets/images/commodoro.webp",
        video: "assets/images/commodoro.mp4",
        link: "https://www.behance.net/gallery/200400317/3D-KEYBOARD-animation"
    },
    {
        id: 11, title: "Score",
        role: "Motion Design, Direction",
        category: "motion",
        tags: ["After Effects", "2D Motion"],
        image: "assets/images/score.png", video: "assets/images/score.mp4", link: "#"
    },
            {
        id: 12, title: "Score_2",
        role: "Motion Design, 2D",
        category: "motion",
        tags: ["After Effects", "2D Motion"],
        image: "assets/images/score1.png", video: "assets/images/score1.mp4", link: "#"
    },
                {
        id: 12, title: "Score_3",
        role: "Motion Design, 2D",
        category: "motion",
        tags: ["After Effects", "2D Motion"],
        image: "assets/images/score2.png", video: "assets/images/score2.mp4", link: "#"
    },
    {
        id: 12, title: "Manako",
        role: "Motion Design, 2D",
        category: "motion",
        tags: ["After Effects", "2D Motion"],
        image: "assets/images/manako.png", video: "assets/images/manako.mp4", link: "#"
    },
        {
        id: 12, title: "Manako_2",
        role: "Motion Design, 2D",
        category: "motion",
        tags: ["After Effects", "2D Motion"],
        image: "assets/images/manako2.png", video: "assets/images/manako2.mp4", link: "#"
    },
        {
        id: 12, title: "TAO",
        role: "Motion Design, 2D",
        category: "motion",
        tags: ["After Effects", "2D Motion"],
        image: "assets/images/tao.png", video: "assets/images/tao.mp4", link: "#"
    },

    {
        id: 7, title: "Energy drink 3D Motion",
        role: "3D Motion Designer",
        category: "motion",
        tags: ["Blender", "Cycles", "3D Motion Design"],
        image: "assets/images/patron.webp",
        video: "assets/images/patron.mp4", link: "#"
    }
];
