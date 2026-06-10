from pydantic import BaseModel, Field


class AskRequest(BaseModel):
    question: str = Field(..., min_length=1, max_length=2000)
    top_k: int | None = Field(default=None, ge=1, le=20)
    category: str | None = Field(default=None, description="tax_rates | tdm | guidance | ebrief")


class Source(BaseModel):
    title: str
    url: str
    category: str


class AskResponse(BaseModel):
    answer: str
    sources: list[Source]


class HealthResponse(BaseModel):
    status: str
    indexed_chunks: int
