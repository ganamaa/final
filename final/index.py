from flask import Flask,render_template

app = Flask(__name__)
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/buscaFlores/')
def buscaFlores():
    return render_template('buscaFlores.html')

@app.route('/2048/')
def J2048():
    return render_template('2048.html')

@app.route('/caza-calaberas/')
def cazaCalabera():
    return render_template('caza-calaberas.html')

@app.route('/paloma/')
def paloma():
    return render_template('paloma.html')

@app.route('/saltarin/')
def saltarin():
    return render_template('juego1.html')

@app.route('/corre-virus/')
def corre():
    return render_template('juego.html')

if __name__=='__main__':
    app.run(debug=True)