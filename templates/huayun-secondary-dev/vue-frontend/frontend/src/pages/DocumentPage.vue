<script setup>
import DocumentList from "../components/DocumentList.vue"
import { useDocuments } from "../composables/useDocuments.js"

const {
  documents,
  loading,
  error,
  keyword,
  status,
  loadDocuments,
  login,
} = useDocuments()
</script>

<template>
  <section class="document-page">
    <header class="document-page__header">
      <div>
        <p class="eyebrow">HUAYUN Secondary Dev</p>
        <h1>CrownCAD Documents</h1>
      </div>
      <button type="button" @click="login">OAuth2 Login</button>
    </header>

    <div class="toolbar">
      <input v-model="keyword" type="search" placeholder="Search documents" />
      <select v-model="status">
        <option value="">All statuses</option>
        <option value="draft">Draft</option>
        <option value="published">Published</option>
      </select>
      <button type="button" @click="loadDocuments">Refresh</button>
    </div>

    <p v-if="loading">Loading documents...</p>
    <p v-else-if="error">{{ error }}</p>
    <DocumentList v-else :documents="documents" />
  </section>
</template>
