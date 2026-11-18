
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Body
from pydantic import BaseModel, ValidationError

from core import (
    MODULES,
    initialize_storage,
    list_records,
    get_record,
    update_draft,
    approve_record,
    delete_record,
    AIConfigurationError,
    AIServiceError,
    StorageError,
    RecordNotFoundError
)

from modules import (
    generate_committee,
    assess_recruitment,
    assess_grievance,
    generate_event_plan,
    assist_administrator,
    create_manual_draft,
    ai_edit_draft
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    initialize_storage()
    yield


app = FastAPI(
    title="CampusSync AI Service",
    description=(
        "AI assistance for committees, recruitment, "
        "grievances, events and administration."
    ),
    version="1.0.0",
    lifespan=lifespan
)


class AIEditRequest(BaseModel):
    instruction: str


def check_module(module):
    if module not in MODULES:
        raise HTTPException(
            status_code=404,
            detail="Invalid AI module."
        )


def handle_validation_error(exc):
    raise HTTPException(
        status_code=422,
        detail=exc.errors()
    )


@app.get("/")
def root():
    return {
        "message": "CampusSync AI Service is running.",
        "docs": "/docs",
        "modules": MODULES
    }


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "CampusSync AI"
    }


# --------------------------------------------------
# AI GENERATION ENDPOINTS
# --------------------------------------------------

@app.post("/api/ai/committees/generate")
def committee_generate(data: dict = Body(...)):
    try:
        return generate_committee(data)

    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    except AIConfigurationError as exc:
        raise HTTPException(status_code=503, detail=str(exc))

    except AIServiceError as exc:
        raise HTTPException(status_code=502, detail=str(exc))


@app.post("/api/ai/recruitment/assess")
def recruitment_assess(data: dict = Body(...)):
    try:
        return assess_recruitment(data)

    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    except AIConfigurationError as exc:
        raise HTTPException(status_code=503, detail=str(exc))

    except AIServiceError as exc:
        raise HTTPException(status_code=502, detail=str(exc))


@app.post("/api/ai/grievances/assess")
def grievance_assess(data: dict = Body(...)):
    try:
        return assess_grievance(data)

    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    except AIConfigurationError as exc:
        raise HTTPException(status_code=503, detail=str(exc))

    except AIServiceError as exc:
        raise HTTPException(status_code=502, detail=str(exc))


@app.post("/api/ai/events/plan")
def event_plan(data: dict = Body(...)):
    try:
        return generate_event_plan(data)

    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    except AIConfigurationError as exc:
        raise HTTPException(status_code=503, detail=str(exc))

    except AIServiceError as exc:
        raise HTTPException(status_code=502, detail=str(exc))


@app.post("/api/ai/admin-assistant/assist")
def admin_assist(data: dict = Body(...)):
    try:
        return assist_administrator(data)

    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    except AIConfigurationError as exc:
        raise HTTPException(status_code=503, detail=str(exc))

    except AIServiceError as exc:
        raise HTTPException(status_code=502, detail=str(exc))


# --------------------------------------------------
# MANUAL DRAFT CREATION
# Works for all five modules.
# --------------------------------------------------

@app.post("/api/ai/{module}/manual")
def manual_create(
    module: str,
    content: dict = Body(...)
):
    check_module(module)

    try:
        return create_manual_draft(module, content)

    except ValidationError as exc:
        handle_validation_error(exc)

    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))


# --------------------------------------------------
# GET ALL DRAFTS
# --------------------------------------------------

@app.get("/api/ai/{module}/drafts")
def get_all_drafts(module: str):
    check_module(module)

    try:
        return list_records(module)

    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))


# --------------------------------------------------
# GET ONE DRAFT
# --------------------------------------------------

@app.get("/api/ai/{module}/drafts/{record_id}")
def get_one_draft(module: str, record_id: str):
    check_module(module)

    try:
        return get_record(module, record_id)

    except RecordNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc))


# --------------------------------------------------
# MANUAL EDIT
# Admin submits the complete edited content.
# --------------------------------------------------

@app.put("/api/ai/{module}/drafts/{record_id}")
def edit_draft(
    module: str,
    record_id: str,
    content: dict = Body(...)
):
    check_module(module)

    try:
        # Validate content against that module's schema.
        from modules import EDITABLE_SCHEMAS

        validated_content = EDITABLE_SCHEMAS[module].model_validate(
            content
        )

        return update_draft(
            module,
            record_id,
            validated_content
        )

    except ValidationError as exc:
        handle_validation_error(exc)

    except RecordNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc))

    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))


# --------------------------------------------------
# AI EDIT SUGGESTION
# Does not overwrite or save the existing draft.
# --------------------------------------------------

@app.post("/api/ai/{module}/drafts/{record_id}/ai-edit")
def suggest_ai_edit(
    module: str,
    record_id: str,
    request: AIEditRequest
):
    check_module(module)

    try:
        existing_record = get_record(module, record_id)

        if existing_record["status"] != "draft":
            raise HTTPException(
                status_code=400,
                detail="Only draft records can receive AI suggestions."
            )

        suggestion = ai_edit_draft(
            module=module,
            current_content=existing_record["content"],
            edit_instruction=request.instruction
        )

        return {
            "message": (
                "AI suggestion generated. "
                "Existing draft has not been changed."
            ),
            "record_id": record_id,
            "suggestion": suggestion
        }

    except RecordNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc))

    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    except AIConfigurationError as exc:
        raise HTTPException(status_code=503, detail=str(exc))

    except AIServiceError as exc:
        raise HTTPException(status_code=502, detail=str(exc))


# --------------------------------------------------
# ADMIN APPROVAL
# --------------------------------------------------

@app.post("/api/ai/{module}/drafts/{record_id}/approve")
def approve_draft(module: str, record_id: str):
    check_module(module)

    try:
        return approve_record(module, record_id)

    except RecordNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc))

    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))


# --------------------------------------------------
# DELETE DRAFT
# --------------------------------------------------

@app.delete("/api/ai/{module}/drafts/{record_id}")
def remove_draft(module: str, record_id: str):
    check_module(module)

    try:
        deleted = delete_record(module, record_id)

        return {
            "message": "Record deleted successfully.",
            "record": deleted
        }

    except RecordNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
