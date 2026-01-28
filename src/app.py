from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
import PyPDF2
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__, static_folder='static')
CORS(app)

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf'}
MAX_FILE_SIZE = 16 * 1024 * 1024  # 16MB

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_FILE_SIZE

# Create upload folder if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

# Store PDF content in memory (for simplicity)
pdf_contents = {}


def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def extract_text_from_pdf(pdf_path):
    """Extract text content from PDF file"""
    text = ""
    try:
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
    except Exception as e:
        print(f"Error extracting text: {str(e)}")
        return None
    return text


@app.route('/')
def index():
    """Serve the main HTML page"""
    return send_from_directory('static', 'index.html')


@app.route('/upload', methods=['POST'])
def upload_file():
    """Handle PDF file upload"""
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Extract text from PDF
        text_content = extract_text_from_pdf(filepath)
        
        if text_content:
            # Store content with filename as key
            pdf_contents[filename] = text_content
            return jsonify({
                'message': 'File uploaded successfully',
                'filename': filename,
                'text_length': len(text_content)
            }), 200
        else:
            return jsonify({'error': 'Failed to extract text from PDF'}), 500
    
    return jsonify({'error': 'Invalid file type. Only PDF files are allowed'}), 400


@app.route('/chat', methods=['POST'])
def chat():
    """Handle chat messages and return AI responses"""
    data = request.json
    user_message = data.get('message', '')
    filename = data.get('filename', '')
    
    if not user_message:
        return jsonify({'error': 'No message provided'}), 400
    
    if not filename or filename not in pdf_contents:
        return jsonify({'error': 'No PDF file loaded. Please upload a PDF first.'}), 400
    
    pdf_text = pdf_contents[filename]
    
    try:
        # Create chat completion with OpenAI
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": f"You are a helpful assistant that answers questions about the following PDF document:\n\n{pdf_text[:4000]}"  # Limit context to avoid token limits
                },
                {
                    "role": "user",
                    "content": user_message
                }
            ],
            max_tokens=500,
            temperature=0.7
        )
        
        ai_response = response.choices[0].message.content
        
        return jsonify({
            'response': ai_response
        }), 200
    
    except Exception as e:
        return jsonify({'error': f'Error communicating with AI: {str(e)}'}), 500


@app.route('/files', methods=['GET'])
def list_files():
    """List all uploaded PDF files"""
    files = list(pdf_contents.keys())
    return jsonify({'files': files}), 200


if __name__ == '__main__':
    app.run(debug=True, port=5000)
