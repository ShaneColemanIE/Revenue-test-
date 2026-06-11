from fastapi import APIRouter, HTTPException

from app.api.schemas import AskRequest, AskResponse, HealthResponse
from app.ingestion.indexer import count_chunks
from app.qa.answerer import answer_question

router = APIRouter(prefix="/api")

VALID_CATEGORIES = {"tax_rates", "tdm", "guidance", "ebrief", "cro"}


@router.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(status="ok", indexed_chunks=count_chunks())


@router.post("/ask", response_model=AskResponse)
def ask(request: AskRequest) -> AskResponse:
    if request.category and request.category not in VALID_CATEGORIES:
        raise HTTPException(status_code=400, detail=f"category must be one of {sorted(VALID_CATEGORIES)}")

    try:
        result = answer_question(request.question, top_k=request.top_k, category=request.category)
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc

    return AskResponse(**result)
