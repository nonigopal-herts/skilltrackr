"""
Parsing service: provides /parse-resume and /embed.
- /parse-resume reads a file from a shared uploads directory and extracts skills using spaCy PhraseMatcher + synonyms.
- /embed returns sentence-transformer embeddings for provided texts.
"""
from fastapi import FastAPI
from pydantic import BaseModel
import os
import fitz  # PyMuPDF
import docx
import spacy
from spacy.matcher import PhraseMatcher
from sentence_transformers import SentenceTransformer
import csv

UPLOAD_DIR = os.environ.get("UPLOAD_DIR", "/data/uploads")

app = FastAPI(title="Parsing & Embedding Service", version="1.0")

# --- Load skills (local CSV with synonyms) ---
skills_path = os.path.join(os.path.dirname(__file__), "skills.csv")
SKILLS = []  # list of (canonical_name, [variants...])
with open(skills_path, newline='', encoding='utf-8') as f:
  reader = csv.DictReader(f)
  for row in reader:
    name = row["name"].strip()
    syns = [s.strip() for s in (row.get("synonyms") or "").split("|") if s.strip()]
    variants = set([name] + syns)
    SKILLS.append((name, sorted(variants)))

# --- Initialize spaCy and matcher ---
try:
  nlp = spacy.load("en_core_web_sm")
except OSError:
  from spacy.cli import download
  download("en_core_web_sm")
  nlp = spacy.load("en_core_web_sm")

matcher = PhraseMatcher(nlp.vocab, attr="LOWER")
for name, variants in SKILLS:
  patterns = [nlp.make_doc(v) for v in variants]
  matcher.add(name, patterns)

# --- Embedding model ---
model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

def read_file_text(file_path: str) -> str:
  if file_path.lower().endswith(".pdf"):
    text = []
    with fitz.open(file_path) as doc:
      for page in doc:
        text.append(page.get_text())
    return "\n".join(text)
  elif file_path.lower().endswith(".docx"):
    d = docx.Document(file_path)
    return "\n".join([p.text for p in d.paragraphs])
  return ""

def extract_skills(text: str):
  doc = nlp(text)
  matches = matcher(doc)
  hits = {}
  for match_id, start, end in matches:
    canonical = nlp.vocab.strings[match_id]
    surface = doc[start:end].text
    hits.setdefault(canonical, set()).add(surface)
  results = []
  for canonical, surfaces in hits.items():
    conf = min(1.0, len(surfaces) / 2.0)  # crude confidence
    results.append({"name": canonical, "surfaces": sorted(list(surfaces)), "confidence": round(conf, 2)})
  results.sort(key=lambda x: (-x["confidence"], x["name"].lower()))
  return results

class ParseReq(BaseModel):
  file_path: str

class ParseResp(BaseModel):
  skills: list
  text_excerpt: str
  stats: dict

@app.post("/parse-resume", response_model=ParseResp)
def parse_resume(req: ParseReq):
  fp = req.file_path
  if not fp.startswith(UPLOAD_DIR):
    return {"skills": [], "text_excerpt": "", "stats": {"error": "invalid path"}}
  text = read_file_text(fp)
  skills = extract_skills(text)
  return {"skills": skills, "text_excerpt": text[:2000], "stats": {"chars": len(text)}}

class EmbedReq(BaseModel):
  texts: list[str]

class EmbedResp(BaseModel):
  vectors: list[list[float]]

@app.post("/embed", response_model=EmbedResp)
def embed(req: EmbedReq):
  vecs = model.encode(req.texts, normalize_embeddings=True)
  return {"vectors": [v.tolist() for v in vecs]}
