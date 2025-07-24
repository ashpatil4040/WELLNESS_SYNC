# Free AI Setup Guide

Your wellness app now supports multiple free AI options! Here are your options:

## 1. Ollama (Recommended - Completely Free & Local)

**Pros:** Completely free, runs locally, no API keys needed, private
**Cons:** Requires local installation

### Setup:
1. Download Ollama from https://ollama.ai/
2. Install it on your computer
3. Open terminal and run: `ollama pull llama2`
4. That's it! The app will automatically detect and use Ollama

## 2. Groq (Free Tier)

**Pros:** Fast, good quality, generous free tier
**Cons:** Requires sign-up

### Setup:
1. Go to https://console.groq.com/
2. Sign up for free account
3. Get your API key
4. Add to `.env` file: `VITE_GROQ_API_KEY=your_key_here`

## 3. Hugging Face (Free with limits)

**Pros:** Free, no signup required for basic use
**Cons:** Rate limited, simpler models

### Setup:
- No setup required! Works out of the box
- For better rate limits, get free API key from https://huggingface.co/

## 4. Smart Fallbacks (Always Available)

If no AI services are available, the app uses intelligent rule-based insights based on your data patterns.

## Current Priority Order:
1. Ollama (if running locally)
2. Groq (if API key provided)  
3. Hugging Face (free tier)
4. Smart fallback insights

## Quick Start:
The easiest option is to install Ollama for completely free, unlimited AI assistance!
