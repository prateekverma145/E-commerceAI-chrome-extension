# E-commerce AI Assistant Chrome Extension

An AI-powered Chrome extension that transforms your online shopping experience on Amazon and Flipkart. It automatically scrapes product pages, extracts structured product details using advanced AI, and lets you ask real-time questions—all in a sleek, modern interface.

![Product AI Assistant](screenshot.png)

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Use Case](#use-case)
- [Why Use It?](#why-use-it)
- [How It Works](#how-it-works)
- [Installation](#installation)
  - [Backend Setup](#backend-setup)
  - [Chrome Extension Setup](#chrome-extension-setup)
- [Usage](#usage)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Overview

**E-commerce AI Assistant** is a Chrome extension designed to help online shoppers get comprehensive product insights without the hassle. The extension scrapes product pages on Amazon and Flipkart, processes the raw data with AI (via the Groq API), and stores structured details. Then, using a user-friendly popup interface, you can ask questions about the product and receive real-time, intelligent answers.

## Features

- **Automatic Product Scraping:**  
  Uses Crawl4AI to extract product details from supported Amazon and Flipkart pages.

- **AI-Powered Data Extraction:**  
  Processes raw data via the Groq API to deliver structured, easy-to-read product insights.

- **Real-Time Q&A:**  
  Ask questions directly in the popup and receive AI-generated responses based on the product details.

- **Smart Context Management:**  
  Stores product context along with its URL to prevent redundant scraping. Automatically reloads data when you navigate to a new product.

- **Modern & Attractive UI:**  
  Enjoy a material-design inspired interface with smooth animations, a loading spinner, and vibrant colors.

## Use Case

Perfect for busy online shoppers and tech-savvy consumers who want quick, accurate product information. Whether you're comparing features, checking reviews, or simply curious about product specifics, this extension provides detailed insights to help you make informed purchasing decisions.
## Usage
Navigate to a Supported Product Page:\
Visit an Amazon or Flipkart product page that matches the supported URL patterns.\

Open the Extension Popup:\

The extension checks if the current page is supported.
It then either loads stored product details or triggers a new scrape if the URL has changed.\
A loading animation is displayed while processing.\
Ask a Question:\
Type your question into the popup and click "Ask Now" to receive an AI-powered answer.\

View Stored Context:\
Click the "View Stored Context" button to see the structured product details that have been extracted and stored.\

## Why Use It?

- **Save Time:**  
  Instantly access structured product details without manually parsing long descriptions or reviews.

- **Enhanced Decision-Making:**  
  Leverage AI to get concise answers about product features, pricing, availability, and more.

- **Seamless Integration:**  
  The extension works directly within your browser, updating data only when needed—ensuring you always get the latest information.

- **User-Friendly Experience:**  
  With its clean, material design interface and real-time feedback, the extension offers a smooth, engaging experience.

## How It Works

1. **Scraping:**  
   When you visit a supported product page on Amazon or Flipkart, the extension retrieves the URL.

2. **Context Extraction:**  
   On opening the extension popup, it checks for stored context. If none exists (or if the URL has changed), it sends a request to a Flask backend which:
   - Uses Crawl4AI to scrape the page.
   - Passes the scraped content to the Groq API with a default prompt:  
     `"Extract all the relevant information from the following context: {context}"`  
     to structure the data.
   - Stores the refined context along with the current URL.

3. **Real-Time Q&A:**  
   Ask any product-related question in the popup. The extension uses the stored context to generate an AI-based answer via the backend.

4. **User Interface:**  
   A material-design inspired UI with a loading spinner keeps you informed during data processing, while a "View Stored Context" option lets you see the current product details.

## Installation

### Backend Setup

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/ecommerce-ai-assistant.git
   cd ecommerce-ai-assistant
