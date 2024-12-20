document.addEventListener("DOMContentLoaded", async () => {
  document
    .getElementById("refresh-header")
    .addEventListener("click", async () => {
      const url = document.getElementsByTagName("img")[0]?.src;
      await fetch(url, { cache: "reload", headers: { "x-refresh": "true" } });
      for (const img of document.getElementsByTagName("img")) {
        img.src = img.src;

        // const url = new URL(img.src);
        // url.hash = Math.random();
        // img.src = url.toString();
      }
    });

  document
    .getElementById("refresh-query")
    .addEventListener("click", async () => {
      for (const img of document.getElementsByTagName("img")) {
        const url = new URL(img.src);
        url.searchParams.set(
          "refresh",
          parseInt(url.searchParams.get("refresh") ?? 0) + 1
        );
        img.src = url.toString();
      }
    });

  document
    .getElementById("refresh-data-url-header")
    .addEventListener("click", async () => {
      loadImage("header");
    });

  document
    .getElementById("refresh-data-url-query")
    .addEventListener("click", async () => {
      loadImage("query");
    });

  loadImage(null);
});

async function loadImage(refresh) {
  const url = new URL("/date.png", location);
  if (refresh === "query") {
    url.searchParams.set(
      "refresh",
      parseInt(url.searchParams.get("refresh") ?? 0) + 1
    );
  }

  const res = await fetch(url.toString(), {
    headers: {
      "cache-control": refresh ? "max-age=0" : "",
      ...(refresh === "header" ? { "x-refresh": "true" } : {}),
    },
  });

  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  for (const dataImageEl of document.getElementsByClassName("data-image")) {
    dataImageEl.style.backgroundImage = `url(${objectUrl})`;
  }
}
