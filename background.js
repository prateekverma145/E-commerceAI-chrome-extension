chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "crawl_page") {
      fetch("http://127.0.0.1:5000/crawl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: message.url })
      })
        .then(response => response.json())
        .then(data => {
          if (data.context) {
            // Save both the structured context and the URL that was crawled.
            chrome.storage.local.set(
              { storedContext: data.context, contextUrl: message.url },
              () => {
                sendResponse({ success: true, context: data.context });
              }
            );
          } else {
            sendResponse({ success: false, error: "No context received" });
          }
        })
        .catch(error => {
          console.error("Error crawling page:", error);
          sendResponse({ success: false, error: error.toString() });
        });
      return true; // Keep channel open for async response.
    } else if (message.action === "get_context") {
      chrome.storage.local.get(["storedContext", "contextUrl"], (result) => {
        if (result.storedContext) {
          sendResponse({
            success: true,
            context: result.storedContext,
            contextUrl: result.contextUrl
          });
        } else {
          sendResponse({ success: false, error: "No context available" });
        }
      });
      return true;
    } else if (message.action === "clear_context") {
      chrome.storage.local.remove(["storedContext", "contextUrl"], () => {
        sendResponse({ success: true });
      });
      return true;
    }
  });
  