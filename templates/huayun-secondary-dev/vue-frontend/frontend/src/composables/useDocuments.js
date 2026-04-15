import { onMounted, ref } from "vue"
import { ensureAuthenticated } from "../services/authService.js"
import { listDocuments } from "../services/documentService.js"

export function useDocuments() {
	const documents = ref([])
	const loading = ref(false)
	const error = ref("")
	const keyword = ref("")
	const status = ref("")

	async function loadDocuments() {
		loading.value = true
		error.value = ""

		try {
			await ensureAuthenticated()
			documents.value = await listDocuments({
				keyword: keyword.value.trim(),
				status: status.value,
			})
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to load documents."
		} finally {
			loading.value = false
		}
	}

	function login() {
		return ensureAuthenticated({ forceLogin: true })
	}

	onMounted(loadDocuments)

	return { documents, loading, error, keyword, status, loadDocuments, login }
}
