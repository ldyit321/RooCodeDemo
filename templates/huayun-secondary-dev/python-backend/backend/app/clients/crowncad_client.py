import httpx

from app.auth.oauth import get_access_token
from app.utils.config import settings


class CrownCADClient:
    async def get_documents(self, **params):
        return await self._request("GET", "/api/document", params=params)

    async def create_document(self, payload: dict):
        return await self._request("POST", "/api/document", json=payload)

    async def _request(self, method: str, path: str, **kwargs):
        async with httpx.AsyncClient(base_url=settings.crowncad_api_base_url, timeout=20.0) as client:
            response = await client.request(
                method,
                path,
                headers={"Authorization": f"Bearer {await get_access_token()}"},
                **kwargs,
            )

        payload = response.json()
        if response.status_code >= 400 or payload.get("code") != 0:
            raise RuntimeError(payload.get("message", "CrownCAD request failed."))

        return payload.get("data")
