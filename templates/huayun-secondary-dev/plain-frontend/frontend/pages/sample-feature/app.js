import { ensureAuthenticated } from "../../shared/auth/oauth.js"
import { createDocumentApi } from "../../shared/api/document.js"
import { createHttpClient } from "../../shared/api/http.js"

const statusPanel = document.querySelector("#statusPanel")
const documentList = document.querySelector("#documentList")
const loginButton = document.querySelector("#loginButton")
const refreshButton = document.querySelector("#refreshButton")
const searchInput = document.querySelector("#searchInput")
const statusFilter = document.querySelector("#statusFilter")

const httpClient = createHttpClient({
	baseUrl: window.__CROWNCAD_API_BASE_URL__ || "/api",
})

const documentApi = createDocumentApi(httpClient)

const state = {
	documents: [],
	loading: false,
	error: "",
}

function render() {
	if (state.loading) {
		statusPanel.textContent = "Loading documents..."
		documentList.innerHTML = ""
		return
	}

	if (state.error) {
		statusPanel.textContent = state.error
		return
	}

	if (state.documents.length === 0) {
		statusPanel.textContent = "No documents found."
		documentList.innerHTML = ""
		return
	}

	statusPanel.textContent = `Loaded ${state.documents.length} document(s).`
	documentList.innerHTML = state.documents
		.map(
			(doc) => `
        <article class="document-card">
          <h2>${doc.docName || "Untitled document"}</h2>
          <p>Status: ${doc.status || "unknown"}</p>
          <p>Folder: ${doc.folderPath || "/"}</p>
        </article>
      `,
		)
		.join("")
}

async function loadDocuments() {
	state.loading = true
	state.error = ""
	render()

	try {
		await ensureAuthenticated()
		state.documents = await documentApi.listDocuments({
			keyword: searchInput.value.trim(),
			status: statusFilter.value,
		})
	} catch (error) {
		state.error = error instanceof Error ? error.message : "Failed to load documents."
	} finally {
		state.loading = false
		render()
	}
}

loginButton?.addEventListener("click", () => {
	ensureAuthenticated({ forceLogin: true }).catch(() => {})
})

refreshButton?.addEventListener("click", () => {
	loadDocuments()
})

searchInput?.addEventListener("change", loadDocuments)
statusFilter?.addEventListener("change", loadDocuments)

loadDocuments()
