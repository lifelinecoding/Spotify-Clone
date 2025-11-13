// Loading the entire docuement before executing JS.

document.addEventListener("DOMContentLoaded", function (event) {
  event.preventDefault();

  let SongCards = document.getElementsByClassName("SongCard");
  // console.log(SongCards);
  const SongInfo = document.body.getElementsByClassName("now-playing")[0];
  const PlayBtn = document.getElementById("play");
  const PreviousBtn = document.getElementById("previous");
  const NextBtn = document.getElementById("next");

  let currentAudio = new Audio();
  let currentSong = null;

  Array.from(SongCards).forEach((card) => {
    card
      .getElementsByClassName("play-btn")[0]
      .addEventListener("click", (event) => {
        event.preventDefault();

        const songName = card.getElementsByTagName("h2")[0].innerText.trim();
        const artistName = card
          .getElementsByTagName("span")[0]
          .innerText.trim();
        const songPath = `Songs/${songName
          .replaceAll(" ", "_")
          .replaceAll('"', "")
          .replaceAll("...", "")}.mp3`;

        // If the same song is clicked again, toggle play/pause
        if (currentSong === songPath && currentAudio) {
          if (currentAudio.paused) {
            currentAudio.play();
            PlayBtn.src = "./SVG/pause.svg";
          } else {
            currentAudio.pause();
            PlayBtn.src = "./SVG/play.svg";
          }
          return; // Exit function (don’t restart song)
        }

        // Stop previous song (if playing)
        if (currentAudio) {
          currentAudio.pause();
          PlayBtn.src = "./SVG/play.svg";
        }

        // Play the new song
        currentAudio.src = songPath;
        currentSong = songPath;
        currentAudio.play();
        PlayBtn.src = "./SVG/pause.svg";

        PlayBtn.addEventListener("click", (event) => {
          event.preventDefault();
          if (currentAudio.paused) {
            currentAudio.play();
            PlayBtn.src = "./SVG/pause.svg";
          } else {
            currentAudio.pause();
            PlayBtn.src = "./SVG/play.svg";
          }
        });

        // Update the now-playing info

        SongInfo.innerHTML = `<h3>${songName}</h3><span>${artistName}</span>`;
      });
  });

  // Fetch songs from the directory.

  async function fetchSongs() {
    try {
      let a = await fetch("http://127.0.0.1:3000/Songs/");
      let response = await a.text();
      console.log(response);
      let div = document.createElement("div");
      div.innerHTML = response;
      let as = div.getElementsByTagName("a");
      console.log(as);
      let songs = [];
      for (let i = 0; i < as.length; i++) {
        let href = as[i].getAttribute("href");
        if (href.endsWith(".mp3")) {
          songs.push(href);
        }
      }
      // console.log(songs); Testing if songs are fetched correctly
      return songs;
    } catch (err) {
      console.log(err);
    }
  }

  let songarray = [];
  (async () => {
    let Songs = await fetchSongs();
    Array.from(Songs).forEach((song) => {
      let s = song
        .replaceAll("%5CSongs%5C", "")
        .replaceAll("_", " ")
        .replaceAll(".mp3", "");
       console.log(s);// Testing if song names are formatted correctly
      songarray.push(s);
    });
    // console.log(songarray);
  })();
});
