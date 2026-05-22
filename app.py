from flask import Flask, request, jsonify, render_template, redirect, url_for, session
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from config import Config
from models import db, User, Admin, Applicant
import time
import click

app = Flask(
    __name__,
    template_folder="templates",
    static_folder="static"
)

app.config.from_object(Config)

db.init_app(app)

login_manager = LoginManager()
login_manager.init_app(app)

login_manager.login_view = "login"

with app.app_context():
    db.create_all()

@login_manager.user_loader
def load_user(user_id):
    return Admin.query.get(int(user_id))

@login_manager.unauthorized_handler
def unauthorized():

    if request.path.startswith("/api/"):

        return jsonify({
            "error": "Login required"
        }), 401

    return redirect(url_for("login"))

@app.route("/api/login", methods=["POST"])
def api_login():
    data = request.json

    username = data.get("username")
    password = data.get("password")

    admin = Admin.query.filter_by(
        username=username
    ).first()

    if not admin:
        time.sleep(1)

        return jsonify({
            "error": "Invalid username"
        }), 401

    if not admin.check_password(password):

        time.sleep(1)

        return jsonify({
            "error": "Invalid password"
        }), 401

    login_user(admin)

    return jsonify({
        "success": True
    })

@app.route("/logout")
@login_required
def logout():
    logout_user()

    return redirect("/")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/admin")
@login_required
def admin():
    return render_template("admin.html")

@app.route("/login")
def login():
    return render_template("login.html")

@app.route("/test")
def test():
    return render_template("test.html")

@app.route("/api/testing/me")
def me():
    user = get_tester()
    if not user:
        return jsonify({"logged_in": False}), 401

    return jsonify({
        "logged_in": True,
        "username": user.username
    })

@app.route("/api/testing/session", methods=["POST"])
def testing_session():
    data = request.get_json(silent=True) or {}
    username = (data.get("username") or "").strip()[:64]
    bank_raw = data.get("bank_account_number")

    if not username:
        return jsonify({"error": "Username required"}), 400

    try:
        bank_account_number = int(bank_raw)
    except (TypeError, ValueError):
        return jsonify({"error": "Valid bank account number required"}), 400

    user = User.query.filter_by(
        username=username,
        bank_account_number=bank_account_number,
    ).first()

    if not user:
        return jsonify({"error": "Invalid username or bank account number"}), 401

    session.permanent = True
    session["user_id"] = user.id
    return jsonify(user.to_dict())

@app.route("/api/testing/logout", methods=["POST"])
def testing_logout():
    session.pop("user_id", None)
    return jsonify({"success": True})

def get_tester():
    user_id = session.get("user_id")
    if not user_id:
        return None
    return db.session.get(User, user_id)

@app.route("/api/testing/finished", methods=["POST"])
def testing_finished():
    user = get_tester()

    if not user:
        return jsonify({"error": "Not signed in"}), 401

    applicant = Applicant.query.filter_by(username=user.username, bank_account_number=user.bank_account_number).first()
    if applicant:
        if applicant.done:
            return redirect("/")
    if not applicant:
        applicant = Applicant(username=user.username, bank_account_number=user.bank_account_number)
    data = request.form
    score = 0

    q1answer = data.get("q1a3")
    q2answer = data.get("q2a2")
    q3answer = data.get("q3a1")
    q4answer = data.get("q4a2")
    q5answer = data.get("q5a4")
    q6answer = data.get("q6a2")
    q7answer = data.get("q7a3")
    q8answer = data.get("q8a1")
    q9answer = data.get("q9a2")
    q10answer = data.get("q10a3")
    q11answer = data.get("q11a4")
    q12answer = data.get("q12a1")
    q13answer = data.get("q13a1")
    q14answer = data.get("q14a1")
    q15answer = data.get("q15a2")
    q16answer = data.get("q16a3")
    q17answer = data.get("q17a2")
    q18answer = data.get("q18a4")
    q19answer = data.get("q19a2")
    q20answer = data.get("q20a1")

    if q1answer:
        score += 5
    if q2answer:
        score += 5
    if q3answer:
        score += 5
    if q4answer:
        score += 5
    if q5answer:
        score += 5
    if q6answer:
        score += 5
    if q7answer:
        score += 5
    if q8answer:
        score += 5
    if q9answer:
        score += 5
    if q10answer:
        score += 5
    if q11answer:
        score += 5
    if q12answer:
        score += 5
    if q13answer:
        score += 5
    if q14answer:
        score += 5
    if q15answer:
        score += 5
    if q16answer:
        score += 5
    if q17answer:
        score += 5
    if q18answer:
        score += 5
    if q19answer:
        score += 5
    if q20answer:
        score += 5

    db.session.add(applicant)
    db.session.flush()
    applicant.score = score
    applicant.done = True
    db.session.commit()
    return redirect("/")

