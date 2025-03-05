(function() {
    // On every page load, clear any previously stored context.
    chrome.runtime.sendMessage({ action: "clear_context" }, (response) => {
      console.log("Context cleared on page load:", response);
    });
  })();
  