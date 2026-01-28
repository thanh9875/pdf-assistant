# 📄 PDF Assistant

A simple web application that allows users to upload PDF files and ask questions about their content using AI. The application extracts text from PDFs and uses OpenAI's GPT model to provide intelligent answers.

## ✨ Features

- 📤 **PDF Upload**: Easy drag-and-drop or click-to-upload interface
- 🤖 **AI Chatbot**: Ask questions about your PDF content
- 💬 **Interactive Chat**: Real-time conversation with the AI
- 🎨 **Modern UI**: Clean and responsive design
- 🔒 **Secure**: Files are processed locally on your server

## 🛠️ Technology Stack

- **Backend**: Flask (Python)
- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **PDF Processing**: PyPDF2
- **AI**: OpenAI GPT-3.5-turbo
- **CORS**: Flask-CORS

## 📋 Prerequisites

- Python 3.8 or higher
- OpenAI API key (get one at [platform.openai.com](https://platform.openai.com))

## 🚀 Installation

1. **Clone or navigate to the project directory**:
   ```bash
   cd pdf-assistant
   ```

2. **Create a virtual environment** (recommended):
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment**:
   - Windows:
     ```bash
     venv\Scripts\activate
     ```
   - macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

5. **Set up environment variables**:
   - Copy `.env.example` to `.env`:
     ```bash
     copy .env.example .env
     ```
   - Edit `.env` and add your OpenAI API key:
     ```
     OPENAI_API_KEY=your_actual_api_key_here
     ```

## 🎯 Usage

1. **Start the Flask server**:
   ```bash
   python app.py
   ```

2. **Open your browser** and navigate to:
   ```
   http://localhost:5000
   ```

3. **Upload a PDF**:
   - Click "Choose PDF File" button
   - Select a PDF file from your computer
   - Wait for the upload to complete

4. **Ask questions**:
   - Type your question in the chat input
   - Press Enter or click Send
   - The AI will analyze the PDF content and respond

## 📁 Project Structure

```
pdf-assistant/
├── app.py              # Flask backend application
├── requirements.txt    # Python dependencies
├── .env.example       # Environment variables template
├── .env               # Your API keys (not in git)
├── .gitignore         # Git ignore rules
├── static/            # Frontend files
│   ├── index.html     # Main HTML page
│   ├── styles.css     # CSS styling
│   └── script.js      # JavaScript functionality
└── uploads/           # Uploaded PDF files (auto-created)
```

## 🔑 API Endpoints

- `GET /` - Serves the main HTML page
- `POST /upload` - Handles PDF file upload
- `POST /chat` - Processes chat messages and returns AI responses
- `GET /files` - Lists all uploaded PDF files

## ⚙️ Configuration

You can modify these settings in `app.py`:

- `MAX_FILE_SIZE`: Maximum upload file size (default: 16MB)
- `UPLOAD_FOLDER`: Directory for uploaded files (default: 'uploads')
- OpenAI model: Currently using `gpt-3.5-turbo` (can be changed to `gpt-4` for better results)

## 🐛 Troubleshooting

### "Failed to upload file" error
- Make sure the Flask server is running
- Check that the file is a valid PDF
- Verify the file size is under 16MB

### "Error communicating with AI" error
- Verify your OpenAI API key is correct in `.env`
- Check your OpenAI account has available credits
- Ensure you have internet connection

### Server won't start
- Make sure all dependencies are installed: `pip install -r requirements.txt`
- Check that port 5000 is not already in use
- Verify Python version is 3.8 or higher: `python --version`

## 💡 Tips

- For better accuracy, ask specific questions about the PDF content
- The AI can summarize sections, explain concepts, and find specific information
- Large PDFs may take longer to process
- The first 4000 characters of the PDF are used for context (can be adjusted in `app.py`)

## 🔒 Security Notes

- This is a demonstration application
- For production use, implement:
  - User authentication
  - Rate limiting
  - File size and type validation
  - Secure file storage
  - HTTPS encryption

## 📝 License

This project is open source and available for personal and educational use.

## 🤝 Contributing

Feel free to fork, improve, and submit pull requests!

## 📧 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Enjoy using PDF Assistant! 🎉**
