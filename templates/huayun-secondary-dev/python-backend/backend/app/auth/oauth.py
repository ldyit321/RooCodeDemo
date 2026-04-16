from app.utils.config import settings


async def get_access_token() -> str:
    if not settings.crowncad_access_token:
        raise RuntimeError(
            "Missing CrownCAD access token. Implement token exchange or refresh before calling CrownCAD APIs."
        )

    return settings.crowncad_access_token
