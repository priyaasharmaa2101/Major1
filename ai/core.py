
import json
import os
import threading
import uuid

from datetime import datetime, timezone
from pathlib import Path

from dotenv import load_dotenv
from google import genai
from google.genai import types
from pydantic import BaseModel


BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
DATA_FILE = DATA_DIR / "records.json"

load_dotenv(BASE_DIR / ".env")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()
GEMINI_MODEL = os.getenv(
    "GEMINI_MODEL",
    "gemini-flash-latest"
).strip()

MODULES = [
    "committees",
    "recruitment",
    "grievances",
    "events",
    "admin_assistant"
]

_storage_lock = threading.RLock()


class AIConfigurationError(Exception):
    pass


class AIServiceError(Exception):
    pass


class StorageError(Exception):
    pass


class RecordNotFoundError(Exception):
    pass


def current_time():
    return datetime.now(timezone.utc).isoformat()


def serialize_content(content):
    if isinstance(content, BaseModel):
        return content.model_dump(mode="json")

    if isinstance(content, dict):
        return content

    raise ValueError("Content must be a dictionary or Pydantic model.")


def initialize_storage():
    try:
        DATA_DIR.mkdir(parents=True, exist_ok=True)

        with _storage_lock:
            if not DATA_FILE.exists():
                default_data = {
                    module: [] for module in MODULES
                }

                DATA_FILE.write_text(
                    json.dumps(default_data, indent=4),
                    encoding="utf-8"
                )

            _read_storage()

    except Exception as exc:
        raise StorageError(
            f"Could not initialize local storage: {exc}"
        ) from exc


def _read_storage():
    try:
        if not DATA_FILE.exists():
            return {module: [] for module in MODULES}

        data = json.loads(
            DATA_FILE.read_text(encoding="utf-8")
        )

        if not isinstance(data, dict):
            raise ValueError("Storage must contain a JSON object.")

        for module in MODULES:
            if module not in data:
                data[module] = []

            if not isinstance(data[module], list):
                raise ValueError(
                    f"Invalid storage format for {module}."
                )

        return data

    except Exception as exc:
        raise StorageError(
            f"Could not read local storage: {exc}"
        ) from exc


def _write_storage(data):
    try:
        DATA_DIR.mkdir(parents=True, exist_ok=True)

        temporary_file = DATA_FILE.with_suffix(".tmp")

        temporary_file.write_text(
            json.dumps(data, indent=4, ensure_ascii=False),
            encoding="utf-8"
        )

        temporary_file.replace(DATA_FILE)

    except Exception as exc:
        raise StorageError(
            f"Could not save local storage: {exc}"
        ) from exc


def generate_json(prompt, response_model):
    if not GEMINI_API_KEY or GEMINI_API_KEY == (
        "PASTE_YOUR_GEMINI_API_KEY_HERE"
    ):
        raise AIConfigurationError(
            "Gemini API key is missing. Add it to CampusSync_AI/.env."
        )

    try:
        client = genai.Client(api_key=GEMINI_API_KEY)

        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=response_model,
                temperature=0.4,
                max_output_tokens=4096
            )
        )

        parsed = getattr(response, "parsed", None)

        if parsed is not None:
            if isinstance(parsed, BaseModel):
                return parsed.model_dump(mode="json")

            if isinstance(parsed, dict):
                return parsed

        response_text = getattr(response, "text", None)

        if not response_text:
            raise ValueError("Gemini returned an empty response.")

        return json.loads(response_text)

    except AIConfigurationError:
        raise

    except Exception as exc:
        raise AIServiceError(
            f"Gemini request failed: {exc}"
        ) from exc


def create_draft(module, content):
    if module not in MODULES:
        raise ValueError("Invalid module.")

    clean_content = serialize_content(content)

    record = {
        "id": str(uuid.uuid4()),
        "module": module,
        "status": "draft",
        "content": clean_content,
        "created_at": current_time(),
        "updated_at": current_time()
    }

    with _storage_lock:
        data = _read_storage()
        data[module].append(record)
        _write_storage(data)

    return record


def list_records(module):
    if module not in MODULES:
        raise ValueError("Invalid module.")

    with _storage_lock:
        data = _read_storage()
        return data[module]


def get_record(module, record_id):
    if module not in MODULES:
        raise ValueError("Invalid module.")

    with _storage_lock:
        data = _read_storage()

        for record in data[module]:
            if record["id"] == record_id:
                return record

    raise RecordNotFoundError("Record not found.")


def update_draft(module, record_id, content):
    if module not in MODULES:
        raise ValueError("Invalid module.")

    clean_content = serialize_content(content)

    with _storage_lock:
        data = _read_storage()

        for record in data[module]:
            if record["id"] == record_id:

                if record["status"] != "draft":
                    raise ValueError(
                        "Only draft records can be edited."
                    )

                record["content"] = clean_content
                record["updated_at"] = current_time()

                _write_storage(data)
                return record

    raise RecordNotFoundError("Record not found.")


def approve_record(module, record_id):
    if module not in MODULES:
        raise ValueError("Invalid module.")

    with _storage_lock:
        data = _read_storage()

        for record in data[module]:
            if record["id"] == record_id:

                if record["status"] != "draft":
                    raise ValueError(
                        "Only draft records can be approved."
                    )

                record["status"] = "approved"
                record["approved_at"] = current_time()
                record["updated_at"] = current_time()

                _write_storage(data)
                return record

    raise RecordNotFoundError("Record not found.")



def delete_record(module, record_id):
    if module not in MODULES:
        raise ValueError("Invalid module.")

    with _storage_lock:
        data = _read_storage()

        for index, record in enumerate(data[module]):
            if record["id"] == record_id:
                deleted_record = data[module].pop(index)
                _write_storage(data)
                return deleted_record

    raise RecordNotFoundError("Record not found.")
