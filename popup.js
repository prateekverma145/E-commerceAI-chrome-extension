document.addEventListener("DOMContentLoaded", function () {
    const askButton = document.getElementById("askBtn");
    const loader = document.getElementById("loader");
    // Initially disable the Ask button
    askButton.disabled = true;
  
    // Function to show loader
    function showLoader() {
      loader.style.display = "block";
    }
  
    // Function to hide loader
    function hideLoader() {
      loader.style.display = "none";
    }
  
    // Get active tab's URL
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      let currentUrl = tabs[0].url;
      // Define supported product page patterns for Amazon & Flipkart
      const supportedPattern = /amazon\.in\/(dp|.*\/dp\/|gp\/product)\/|flipkart\.com\/.*\/p\//i;
  
      if (!supportedPattern.test(currentUrl)) {
        document.getElementById("answer").innerText =
          "This site is not supported. Please visit an Amazon or Flipkart product page.";
        askButton.disabled = true;
        return;
      }
  
      // Show loader while checking for stored context
      showLoader();
  
      // Check for stored context and URL
      chrome.storage.local.get(["storedContext", "contextUrl"], (result) => {
        if (result.storedContext && result.contextUrl === currentUrl) {
          console.log("Using stored context from URL:", result.contextUrl);
          document.getElementById("answer").innerText =
            "Product details loaded. Ask your question!";
          askButton.disabled = false;
          hideLoader();
        } else {
          // No stored context or URL mismatch: trigger a crawl for the current URL.
          chrome.runtime.sendMessage({ action: "crawl_page", url: currentUrl }, (crawlResponse) => {
            if (crawlResponse && crawlResponse.success) {
              console.log("Crawled and stored new context:", crawlResponse.context);
              document.getElementById("answer").innerText =
                "Product details loaded. Ask your question!";
              askButton.disabled = false;
            } else {
              document.getElementById("answer").innerText =
                "Error: Unable to load product details.";
              askButton.disabled = true;
            }
            hideLoader();
          });
        }
      });
    });
  });
  
  document.getElementById("askBtn").addEventListener("click", () => {
    const questionField = document.getElementById("question");
    const question = questionField.value.trim();
    const loader = document.getElementById("loader");
    const askButton = document.getElementById("askBtn");
  
    if (!question) {
      document.getElementById("answer").innerText = "Please enter a question before asking.";
      return;
    }
  
    // Disable the Ask button while processing and show loader
    askButton.disabled = true;
    loader.style.display = "block";
  // Log stored context on popup load
// chrome.storage.local.get(["storedContext", "contextUrl"], (result) => {
//     console.log("Stored context:", result.storedContext);
//     console.log("Context URL:", result.contextUrl);
//   });
  
    // Retrieve stored context before asking the question.
    chrome.storage.local.get(["storedContext", "contextUrl"], (result) => {
        // console.log("Stored context:", result.storedContext);
      // Verify that the stored URL still matches the current tab URL.
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        let currentUrl = tabs[0].url;
        if (result.storedContext && result.contextUrl === currentUrl) {
          fetch("http://127.0.0.1:5000/ask", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question: question, context: result.storedContext })
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.answer) {
                document.getElementById("answer").innerText = data.answer;
              } else {
                document.getElementById("answer").innerText = "Error: " + data.error;
              }
              askButton.disabled = false;
              loader.style.display = "none";
            })
            .catch((error) => {
              document.getElementById("answer").innerText = "Error: " + error;
              askButton.disabled = false;
              loader.style.display = "none";
            });
        } else {
          document.getElementById("answer").innerText =
            "Context is outdated. Please refresh or navigate to a supported product page.";
          askButton.disabled = true;
          loader.style.display = "none";
        }
      });
    });
  });
  