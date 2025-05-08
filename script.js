$(document).ready(function () {
  $("#accordion").accordion({
    collapsible: true,
    heightStyle: "content",
  });

  $("#contactDate").datepicker({
    minDate: 0,
    maxDate: "+2M",
  });

  $("#themeSwitcher").click(function () {
    $("body").toggleClass("bg-gray-800 text-white");
    $(".bg-white").toggleClass("bg-gray-700");
    $(".text-gray-800").toggleClass("text-gray-200");
    $(".text-gray-700").toggleClass("text-gray-200");
    $(".text-gray-600").toggleClass("text-gray-400");

    if ($(this).html().includes("Dark")) {
      $(this).html('<i class="fas fa-sun mr-2"></i>Light Mode');
    } else {
      $(this).html('<i class="fas fa-moon mr-2"></i>Dark Mode');
    }
  });

  $("#funFactsToggle").click(function () {
    $("#funFactsContent").slideToggle();

    if ($(this).text().includes("Show")) {
      $(this).text("Hide Fun Facts");
    } else {
      $(this).text("Show Fun Facts");
    }
  });

  $(".hobby-list").on("click", "li", function () {
    $(".hobby-list li").removeClass("highlight");
    $(this).addClass("highlight");
  });

  $("#langList").on("click", "li", function () {
    $("#langList li").removeClass("highlight");
    $(this).addClass("highlight");
  });

  $("#contactForm").submit(function (e) {
    e.preventDefault();
    let isValid = true;

    $(".error").removeClass("error");
    $(".error-text").addClass("hidden");

    const name = $("#name").val().trim();
    if (name === "") {
      $("#name").addClass("error");
      $("#nameError").removeClass("hidden");
      isValid = false;
    }

    const email = $("#email").val().trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      $("#email").addClass("error");
      $("#emailError").removeClass("hidden");
      isValid = false;
    }

    const message = $("#message").val().trim();
    if (message === "") {
      $("#message").addClass("error");
      $("#messageError").removeClass("hidden");
      isValid = false;
    }

    if (isValid) {
      $("#successPopup").addClass("show");

      setTimeout(function () {
        $("#successPopup").removeClass("show");
      }, 3000);

      $("#contactForm")[0].reset();
    }
  });

  let currentCategory = "Programming";
  let jokeHistory = [];

  const categoryMap = {
    Programming: "Programming",
    Misc: "Misc",
    Pun: "Pun",
    Spooky: "Spooky",
    Christmas: "Christmas",
  };

  const supportedCategories = [
    "Programming",
    "Misc",
    "Pun",
    "Spooky",
    "Christmas",
  ];

  $(".joke-category").click(function () {
    $(".joke-category")
      .removeClass("bg-purple-600 text-white")
      .addClass("bg-gray-300 text-gray-800");
    $(this)
      .removeClass("bg-gray-300 text-gray-800")
      .addClass("bg-purple-600 text-white");
    currentCategory = $(this).data("category");
  });

  $("#getJokeButton").click(function () {
    $("#loadingIndicator").removeClass("hidden");

    const apiCategory = categoryMap[currentCategory];
    const apiUrl = `https://v2.jokeapi.dev/joke/${apiCategory}?safe-mode`;

    $.ajax({
      url: apiUrl,
      method: "GET",
      dataType: "json",
      success: function (response) {
        $("#loadingIndicator").addClass("hidden");

        let setup, punchline;

        if (response.type === "single") {
          setup = response.joke;
          punchline = "";
        } else {
          setup = response.setup;
          punchline = response.delivery;
        }

        $("#jokeSetup").text(setup);
        $("#jokePunchline").text(punchline);
        $("#jokeCategory").text(`Category: ${response.category}`);

        const historyItem = {
          setup: setup,
          punchline: punchline,
          category: response.category,
          timestamp: new Date(),
          id: response.id,
        };
        jokeHistory.unshift(historyItem);

        updateJokeHistory();
      },
      error: function (xhr, status, error) {
        $("#loadingIndicator").addClass("hidden");

        $("#jokeSetup").text("Failed to fetch joke");
        $("#jokePunchline").text("Please try again later.");
        $("#jokeCategory").text("Error");

        console.error("JokeAPI Error:", error);
      },
    });
  });

  function updateJokeHistory() {
    $("#jokeHistoryList").empty();

    const recentJokes = jokeHistory.slice(0, 5);

    recentJokes.forEach(function (joke) {
      const timestamp = joke.timestamp.toLocaleTimeString();
      const historyItem = `
          <div class="bg-gray-50 p-3 rounded">
            <div class="flex justify-between items-start mb-1">
              <p class="font-medium">${joke.setup}</p>
              <span class="text-xs text-gray-500">${timestamp}</span>
            </div>
            <p class="text-gray-600 italic">${joke.punchline}</p>
            <p class="text-xs text-gray-500 mt-1">Category: ${joke.category}</p>
          </div>
        `;
      $("#jokeHistoryList").append(historyItem);
    });
  }
});
