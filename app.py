import os
import google.generativeai as genai
from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

# 1. Configuração da API (Recomendável usar variáveis de ambiente no futuro)
api_key = "AIzaSyCxMZperp0roESnMtpz4_v6grj-u8NBlwo"
genai.configure(api_key=api_key)

# 2. Configurações Globais do Modelo
generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
}

# Inicializa o modelo (Gemini 2.5 Flash é a melhor escolha para velocidade)
model = genai.GenerativeModel(
    model_name="models/gemini-2.5-flash",
    generation_config=generation_config
)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    user_input = request.json.get("message")
    
    if not user_input:
        return jsonify({"error": "Mensagem vazia"}), 400
        
    try:
        # Inicia uma sessão de chat limpa a cada requisição
        # Se quiser manter histórico, você precisará salvar a 'history' em uma variável ou banco
        chat_session = model.start_chat(history=[])
        response = chat_session.send_message(user_input)
        
        return jsonify({"response": response.text})
    
    except Exception as e:
        print(f"Erro na API: {e}")
        return jsonify({"error": "Falha ao processar a mensagem"}), 500

if __name__ == "__main__":
    # Pega a porta do sistema ou usa 5000 como padrão
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)