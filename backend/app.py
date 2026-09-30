import os, secrets, datetime as dt
from functools import wraps
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash
import jwt

SECRET = os.environ.get("SECRET_KEY", "safeher-dev-secret-key-change-this-in-production-123456")
MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017")


def get_db():
    try:
        c = MongoClient(MONGO_URI, serverSelectionTimeoutMS=2000)
        c.admin.command("ping")
        print(">> Connected to MongoDB")
        return c["safeher"]
    except Exception:
        import mongomock
        print(">> MongoDB not running -> using in-memory database (data is lost on restart)")
        return mongomock.MongoClient()["safeher"]


db = get_db()
app = Flask(__name__)
CORS(app)


def ser(doc):
    if not doc:
        return None
    d = dict(doc)
    d["id"] = str(d.pop("_id"))
    d.pop("password", None)
    d.pop("user_id", None)
    for k, v in list(d.items()):
        if isinstance(v, dt.datetime):
            d[k] = v.isoformat() + "Z"
    return d


def auth(f):
    @wraps(f)
    def wrap(*a, **kw):
        h = request.headers.get("Authorization", "")
        try:
            data = jwt.decode(h.replace("Bearer ", ""), SECRET, algorithms=["HS256"])
            request.uid = data["uid"]
        except Exception:
            return jsonify(error="Please log in again"), 401
        return f(*a, **kw)
    return wrap


def make_token(uid):
    exp = dt.datetime.utcnow() + dt.timedelta(days=7)
    return jwt.encode({"uid": str(uid), "exp": exp}, SECRET, algorithm="HS256")


@app.post("/api/register")
def register():
    d = request.json or {}
    name, email, phone, pw = (d.get(k, "").strip() for k in ("name", "email", "phone", "password"))
    if not (name and email and pw):
        return jsonify(error="Name, email and password are required"), 400
    if len(pw) < 6:
        return jsonify(error="Password must be at least 6 characters"), 400
    email = email.lower()
    if db.users.find_one({"email": email}):
        return jsonify(error="Email already registered"), 409
    r = db.users.insert_one({"name": name, "email": email, "phone": phone,
                             "password": generate_password_hash(pw)})
    u = ser(db.users.find_one({"_id": r.inserted_id}))
    return jsonify(token=make_token(r.inserted_id), user=u)


@app.post("/api/login")
def login():
    d = request.json or {}
    u = db.users.find_one({"email": d.get("email", "").strip().lower()})
    if not u or not check_password_hash(u["password"], d.get("password", "")):
        return jsonify(error="Invalid email or password"), 401
    return jsonify(token=make_token(u["_id"]), user=ser(u))


@app.get("/api/me")
@auth
def me():
    return jsonify(user=ser(db.users.find_one({"_id": ObjectId(request.uid)})))


@app.get("/api/contacts")
@auth
def contacts():
    return jsonify([ser(c) for c in db.contacts.find({"user_id": request.uid})])


@app.post("/api/contacts")
@auth
def add_contact():
    d = request.json or {}
    if not d.get("name") or not d.get("phone"):
        return jsonify(error="Name and phone are required"), 400
    r = db.contacts.insert_one({"user_id": request.uid, "name": d["name"].strip(),
                                "phone": d["phone"].strip(), "relation": d.get("relation", "").strip()})
    return jsonify(ser(db.contacts.find_one({"_id": r.inserted_id})))


@app.delete("/api/contacts/<cid>")
@auth
def del_contact(cid):
    db.contacts.delete_one({"_id": ObjectId(cid), "user_id": request.uid})
    return jsonify(ok=True)


@app.post("/api/sos")
@auth
def start_sos():
    d = request.json or {}
    db.alerts.update_many({"user_id": request.uid, "status": "active"},
                          {"$set": {"status": "ended", "ended": dt.datetime.utcnow()}})
    now = dt.datetime.utcnow()
    doc = {"user_id": request.uid, "status": "active", "started": now, "updated": now,
           "lat": d.get("lat"), "lng": d.get("lng"), "token": secrets.token_urlsafe(8),
           "points": 1 if d.get("lat") is not None else 0}
    r = db.alerts.insert_one(doc)
    print(f">> SOS triggered by user {request.uid} at {d.get('lat')},{d.get('lng')}")
    return jsonify(ser(db.alerts.find_one({"_id": r.inserted_id})))


@app.post("/api/sos/<aid>/location")
@auth
def update_loc(aid):
    d = request.json or {}
    db.alerts.update_one({"_id": ObjectId(aid), "user_id": request.uid, "status": "active"},
                         {"$set": {"lat": d.get("lat"), "lng": d.get("lng"),
                                   "updated": dt.datetime.utcnow()}, "$inc": {"points": 1}})
    return jsonify(ok=True)


@app.post("/api/sos/<aid>/stop")
@auth
def stop_sos(aid):
    db.alerts.update_one({"_id": ObjectId(aid), "user_id": request.uid},
                         {"$set": {"status": "ended", "ended": dt.datetime.utcnow()}})
    return jsonify(ok=True)


@app.get("/api/alerts")
@auth
def alerts():
    items = [ser(a) for a in db.alerts.find({"user_id": request.uid})]
    return jsonify(sorted(items, key=lambda a: a["started"], reverse=True))


@app.get("/api/track/<token>")
def track(token):
    a = db.alerts.find_one({"token": token})
    if not a:
        return jsonify(error="Tracking link not found"), 404
    u = db.users.find_one({"_id": ObjectId(a["user_id"])})
    return jsonify(name=u["name"], phone=u.get("phone", ""), status=a["status"], lat=a.get("lat"),
                   lng=a.get("lng"), updated=a["updated"].isoformat() + "Z")


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
