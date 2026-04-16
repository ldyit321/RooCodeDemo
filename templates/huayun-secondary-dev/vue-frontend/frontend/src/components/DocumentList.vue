<script setup>
defineProps({
  documents: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <div v-if="documents.length === 0">No documents found.</div>
  <div v-else class="document-list">
    <article v-for="doc in documents" :key="doc.docId" class="document-card">
      <h2>{{ doc.docName || "Untitled document" }}</h2>
      <p>Status: {{ doc.status || "unknown" }}</p>
      <p>Folder: {{ doc.folderPath || "/" }}</p>
    </article>
  </div>
</template>
